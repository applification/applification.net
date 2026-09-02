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
  await expect(canvasElement.querySelector('a[href^="mailto:"]')).not.toBeInTheDocument();
  const canvas = within(canvasElement);

  await expect(
    canvas.getByRole("heading", {
      name: "Tell me about the work. Try an AI workflow.",
    }),
  ).toBeVisible();
  await expect(canvas.getByText("Enquiry assistant")).toBeVisible();
  await expect(
    canvas.getByText(/Your enquiry is only sent after you review/),
  ).toBeVisible();
  const disclosure = canvasElement.querySelector(".contact-workflow-disclosure")!;
  await expect(disclosure.closest("[data-contact-shell]")).toBeNull();
  await expect(disclosure).not.toHaveAttribute("open");

  await checkSendAlignment(canvasElement);
  const shellBounds = canvasElement.querySelector("[data-contact-shell]")!.getBoundingClientRect();
  await expect(disclosure.getBoundingClientRect().top - shellBounds.bottom).toBeGreaterThan(24);
  const composerBounds = canvasElement.querySelector("[data-contact-composer]")!.getBoundingClientRect();
  const openingBounds = canvasElement.querySelector("[data-contact-conversation] .is-assistant")!.getBoundingClientRect();
  await expect(composerBounds.left - shellBounds.left).toBeLessThanOrEqual(60);
  await expect(shellBounds.right - composerBounds.right).toBeLessThanOrEqual(60);
  await expect(Math.abs(openingBounds.left - composerBounds.left)).toBeLessThan(1);
  await expect(Math.abs(openingBounds.right - composerBounds.right)).toBeLessThan(1);
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
    canvas.getByText(/Paste an existing role or project brief/),
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
    canvas.getByText(/Paste an existing role or project brief/),
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
    await userEvent.click(canvas.getByRole("button", { name: "Use form" }));
    const form = within(canvas.getByRole("form", { name: "Complete enquiry manually" }));
    await userEvent.type(form.getByRole("textbox", { name: "Subject" }), "Detailed enquiry");
    await userEvent.type(form.getByRole("textbox", { name: /Your message/ }), "A detailed enquiry that must survive without AI. ".repeat(12));
    await userEvent.type(form.getByRole("textbox", { name: "Your name" }), "Alex Visitor");
    await userEvent.type(form.getByRole("textbox", { name: "Reply email" }), "alex@example.com");
    const useAI = canvas.getByRole("button", { name: "Use AI" });
    await expect(useAI.closest("header")).not.toBeNull();
    await expect(canvas.queryByRole("link", { name: /Contact Dave on LinkedIn/ })).not.toBeInTheDocument();
    await userEvent.click(useAI);
    await waitFor(() => expect(canvas.getByRole("textbox", { name: "Describe your enquiry" })).toHaveFocus());
    await userEvent.click(canvas.getByRole("button", { name: "Use form" }));
    const restoredForm = within(canvas.getByRole("form", { name: "Complete enquiry manually" }));
    await expect(restoredForm.getByRole("textbox", { name: "Subject" })).toHaveValue("Detailed enquiry");
    await expect(restoredForm.getByRole("textbox", { name: "Reply email" })).toHaveValue("alex@example.com");
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
    await userEvent.click(restoredForm.getByRole("button", { name: "Review enquiry" }));
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

