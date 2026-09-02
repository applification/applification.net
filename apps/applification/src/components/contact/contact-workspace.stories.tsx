import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ContactWorkspace } from "./contact-workspace";

const meta = {
  title: "Contact/Workspace",
  component: ContactWorkspace,
  args: {
    initialRoute: null,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ContactWorkspace>;

export default meta;
type Story = StoryObj<typeof meta>;

async function checkSendAlignment(canvasElement: HTMLElement) {
  const send = within(canvasElement).getByRole("button", { name: "Submit" });
  const composer = send.closest("[data-slot='input-group']")!;
  await waitFor(() => {
    const inset = composer.getBoundingClientRect().right - send.getBoundingClientRect().right;
    expect(inset).toBeGreaterThanOrEqual(0);
    expect(inset).toBeLessThanOrEqual(16);
  });
}

async function checkWorkspace(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);

  await expect(
    canvas.getByRole("heading", {
      name: "Start with a message. End with a checked brief.",
    }),
  ).toBeVisible();
  await expect(canvas.getByText("Enquiry assistant")).toBeVisible();
  await expect(
    canvas.getByText(/Your enquiry is only sent after you review/),
  ).toBeVisible();

  await checkSendAlignment(canvasElement);
  for (const name of ["Product enquiry", "General enquiry"]) {
    await userEvent.click(canvas.getByRole("radio", { name }));
    await checkSendAlignment(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Restart" }));
  }

  const contractRoute = canvas.getByRole("radio", {
    name: /Contract enquiry/,
  });
  await userEvent.click(contractRoute);
  await checkSendAlignment(canvasElement);
  await expect(contractRoute).toHaveAttribute("aria-checked", "true");
  const contactShell = canvasElement.querySelector<HTMLElement>(
    "[data-contact-shell]",
  );
  await expect(contactShell).not.toBeNull();
  await waitFor(() =>
    expect(getComputedStyle(contractRoute).backgroundColor).not.toBe(
      getComputedStyle(contactShell!).backgroundColor,
    ),
  );
  await waitFor(() => expect(getComputedStyle(contractRoute).backgroundColor).not.toBe("rgba(0, 0, 0, 0)"));
  await expect(
    canvas.getByText(/Tell me about the company, the work and when/),
  ).toBeVisible();

  const message = canvas.getByRole("textbox", { name: "Describe your enquiry" });
  await userEvent.type(message, "A three-month React contract from October.");
  await userEvent.click(canvas.getByRole("button", { name: "Submit" }));
  await expect(
    canvas.getByText("A three-month React contract from October.", { selector: "p" }),
  ).toBeVisible();
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  );
}

async function checkSmallPhoneWorkspace(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const workspaceBody = canvasElement.querySelector<HTMLElement>(
    "[data-contact-workspace-body]",
  );
  const routeOptions = canvas.getByRole("radiogroup", {
    name: "Choose an enquiry route",
  });
  const routeButtons = within(routeOptions).getAllByRole("radio");
  const composer = canvasElement.querySelector<HTMLElement>(
    "form [data-slot='input-group']",
  );

  await expect(workspaceBody).not.toBeNull();
  await expect(workspaceBody!.getBoundingClientRect().height + 56).toBeLessThanOrEqual(
    window.innerHeight - 24,
  );
  await expect(routeButtons.every((button) => button.offsetHeight >= 44)).toBe(true);
  await expect(routeButtons.every((button) => button.offsetHeight <= 48)).toBe(true);
  await expect(composer).not.toBeNull();
  await expect(composer!.offsetHeight).toBeLessThanOrEqual(58);

  await userEvent.click(routeButtons[0]!);
  const selectedRoute = canvasElement.querySelector<HTMLElement>(
    "[data-contact-selected-route]",
  );
  const contactShell = canvasElement.querySelector<HTMLElement>(
    "[data-contact-shell]",
  );
  await expect(selectedRoute).not.toBeNull();
  await expect(contactShell).not.toBeNull();
  await expect(
    within(selectedRoute!).getByText("Contract", { selector: "span" }),
  ).toBeVisible();
  await expect(getComputedStyle(selectedRoute!).backgroundColor).not.toBe(
    getComputedStyle(contactShell!).backgroundColor,
  );
  await expect(getComputedStyle(selectedRoute!).backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  await expect(
    canvas.queryByRole("radiogroup", { name: "Choose an enquiry route" }),
  ).not.toBeInTheDocument();
  await expect(
    canvas.getByText(/Tell me about the company, the work and when/),
  ).toBeVisible();
}

export const DesktopLight: Story = { play: ({ canvasElement }) => checkWorkspace(canvasElement) };

export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: ({ canvasElement }) => checkWorkspace(canvasElement),
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: ({ canvasElement }) => checkWorkspace(canvasElement),
};

export const IPhoneSELight: Story = {
  globals: { viewport: { value: "iphoneSe", isRotated: false } },
  play: ({ canvasElement }) => checkSmallPhoneWorkspace(canvasElement),
};

export const IPhoneSEDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "iphoneSe", isRotated: false },
  },
  play: ({ canvasElement }) => checkSmallPhoneWorkspace(canvasElement),
};

