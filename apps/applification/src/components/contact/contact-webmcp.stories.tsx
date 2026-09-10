import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import type { WebMcpTool } from "@/lib/webmcp";
import { ContactWorkspace } from "./contact-workspace";

const registry = new Map<string, WebMcpTool>();
let requests: string[] = [];
const meta = {
  title: "Contact/Agent drafting",
  component: ContactWorkspace,
  args: { initialRoute: null },
  beforeEach: () => {
    registry.clear();
    requests = [];
    const original = Object.getOwnPropertyDescriptor(document, "modelContext");
    Object.defineProperty(document, "modelContext", {
      configurable: true,
      value: {
        registerTool: (tool: WebMcpTool, options: { signal: AbortSignal }) => {
          registry.set(tool.name, tool);
          options.signal.addEventListener("abort", () => {
            if (registry.get(tool.name) === tool) registry.delete(tool.name);
          });
        },
      },
    });
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      if (String(input).startsWith("/api/contact/")) {
        requests.push(String(input));
        throw new Error("Drafting must not call contact endpoints");
      }
      return originalFetch(input, init);
    };
    return () => {
      if (original) Object.defineProperty(document, "modelContext", original);
      else Reflect.deleteProperty(document, "modelContext");
      window.fetch = originalFetch;
      registry.clear();
    };
  },
} satisfies Meta<typeof ContactWorkspace>;
export default meta;
type Story = StoryObj<typeof meta>;

const checkDraft: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await waitFor(() => expect(registry.has("fill_contact_draft")).toBe(true));
  const tool = registry.get("fill_contact_draft")!;
  await expect(tool.annotations.readOnlyHint).toBe(false);
  await expect([...registry.keys()]).toEqual(["fill_contact_draft"]);
  const fields = {
    topic: "Engineering enquiry",
    message: "A three-month React and TypeScript project.",
    replyName: "Alex Visitor",
  };
  const partial = await tool.execute({ route: "general", fields });
  await expect(partial).toMatchObject({
    status: "needs_details",
    missingFields: ["replyEmail"],
    sent: false,
  });
  const formElement = canvas.getByRole("form", {
    name: "Complete enquiry manually",
  });
  const form = within(formElement);
  await expect(form.getByRole("textbox", { name: "Subject" })).toHaveValue(
    fields.topic,
  );
  await expect(form.getByRole("textbox", { name: "Your message" })).toHaveValue(
    fields.message,
  );
  await expect(
    form.getByRole("button", { name: "Review enquiry" }),
  ).toBeDisabled();
  const complete = await tool.execute({
    route: "general",
    fields: { replyEmail: "alex@example.com" },
  });
  await expect(complete).toMatchObject({
    status: "ready_for_review",
    reviewRequired: true,
    sent: false,
  });
  const review = form.getByRole("button", { name: "Review enquiry" });
  await expect(review).toBeEnabled();
  await expect(review.getBoundingClientRect().bottom).toBeLessThanOrEqual(
    formElement.getBoundingClientRect().bottom - 12,
  );
  const retry = await tool.execute({
    route: "general",
    fields: { ...fields, replyEmail: "alex@example.com" },
  });
  await expect(retry).toMatchObject({ changedFields: [] });
  await expect(
    await tool.execute({ route: "general", fields: { topic: "Overwrite" } }),
  ).toMatchObject({ error: { code: "CONFLICT" } });
  await expect(form.getByRole("textbox", { name: "Subject" })).toHaveValue(
    fields.topic,
  );
  // Human editing and the existing review remain available after the tool runs.
  await userEvent.clear(form.getByRole("textbox", { name: "Subject" }));
  await userEvent.type(
    form.getByRole("textbox", { name: "Subject" }),
    "Visitor edited subject",
  );
  form
    .getByRole("textbox", { name: "Overview / additional details (optional)" })
    .focus();
  await userEvent.tab();
  await expect(review).toHaveFocus();
  await expect(review.matches(":focus-visible")).toBe(true);
  await expect(getComputedStyle(review).boxShadow).not.toBe("none");
  await userEvent.keyboard("{Enter}");
  await expect(
    canvas.getAllByText("Visitor edited subject", { exact: true })[0],
  ).toBeVisible();
  await expect(canvas.getByText("alex@example.com")).toBeVisible();
  await expect(requests).toEqual([]);
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  );
};
export const DesktopLight: Story = { play: checkDraft };
export const DesktopDark: Story = {
  ...DesktopLight,
  globals: { theme: "dark" },
};
export const MobileLight: Story = {
  ...DesktopLight,
  globals: { viewport: { value: "mobile", isRotated: false } },
};
export const MobileDark: Story = {
  ...DesktopLight,
  globals: { theme: "dark", viewport: { value: "mobile", isRotated: false } },
};
export const SmallMobile: Story = {
  ...DesktopLight,
  globals: { viewport: { value: "iphoneSeSmall", isRotated: false } },
};
export const Tablet: Story = {
  ...DesktopLight,
  globals: { viewport: { value: "tablet", isRotated: false } },
};
export const PendingVisitorMessage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(registry.has("fill_contact_draft")).toBe(true));
    const oldTool = registry.get("fill_contact_draft")!;
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Describe your enquiry" }),
      "Keep this unsaved message",
    );
    await expect(
      await oldTool.execute({ route: "general", fields: {} }),
    ).toMatchObject({ error: { code: "BUSY" } });
    await expect(
      await registry
        .get("fill_contact_draft")!
        .execute({ route: "general", fields: {} }),
    ).toMatchObject({ error: { code: "PENDING_MESSAGE" } });
    await expect(
      canvas.getByRole("textbox", { name: "Describe your enquiry" }),
    ).toHaveValue("Keep this unsaved message");
    const pendingTool = registry.get("fill_contact_draft");
    await userEvent.click(canvas.getByRole("button", { name: "Use form" }));
    await expect(
      canvas.getByRole("textbox", { name: "Your message" }),
    ).toHaveValue("Keep this unsaved message");
    await waitFor(() =>
      expect(registry.get("fill_contact_draft")).not.toBe(pendingTool),
    );
    await expect(
      await registry.get("fill_contact_draft")!.execute({
        route: "general",
        fields: {
          topic: "Visitor's enquiry",
          replyName: "Alex",
          replyEmail: "alex@example.com",
        },
      }),
    ).toMatchObject({ status: "ready_for_review", sent: false });
    await expect(
      canvas.getByRole("textbox", { name: "Your message" }),
    ).toHaveValue("Keep this unsaved message");
    await expect(requests).toEqual([]);
  },
};