// Exercise the real draft/review UI with deterministic model proposals. This
// verifies the handoff, not model accuracy; live extraction is checked separately.
export const PastedBrief: Story = {
  beforeEach: () => {
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      if (String(input) === "/api/contact/prepare") {
        const { draft, message } = JSON.parse(String(init?.body));
        const changes = !draft.need ? {
          company: "North Star Studio",
          need: "Modernise a customer portal with React, Next.js and TypeScript.",
          timing: "1 October 2026, three months",
          workingArrangement: "Fully remote UK",
          summary: "North Star Studio needs a React and Next.js engineer for three months from October, remote UK, £600/day outside IR35.",
        } : { replyName: "Alex Visitor", replyEmail: "alex@example.com" };
        expect(message).toBeTruthy();
        if (draft.need) expect(draft.company).toBe("North Star Studio");
        return Response.json({ proposal: { baseVersion: draft.version, changes } });
      }
      // Any accidental delivery is a failure. No story sends an enquiry.
      throw new Error(`Unexpected contact request: ${String(input)}`);
    };
    return () => { window.fetch = originalFetch; };
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("button", { name: "Paste an existing brief" })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("radio", { name: "Contract enquiry" }));
    const composer = canvas.getByRole("textbox", { name: "Describe your enquiry" });
    await userEvent.click(composer);
    await expect(composer).toHaveFocus();
    await userEvent.type(composer, "North Star Studio needs a React/Next.js/TypeScript engineer to modernise a customer portal. Three months from 1 October 2026, fully remote UK, £600/day outside IR35.");
    await userEvent.click(canvas.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(canvas.getByText(/Here is what I’ve captured:/)).toHaveTextContent("£600/day outside IR35"));
    await expect(canvas.getByText(/Here is what I’ve captured:/)).toHaveTextContent("What name should Dave use when he replies?");
    await expect(canvas.queryByText("Which company or agency is this for?")).not.toBeInTheDocument();
    await expect(canvas.queryByRole("button", { name: "Approve and send" })).not.toBeInTheDocument();

    await userEvent.type(composer, "I am Alex Visitor. Reply to alex@example.com.");
    await userEvent.click(canvas.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(canvas.getByText(/That is everything I need/)).toBeVisible());
    await userEvent.click(canvas.getByRole("button", { name: /^(Review|Review and send)$/ }));
    await expect(canvas.getByRole("button", { name: "Approve and send" })).toBeEnabled();
    const timing = canvas.getByText("Timing", { exact: true }).closest("li")!;
    await userEvent.click(within(timing).getByRole("button", { name: "Change" }));
    await expect(canvas.getByRole("button", { name: "Approve and send" })).toBeDisabled();
    const editor = canvas.getByRole("textbox", { name: "Timing" });
    await userEvent.clear(editor);
    await userEvent.type(editor, "1 November 2026, three months");
    await userEvent.click(canvas.getByRole("button", { name: "Save change" }));
    await expect(canvas.getByText("1 November 2026, three months")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Approve and send" })).toBeDisabled();
    const overview = canvas.getByRole("textbox", { name: "Summary" });
    await userEvent.clear(overview);
    await userEvent.type(overview, "North Star Studio needs a React and Next.js engineer for three months from November, remote UK, £600/day outside IR35.");
    await userEvent.click(canvas.getByRole("button", { name: "Save change" }));
    await expect(canvas.getByRole("button", { name: "Approve and send" })).toBeEnabled();
  },
};

export const PastedBriefDark: Story = { ...PastedBrief, globals: { theme: "dark" } };
export const PastedBriefMobile: Story = { ...PastedBrief, globals: { viewport: { value: "mobile", isRotated: false } } };
export const PastedBriefMobileDark: Story = { ...PastedBrief, globals: { theme: "dark", viewport: { value: "mobile", isRotated: false } } };

