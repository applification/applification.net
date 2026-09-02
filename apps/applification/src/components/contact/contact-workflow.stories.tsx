import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ContactWorkflow } from "./contact-workflow";

const meta = {
  title: "Contact/Complete enquiry workflow",
  component: ContactWorkflow,
  decorators: [(Story) => <div className="bg-[var(--app-bg)] p-5"><Story /></div>],
} satisfies Meta<typeof ContactWorkflow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ClosedPreview: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const summary = canvasElement.querySelector("summary")!;
    const details = canvasElement.querySelector("details")!;
    await expect(details).not.toHaveAttribute("open");
    await expect(canvas.getByText("See how this AI chat enquiry works", { exact: true })).toBeVisible();
    await expect(canvasElement.querySelector("figure")).not.toBeVisible();
    summary.focus();
    await expect(summary).toHaveFocus();
    await userEvent.click(summary);
    await waitFor(() => expect(details).toHaveAttribute("open"));
    await expect(canvas.getByText("AI chat enquiry workflow", { exact: true })).toBeVisible();
    await expect(canvas.getByText("Hide", { exact: true })).toBeVisible();
    await expect(canvasElement.querySelector(".workflow-preview")).not.toBeVisible();
    await expect(canvas.queryByText("Follow this chat from your message to human review and email delivery.")).not.toBeInTheDocument();
    const overview = canvasElement.querySelector("[data-workflow-overview]")!.getBoundingClientRect();
    const diagram = canvasElement.querySelector("figure")!.getBoundingClientRect();
    await expect(Math.abs(overview.right - diagram.right)).toBeLessThan(1);
    await expect(Math.abs(overview.left - diagram.left)).toBeLessThan(1);
    await userEvent.click(summary);
    await waitFor(() => expect(details).not.toHaveAttribute("open"));
    await expect(canvasElement.querySelector(".workflow-preview")).toBeVisible();
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      await expect(canvasElement.querySelector("[data-preview-active]")).toHaveAttribute("data-preview-active", "false");
    }
  },
};
export const ClosedPreviewDark: Story = { ...ClosedPreview, globals: { theme: "dark" } };
export const ClosedPreviewMobile: Story = { ...ClosedPreview, globals: { viewport: { value: "mobile", isRotated: false } } };
export const ClosedPreviewSmallDark: Story = { ...ClosedPreview, globals: { theme: "dark", viewport: { value: "iphoneSeSmall", isRotated: false } } };

const checkFlow: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByText("See how this AI chat enquiry works", { exact: true }));
  const figure = canvas.getByRole("figure", { name: "Complete enquiry workflow" });
  await expect(figure).toBeVisible();
  const narration = figure.querySelector("[data-workflow-narration]")!;
  await expect(figure.firstElementChild).toBe(narration);
  await expect(getComputedStyle(narration).position).toBe(window.matchMedia("(min-width: 1024px)").matches ? "sticky" : "static");
  const visibleDiagram = Array.from(figure.querySelectorAll("svg")).find(svg => svg.hasAttribute("viewBox") && getComputedStyle(svg).display !== "none" && svg.querySelector("[data-workflow-node]"))!;
  for (const id of ["input", "blob", "ai", "followup", "review", "send", "pause", "owner", "resume", "cv", "noCv"]) {
    await expect(visibleDiagram.querySelector(`[data-workflow-node='${id}']`)).toBeInTheDocument();
  }
  await expect(visibleDiagram.querySelector("[data-workflow-edge='input-blob']")).toBeInTheDocument();
  await expect(visibleDiagram.querySelector("[data-workflow-edge='blob-send']")).toBeInTheDocument();
  await document.fonts.ready;
  const approval = Array.from(visibleDiagram.querySelectorAll("text")).find(text => /^(APPROVE|DAVE APPROVES)$/.test(text.textContent ?? ""))!;
  const label = approval.getBoundingClientRect();
  for (const node of visibleDiagram.querySelectorAll("[data-workflow-node]")) {
    const box = node.querySelector("rect")!.getBoundingClientRect();
    const overlaps = label.left < box.right && label.right > box.left && label.top < box.bottom && label.bottom > box.top;
    await expect(overlaps, "Approval label must not overlap a node").toBe(false);
    for (const text of node.querySelectorAll("text")) {
      await expect(text.getBoundingClientRect().right, "Node text must fit inside its box").toBeLessThanOrEqual(box.right);
    }
  }
  await expect(canvas.getByRole("list", { name: "Workflow colour legend" })).toBeVisible();
  const workflowLink = canvas.getByRole("link", { name: /Vercel Workflows/ });
  await expect(workflowLink).toHaveAttribute("href", "https://vercel.com/workflows");
  await expect(workflowLink).toHaveAttribute("target", "_blank");
  await expect(canvas.getByText(/PDF and DOCX attachments are stored privately/)).toBeVisible();
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  const pause = canvas.queryByRole("button", { name: "Pause animation" });
  if (pause) await userEvent.click(pause);
  await expect(figure).toHaveAttribute("data-workflow-running", "false");
};

