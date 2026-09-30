import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { AgentApplicationStack } from "./agent-application-stack";

const meta = {
  title: "Writing/Agent application stack",
  component: AgentApplicationStack,
  decorators: [(Story) => <div className="mx-auto max-w-[680px] px-4"><Story /></div>],
  tags: ["autodocs"],
} satisfies Meta<typeof AgentApplicationStack>;
export default meta;
type Story = StoryObj<typeof meta>;
const checkDiagram: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByRole("region", { name: "Traditional stack" })).toBeVisible();
  await expect(canvas.getByRole("region", { name: "Agent application" })).toBeVisible();
  await expect(canvas.getByText("THE AGENT HOST PROVIDES")).toBeVisible();
  await expect(canvas.getByText("Your MCP App")).toBeVisible();
  await expect(canvas.getAllByText("Product database")).toHaveLength(2);
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
};
export const DesktopLight: Story = { play: checkDiagram };
export const DesktopDark: Story = { globals: { theme: "dark" }, play: checkDiagram };
export const MobileLight: Story = { globals: { viewport: { value: "mobile", isRotated: false } }, play: checkDiagram };
export const MobileDark: Story = { globals: { theme: "dark", viewport: { value: "mobile", isRotated: false } }, play: checkDiagram };
export const Intermediate: Story = { globals: { viewport: { value: "tablet", isRotated: false } }, play: checkDiagram };