export const ContractDropzone: Story = {
  beforeEach: () => {
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      if (String(input) !== "/api/contact/attachment") throw new Error(`Unexpected request: ${String(input)}`);
      if (init?.method === "DELETE") return Response.json({ ok: true });
      const file = (init?.body as FormData).get("file") as File;
      expect(file.name).toBe("role.pdf");
      return Response.json({ attachment: { pathname: "contact/unsubmitted/role.pdf", filename: file.name, contentType: file.type, size: file.size } });
    };
    return () => { window.fetch = originalFetch; };
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const paste = () => canvas.queryByRole("button", { name: "Paste an existing brief" });
    await expect(paste()).not.toBeInTheDocument();
    await expect(canvas.queryByRole("button", { name: "Upload a contract brief" })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("radio", { name: "Product enquiry" }));
    await expect(paste()).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Restart" }));
    await userEvent.click(canvas.getByRole("radio", { name: "Contract enquiry" }));
    const input = canvas.getByRole("textbox", { name: "Describe your enquiry" });
    const form = input.closest("form")!;
    await userEvent.type(input, "Keep this brief text while attaching.");
    const upload = canvas.getByRole("button", { name: "Upload a contract brief" });
    upload.focus();
    await expect(upload).toHaveFocus();
    const transfer = new DataTransfer();
    transfer.items.add(new File(["%PDF-1.7\nA role brief"], "role.pdf", { type: "application/pdf" }));
    form.dispatchEvent(new DragEvent("dragenter", { bubbles: true, dataTransfer: transfer }));
    await waitFor(() => expect(canvas.getByText("Drop your brief here")).toBeVisible());
    form.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer: transfer }));
    await waitFor(() => expect(canvas.getByText("role.pdf", { exact: true })).toBeVisible());
    await expect(input).toHaveValue("Keep this brief text while attaching.");
    await userEvent.click(canvas.getByRole("button", { name: "Remove" }));
    const invalid = new DataTransfer();
    invalid.items.add(new File(["not a pdf"], "bad.pdf", { type: "application/pdf" }));
    form.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer: invalid }));
    await waitFor(() => expect(canvas.getByText(/not a recognisable PDF/)).toBeVisible());
    await expect(input).toHaveValue("Keep this brief text while attaching.");
    // File-picker uploads use the same validation and private storage path.
    await userEvent.upload(canvas.getByLabelText("Contract brief document"), transfer.files[0]!);
    await waitFor(() => expect(canvas.getByText("role.pdf", { exact: true })).toBeVisible());
    await checkSendAlignment(canvasElement);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};
export const ContractDropzoneDark: Story = { ...ContractDropzone, globals: { theme: "dark" } };
export const ContractDropzoneMobile: Story = { ...ContractDropzone, globals: { viewport: { value: "iphoneSe", isRotated: false } } };
export const ContractDropzoneMobileDark: Story = { ...ContractDropzone, globals: { theme: "dark", viewport: { value: "iphoneSe", isRotated: false } } };

export const ManualFieldLayout: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Use form" }));
    const form = within(canvas.getByRole("form", { name: "Complete enquiry manually" }));
    const route = form.getByRole("combobox", { name: "Enquiry type" });
    await userEvent.click(route);
    await userEvent.keyboard("{Home}{ArrowDown}{Enter}");
    await expect(route).toHaveTextContent("Product enquiry");
    const product = await form.findByRole("combobox", { name: "Product" });
    await userEvent.click(product);
    const page = within(canvasElement.ownerDocument.body);
    for (const name of ["Contexture", "StoryLoops", "Voiced", "Plantry"]) await waitFor(() => expect(page.getByRole("option", { name })).toBeVisible());
    await userEvent.keyboard("{Home}{Enter}");
    await expect(product).toHaveTextContent("Contexture");
    await waitFor(() => expect(product).toHaveFocus());
    const name = form.getByRole("textbox", { name: "Your name" });
    const email = form.getByRole("textbox", { name: "Reply email" });
    const nameBox = name.getBoundingClientRect();
    const emailBox = email.getBoundingClientRect();
    if (window.innerWidth >= 640) {
      await expect(Math.abs(nameBox.top - emailBox.top)).toBeLessThan(2);
      await expect(emailBox.left).toBeGreaterThan(nameBox.right);
    } else await expect(emailBox.top).toBeGreaterThan(nameBox.bottom);
    await userEvent.type(form.getByRole("textbox", { name: "Your question" }), "Does Contexture support this schema?");
    await userEvent.type(name, "Alex Visitor");
    await userEvent.type(email, "alex@example.com");
    await expect(form.getByRole("button", { name: "Review enquiry" })).toBeEnabled();
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};
export const ManualFieldLayoutDark: Story = { ...ManualFieldLayout, globals: { theme: "dark" } };
export const ManualFieldLayoutMobile: Story = { ...ManualFieldLayout, globals: { viewport: { value: "iphoneSe", isRotated: false } } };
export const ManualFieldLayoutMobileDark: Story = { ...ManualFieldLayout, globals: { theme: "dark", viewport: { value: "iphoneSe", isRotated: false } } };