export const DesktopLight: Story = { play: checkFlow };
export const DesktopDark: Story = { globals: { theme: "dark" }, play: checkFlow };
export const MobileLight: Story = { globals: { viewport: { value: "mobile", isRotated: false } }, play: checkFlow };
export const MobileDark: Story = { globals: { theme: "dark", viewport: { value: "mobile", isRotated: false } }, play: checkFlow };
export const SmallMobile: Story = { globals: { viewport: { value: "iphoneSeSmall", isRotated: false } }, play: checkFlow };
export const Tablet: Story = { globals: { viewport: { value: "tablet", isRotated: false } }, play: checkFlow };
export const RouteSelection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("See how this AI chat enquiry works", { exact: true }));
    const selector = within(canvas.getByRole("group", { name: "Example enquiry" }));
    const figure = canvas.getByRole("figure", { name: "Complete enquiry workflow" });
    for (const route of ["Product", "General", "Contract"]) {
      const option = selector.getByRole("radio", { name: route });
      await userEvent.click(option);
      await expect(option).toBeChecked();
      await expect(figure).toHaveAttribute("data-example-route", route.toLowerCase());
      await expect(figure).toHaveAttribute("data-workflow-complete", "false");
      const diagrams = figure.querySelectorAll<SVGSVGElement>("[data-workflow-diagram]");
      for (const diagram of diagrams) {
        await expect(diagram).toHaveAttribute("data-workflow-diagram", route.toLowerCase());
        await expect(diagram.querySelectorAll("[data-workflow-node]").length).toBe(route === "Contract" ? 11 : route === "Product" ? 6 : 5);
        for (const id of ["blob", "pause", "owner", "resume", "cv", "noCv"]) {
          if (route === "Contract") await expect(diagram.querySelector(`[data-workflow-node='${id}']`)).toBeInTheDocument();
          else await expect(diagram.querySelector(`[data-workflow-node='${id}']`)).not.toBeInTheDocument();
        }
        if (route === "Product") {
          const productStep = diagram.querySelector("[data-workflow-node='product']");
          await expect(productStep).toHaveTextContent("Which product?");
          for (const name of ["Contexture", "StoryLoops", "Voiced", "Plantry"]) await expect(productStep).toHaveTextContent(name);
          await expect(diagram.querySelector("[data-workflow-edge='ai-product']")).toHaveTextContent("PRODUCT MISSING?");
        } else await expect(diagram.querySelector("[data-workflow-node='product']")).not.toBeInTheDocument();
        if (route !== "Contract") {
          await expect(diagram.querySelector("[data-workflow-edge='blob-send']")).not.toBeInTheDocument();
          await expect(diagram.querySelector("[data-workflow-node='send']")).toHaveTextContent(route === "Product" ? "Email Dave your question" : "Email Dave your message");
        }
        if (getComputedStyle(diagram).display !== "none") {
          await document.fonts.ready;
          for (const node of diagram.querySelectorAll("[data-workflow-node]")) {
            const box = node.querySelector("rect")!.getBoundingClientRect();
            for (const text of node.querySelectorAll("text")) {
              await expect(text.getBoundingClientRect().right, `${route} text fits its node`).toBeLessThanOrEqual(box.right);
            }
          }
        }
      }
      const legend = canvas.getByRole("list", { name: "Workflow colour legend" });
      if (route === "Contract") await expect(legend).toHaveTextContent("Workflow execution paused");
      else await expect(legend).not.toHaveTextContent("Workflow execution paused");
      await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        await expect(figure.querySelector("[data-workflow-node='input']")).toHaveAttribute("data-active", "true");
        await expect(figure).toHaveAttribute("data-workflow-running", "true");
        await userEvent.click(canvas.getByRole("button", { name: "Pause animation" }));
      } else {
        await expect(figure).toHaveAttribute("data-workflow-running", "false");
      }
    }
  },
};
export const FocusAndPlayback: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const summary = canvasElement.querySelector("summary")!;
    summary.focus();
    await expect(summary).toHaveFocus();
    await userEvent.click(summary);
    const figure = canvas.getByRole("figure", { name: "Complete enquiry workflow" });
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      await waitFor(() => expect(figure).toHaveAttribute("data-workflow-running", "true"));
      const pause = canvas.getByRole("button", { name: "Pause animation" });
      pause.focus();
      await expect(pause).toHaveFocus();
      await userEvent.click(pause);
      await expect(figure).toHaveAttribute("data-workflow-running", "false");
      await expect(figure.querySelector(".workflow-typing-character")).not.toBeInTheDocument();
      await userEvent.click(canvas.getByRole("button", { name: "Resume animation" }));
      await waitFor(() => expect(figure.querySelector("[data-workflow-node='ai']")).toHaveAttribute("data-active", "true"), { timeout: 4500 });
      const narration = figure.querySelector("[data-workflow-narration]")!;
      await expect(narration).toHaveTextContent("STEP 2 OF 11");
      await expect(narration).toHaveTextContent("AI prepares the brief");
      await expect(narration).toHaveTextContent("AI Gateway handles the model call.");
      const lastCharacter = narration.querySelector(".workflow-typing-character:last-child")!;
      await waitFor(() => expect(getComputedStyle(lastCharacter).opacity).toBe("1"));
    } else {
      await expect(canvas.queryByRole("button", { name: /animation/ })).not.toBeInTheDocument();
      await expect(figure).toHaveAttribute("data-workflow-running", "false");
      await expect(figure.querySelector(".workflow-typing-character")).not.toBeInTheDocument();
    }
    await userEvent.click(summary);
    await expect(figure).not.toBeVisible();
    await expect(figure).toHaveAttribute("data-workflow-running", "false");
  },
};

