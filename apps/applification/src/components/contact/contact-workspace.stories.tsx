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

  const contractRoute = canvas.getByRole("radio", {
    name: /Contract enquiry/,
  });
  await userEvent.click(contractRoute);
  await expect(contractRoute).toHaveAttribute("aria-checked", "true");
  const contactShell = canvasElement.querySelector<HTMLElement>(
    "[data-contact-shell]",
  );
  await expect(contactShell).not.toBeNull();
  await waitFor(() =>
    expect(getComputedStyle(contractRoute).backgroundColor).toBe(
      getComputedStyle(contactShell!).backgroundColor,
    ),
  );
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
  await expect(getComputedStyle(selectedRoute!).backgroundColor).toBe(
    getComputedStyle(contactShell!).backgroundColor,
  );
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
