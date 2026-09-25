import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MotionConfig } from "motion/react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { contractPositioning } from "@/lib/contract-positioning";
import { Hero } from "./hero";

const meta = {
  title: "Homepage/Hero",
  component: Hero,
  tags: ["autodocs"],
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

function getVisibleDiagram(canvasElement: HTMLElement) {
  const diagram = [
    ...canvasElement.querySelectorAll<HTMLElement>(
      "[data-motion-sequence='hero-approval']",
    ),
  ].find((element) => getComputedStyle(element).display !== "none");

  if (!diagram) throw new Error("No visible hero diagram");
  return diagram;
}

// One visible, labelled pause control serves all responsive diagram variants.
async function checkMotionToggle(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const toggles = canvas.getAllByRole("button", { name: /^(Pause|Play) animation$/ });
  await expect(toggles).toHaveLength(1);
  const toggle = toggles[0]!;
  const bounds = toggle.getBoundingClientRect();
  await expect(bounds.height).toBeGreaterThanOrEqual(44);
  await expect(bounds.width).toBeGreaterThanOrEqual(44);
  await expect(
    canvas.getByRole("group", { name: "How I use AI in delivery" }),
  ).toContainElement(toggle);
  return toggle;
}

const checkContractSummary: NonNullable<Story["play"]> = async ({
  canvasElement,
}) => {
  const canvas = within(canvasElement);
  const summary = canvasElement.querySelector<HTMLElement>(
    "[aria-label='Contract summary']",
  );

  await expect(summary).not.toBeNull();
  await expect(summary).toBeVisible();
  await expect(
    canvas.getByText(`Dave Hudson · ${contractPositioning.role}`),
  ).toBeVisible();

  for (const value of [
    contractPositioning.availability,
    contractPositioning.location,
  ]) {
    await expect(canvas.getByText(value)).toBeVisible();
  }

  // The stack lives in the headline, so the summary does not repeat it.
  await expect(
    within(summary!).queryByText(contractPositioning.stack),
  ).not.toBeInTheDocument();

  const diagrams = canvasElement.querySelectorAll(
    "[data-motion-sequence='hero-approval']",
  );
  const visibleDiagrams = [...diagrams].filter(
    (diagram) => getComputedStyle(diagram).display !== "none",
  );
  await expect(visibleDiagrams).toHaveLength(1);
  await checkMotionToggle(canvasElement);
  await expect(
    canvas.getByRole("link", { name: "See how I work with AI" }),
  ).toBeVisible();

  await expect(
    canvas.getByRole("link", { name: "Discuss a contract" }),
  ).toBeVisible();
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  );
};

export const DesktopLight: Story = { play: checkContractSummary };

export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkContractSummary,
};

export const LaptopLight: Story = {
  globals: { viewport: { value: "laptop", isRotated: false } },
  play: checkContractSummary,
};

export const LaptopDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "laptop", isRotated: false },
  },
  play: checkContractSummary,
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkContractSummary,
};

export const MobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: checkContractSummary,
};

export const WideMobileLight: Story = {
  globals: { viewport: { value: "wideMobile", isRotated: false } },
};

export const WideMobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "wideMobile", isRotated: false },
  },
};

export const ReviewMobileLight: Story = {
  globals: { viewport: { value: "reviewMobile", isRotated: false } },
};

export const ReviewMobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "reviewMobile", isRotated: false },
  },
};

export const NarrowTabletLight: Story = {
  globals: { viewport: { value: "narrowTablet", isRotated: false } },
};

export const NarrowTabletDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "narrowTablet", isRotated: false },
  },
};

export const TabletLight: Story = {
  globals: { viewport: { value: "tablet", isRotated: false } },
};

export const TabletDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "tablet", isRotated: false },
  },
};

// WCAG 2.2.2: the looping diagram can be paused from the keyboard. Pausing
// stops replays and the live pulse, leaving the diagram fully drawn.
const checkPauseAndPlay: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const toggle = await checkMotionToggle(canvasElement);
  const diagram = getVisibleDiagram(canvasElement);

  await expect(toggle).toHaveAccessibleName("Pause animation");
  // The sequence only plays while the diagram is in view.
  diagram.scrollIntoView({ block: "center" });
  await waitFor(
    () => expect(diagram).toHaveAttribute("data-motion-running", "true"),
    { timeout: 5_000 },
  );

  toggle.focus();
  await userEvent.keyboard("{Enter}");
  await expect(toggle).toHaveAccessibleName("Play animation");
  await expect(toggle).toHaveFocus();
  await expect(diagram).toHaveAttribute("data-motion-paused", "true");
  await waitFor(() => expect(diagram).not.toHaveAttribute("data-motion-running"));
  await expect(diagram.querySelector("[data-motion-node][data-motion-active]")).toBeNull();

  // Longer than one sequence step: nothing restarts while paused.
  await new Promise((resolve) => setTimeout(resolve, 2_600));
  await expect(diagram).not.toHaveAttribute("data-motion-running");
  for (const connector of diagram.querySelectorAll<HTMLElement>("[data-motion-connector]")) {
    await expect(connector.style.opacity).toBe("");
  }

  await userEvent.keyboard(" ");
  await expect(toggle).toHaveAccessibleName("Pause animation");
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
