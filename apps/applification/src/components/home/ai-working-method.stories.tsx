import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MotionConfig } from "motion/react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { AiWorkingMethod } from "./ai-working-method";

const meta = {
  title: "Homepage/AI working method",
  component: AiWorkingMethod,
  tags: ["autodocs"],
} satisfies Meta<typeof AiWorkingMethod>;

export default meta;
type Story = StoryObj<typeof meta>;

function getVisibleDiagram(canvasElement: HTMLElement) {
  const diagram = [
    ...canvasElement.querySelectorAll<HTMLElement>(
      "[data-motion-sequence='delivery-workflow']",
    ),
  ].find((element) => getComputedStyle(element).display !== "none");

  if (!diagram) throw new Error("No visible workflow diagram");
  return diagram;
}

// One visible, labelled pause control sits in the visible diagram's header.
const checkMotionToggle: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const toggles = canvas.getAllByRole("button", { name: /^(Pause|Play) animation$/ });
  await expect(toggles).toHaveLength(1);
  const bounds = toggles[0]!.getBoundingClientRect();
  await expect(bounds.height).toBeGreaterThanOrEqual(44);
  await expect(bounds.width).toBeGreaterThanOrEqual(44);
  await expect(getVisibleDiagram(canvasElement)).toContainElement(toggles[0]!);
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
};

export const DesktopLight: Story = { play: checkMotionToggle };

export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkMotionToggle,
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkMotionToggle,
};

export const MobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: checkMotionToggle,
};

export const CompactTabletLight: Story = {
  globals: { viewport: { value: "compactTablet", isRotated: false } },
  play: checkMotionToggle,
};

export const CompactTabletDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "compactTablet", isRotated: false },
  },
  play: checkMotionToggle,
};

export const LaptopLight: Story = {
  globals: { viewport: { value: "laptop", isRotated: false } },
  play: checkMotionToggle,
};

export const LaptopDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "laptop", isRotated: false },
  },
  play: checkMotionToggle,
};

// WCAG 2.2.2: the looping diagram can be paused from the keyboard. Pausing
// stops replays and the live pulse, leaving the diagram fully drawn.
const checkPauseAndPlay: NonNullable<Story["play"]> = async (context) => {
  await checkMotionToggle(context);
  const { canvasElement } = context;
  const canvas = within(canvasElement);
  const diagram = getVisibleDiagram(canvasElement);
  const toggle = within(diagram).getByRole("button", { name: "Pause animation" });
  const live = diagram.querySelector<HTMLElement>("[data-motion-live]")!;
  // The sequence only plays while the diagram is in view.
  diagram.scrollIntoView({ block: "center" });

  await waitFor(
    () => expect(diagram).toHaveAttribute("data-motion-running", "true"),
    { timeout: 5_000 },
  );

  toggle.focus();
  await userEvent.keyboard("{Enter}");
  await expect(toggle).toHaveAccessibleName("Play animation");
  await expect(toggle).toHaveAttribute("title", "Play animation");
  await expect(toggle).toHaveFocus();
  await expect(diagram).toHaveAttribute("data-motion-paused", "true");
  await waitFor(() => expect(diagram).not.toHaveAttribute("data-motion-running"));
  await expect(diagram.querySelector("[data-motion-node][data-motion-active]")).toBeNull();

  // Longer than one sequence step: nothing restarts and the live dot stays lit.
  await new Promise((resolve) => setTimeout(resolve, 2_600));
  await expect(diagram).not.toHaveAttribute("data-motion-running");
  await expect(live.style.opacity).toBe("");
  await expect(getComputedStyle(live).opacity).toBe("1");

  await userEvent.keyboard(" ");
  await expect(canvas.getByRole("button", { name: "Pause animation" })).toBe(toggle);
  await expect(diagram).not.toHaveAttribute("data-motion-paused");
  await waitFor(() => expect(diagram).toHaveAttribute("data-motion-running", "true"));
};

export const PauseAnimation: Story = { play: checkPauseAndPlay };

export const PauseAnimationMobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: checkPauseAndPlay,
};

// Reduced motion already shows a static diagram, so no control is offered.
export const ReducedMotion: Story = {
  decorators: [
    (Story) => (
      <MotionConfig reducedMotion="always">
        <Story />
      </MotionConfig>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(
        canvas.queryByRole("button", { name: /^(Pause|Play) animation$/ }),
      ).not.toBeInTheDocument(),
    );
    const diagram = getVisibleDiagram(canvasElement);
    await new Promise((resolve) => setTimeout(resolve, 600));
    await expect(diagram).not.toHaveAttribute("data-motion-running");
    await expect(diagram).not.toHaveAttribute("data-motion-paused");
  },
};
