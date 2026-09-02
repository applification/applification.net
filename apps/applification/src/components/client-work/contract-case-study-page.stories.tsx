import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import {
  EruptivCaseStudyPage,
  PeppyHealthCaseStudyPage,
} from "./contract-case-study-page";

const meta = {
  title: "Client work/Contract complete cases",
  component: EruptivCaseStudyPage,
  tags: ["autodocs"],
  parameters: {
    nextjs: { appDirectory: true },
  },
} satisfies Meta<typeof EruptivCaseStudyPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const checkCase =
  (websiteName: RegExp, nextHref: string): NonNullable<Story["play"]> =>
  async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement.querySelector('a[href^="mailto:"]')).not.toBeInTheDocument();

    await expect(canvasElement.querySelectorAll("h1")).toHaveLength(1);
    await expect(canvas.getByText("SITUATION / RESPONSIBILITY")).toBeVisible();
    await expect(canvas.getByText("KEY DECISIONS")).toBeVisible();
    await expect(canvas.getByText("PRODUCTION RESULT")).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Return to Client work" })).toHaveAttribute(
      "href",
      "/client-work",
    );
    await expect(canvas.getByRole("link", { name: websiteName })).toHaveAttribute(
      "target",
      "_blank",
    );
    await expect(
      canvas.getByRole("navigation", { name: "Case study next steps" }).querySelector(
        `a[href="${nextHref}"]`,
      ),
    ).not.toBeNull();
    if (nextHref === "/client-work/peppy-health") {
      await expect(canvas.getByRole("img", { name: /Client Server’s recruitment interface/ })).toBeVisible();
      const source = canvas.getByRole("link", { name: /View Client Server.*opens in a new tab/ });
      await expect(source).toHaveAttribute("target", "_blank");
      await expect(source).toHaveAttribute("rel", "noopener noreferrer");
      await expect(source.querySelector("svg")).toBeVisible();
    }
    await expect(canvas.getByRole("link", { name: "Discuss a similar project" })).toHaveAttribute("href", "/contact?route=contract");
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  };

export const EruptivLight: Story = {
  play: checkCase(/Visit Client Server/, "/client-work/peppy-health"),
};

export const EruptivDark: Story = {
  globals: { theme: "dark" },
  play: checkCase(/Visit Client Server/, "/client-work/peppy-health"),
};

export const EruptivMobile: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkCase(/Visit Client Server/, "/client-work/peppy-health"),
};

export const PeppyHealthLight: Story = {
  render: () => <PeppyHealthCaseStudyPage />,
  play: checkCase(/Visit Peppy Health/, "/client-work/logically"),
};

export const PeppyHealthDark: Story = {
  render: () => <PeppyHealthCaseStudyPage />,
  globals: { theme: "dark" },
  play: checkCase(/Visit Peppy Health/, "/client-work/logically"),
};

export const PeppyHealthMobile: Story = {
  render: () => <PeppyHealthCaseStudyPage />,
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkCase(/Visit Peppy Health/, "/client-work/logically"),
};