export const RouteSelectionMobile: Story = { ...RouteSelection, globals: { viewport: { value: "mobile", isRotated: false } } };
export const RouteSelectionSmallDark: Story = { ...RouteSelection, globals: { theme: "dark", viewport: { value: "iphoneSeSmall", isRotated: false } } };

export const PausedNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("See how this AI chat enquiry works", { exact: true }));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      await expect(canvas.queryByRole("button", { name: "Next step" })).not.toBeInTheDocument();
      return;
    }
    const figure = canvas.getByRole("figure", { name: "Complete enquiry workflow" });
    const narration = figure.querySelector("[data-workflow-narration]")!;
    for (const [route, count] of [["Contract", 11], ["Product", 6], ["General", 5]] as const) {
      await userEvent.click(canvas.getByRole("radio", { name: route }));
      await expect(canvas.queryByRole("button", { name: "Next step" })).not.toBeInTheDocument();
      await userEvent.click(canvas.getByRole("button", { name: "Pause animation" }));
      const previous = canvas.getByRole("button", { name: "Previous step" });
      const next = canvas.getByRole("button", { name: "Next step" });
      await expect(previous).toBeDisabled();
      await userEvent.click(next);
      await expect(narration).toHaveTextContent(`STEP 2 OF ${count}`);
      await expect(narration).toHaveTextContent("AI prepares the brief");
      await expect(figure.querySelector("[data-workflow-node='ai']")).toHaveAttribute("data-active", "true");
      await expect(figure.querySelector(".workflow-typing-character")).not.toBeInTheDocument();
      previous.focus();
      await userEvent.keyboard("{Enter}");
      await expect(narration).toHaveTextContent(`STEP 1 OF ${count}`);
      for (let index = 1; index < count; index++) await userEvent.click(next);
      await expect(next).toBeDisabled();
      await expect(narration).toHaveTextContent(`STEP ${count} OF ${count}`);
      await expect(figure).toHaveAttribute("data-workflow-running", "false");
      // Resuming the last selected step must finish, rather than restart.
      await userEvent.click(canvas.getByRole("button", { name: "Resume animation" }));
      await expect(canvas.queryByRole("button", { name: "Next step" })).not.toBeInTheDocument();
      await waitFor(() => expect(figure).toHaveAttribute("data-workflow-complete", "true"), { timeout: 4500 });
      await expect(canvas.getByRole("button", { name: "Next step" })).toBeDisabled();
      await userEvent.click(canvas.getByRole("button", { name: "Previous step" }));
      await expect(narration).toHaveTextContent(`STEP ${count - 1} OF ${count}`);
      await expect(figure).toHaveAttribute("data-workflow-running", "false");
      await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
    }
  },
};
export const PausedNavigationMobile: Story = { ...PausedNavigation, globals: { theme: "dark", viewport: { value: "mobile", isRotated: false } } };