export const SmallIPhoneSELight: Story = {
  globals: { viewport: { value: "iphoneSeSmall", isRotated: false } },
  play: ({ canvasElement }) => checkSmallPhoneWorkspace(canvasElement),
};

export const ProductPreselected: Story = {
  args: { initialProduct: "contexture", initialRoute: "product" },
};

export const ManualCompletion: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Prefer to fill in the details yourself?" }));
    const form = within(canvas.getByRole("form", { name: "Complete enquiry manually" }));
    await userEvent.type(form.getByRole("textbox", { name: "Subject" }), "Detailed enquiry");
    await userEvent.type(form.getByRole("textbox", { name: /Your message/ }), "A detailed enquiry that must survive without AI. ".repeat(12));
    await userEvent.type(form.getByRole("textbox", { name: "Your name" }), "Alex Visitor");
    await userEvent.type(form.getByRole("textbox", { name: "Reply email" }), "alex@example.com");
    await userEvent.click(form.getByRole("button", { name: "Review enquiry" }));
    await expect(canvas.getByText("alex@example.com")).toBeVisible();
    await expect(canvas.getAllByText("Detailed enquiry", { exact: true })[0]).toBeVisible();
  },
};

export const ManualCompletionDark: Story = { ...ManualCompletion, globals: { theme: "dark" } };
export const ManualCompletionMobile: Story = { ...ManualCompletion, globals: { viewport: { value: "mobile", isRotated: false } } };
export const ManualCompletionMobileDark: Story = { ...ManualCompletion, globals: { theme: "dark", viewport: { value: "mobile", isRotated: false } } };

export const MessageTooLong: Story = {
  args: { initialRoute: "contract" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Describe your enquiry" });
    await userEvent.click(input);
    await userEvent.paste("x".repeat(12001));
    await expect(input).toHaveValue("x".repeat(12001));
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(canvas.getByRole("alert")).toHaveTextContent("1 character over the 12,000-character limit");
    await expect(canvas.getByRole("button", { name: "Submit" })).toBeDisabled();
    const group = input.closest<HTMLElement>("[data-slot='input-group']")!;
    await waitFor(() => expect(getComputedStyle(group).borderTopColor).toBe(getComputedStyle(canvas.getByRole("alert")).color));
    await userEvent.keyboard("{Backspace}");
    await expect(input).toHaveValue("x".repeat(12000));
    await expect(input).toHaveAttribute("aria-invalid", "false");
    await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Submit" })).toBeEnabled();
    await userEvent.paste("x");
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};
export const MessageTooLongDark: Story = { ...MessageTooLong, globals: { theme: "dark" } };
export const MessageTooLongMobile: Story = { ...MessageTooLong, globals: { viewport: { value: "mobile", isRotated: false } } };
export const MessageTooLongMobileDark: Story = { ...MessageTooLong, globals: { theme: "dark", viewport: { value: "mobile", isRotated: false } } };
