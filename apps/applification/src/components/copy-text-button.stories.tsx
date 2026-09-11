import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { CopyTextButton } from "./copy-text-button";
import { agentsCopy } from "@/lib/content/site-pages";

const meta = {
  title: "Agents/Copy text",
  component: CopyTextButton,
  args: { text: agentsCopy.prompt, label: "Copy a starter prompt", fallback: "Select and copy the prompt above, then paste it into your chat." },
} satisfies Meta<typeof CopyTextButton>;
export default meta;
type Story = StoryObj<typeof meta>;

function checkCopy(fail: boolean): NonNullable<Story["play"]> {
  return async ({ canvasElement }) => {
    const descriptor = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    let copied = "";
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (text: string) => {
      if (fail) throw new Error("Clipboard unavailable");
      copied = text;
    } } });
    try {
      const canvas = within(canvasElement);
      await userEvent.click(canvas.getByRole("button", { name: "Copy a starter prompt" }));
      await expect(canvas.getByRole("status")).toHaveTextContent(fail ? meta.args.fallback : "Copied to clipboard.");
      await expect(copied).toBe(fail ? "" : agentsCopy.prompt);
    } finally {
      if (descriptor) Object.defineProperty(navigator, "clipboard", descriptor);
      else Reflect.deleteProperty(navigator, "clipboard");
    }
  };
}
export const CopyPrompt: Story = { play: checkCopy(false) };
export const ClipboardUnavailable: Story = { play: checkCopy(true) };
