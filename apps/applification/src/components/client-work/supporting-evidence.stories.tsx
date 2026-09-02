import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ContractFit, SupportingEvidence } from "./client-work-page";

function SupportingEvidenceAndFit() {
  return (
    <>
      <SupportingEvidence />
      <ContractFit />
    </>
  );
}

const meta = {
  title: "Client work/Supporting evidence and fit",
  component: SupportingEvidenceAndFit,
  tags: ["autodocs"],
} satisfies Meta<typeof SupportingEvidenceAndFit>;

export default meta;
type Story = StoryObj<typeof meta>;

const checkEvidence: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await expect(
    canvas.getByRole("heading", { level: 2, name: "More production context" }),
  ).toBeVisible();
  await expect(canvas.getByText("PANDO / 65,000+ USERS")).toBeVisible();
  await expect(canvas.getByRole("img", { name: /Pando Control overview design/ })).toBeVisible();
  await expect(canvas.getByText(/NHS and MoD/)).toBeVisible();
  await expect(canvas.getByText(/Cabinet Office boundaries/)).toBeVisible();
  await expect(canvas.getByText(/1.7m-user tax service/)).toBeVisible();
  await expect(canvas.getByText(/£4.5m/)).toBeVisible();
  await expect(
    canvas.getByRole("heading", {
      level: 2,
      name: "Small teams with a real product problem.",
    }),
  ).toBeVisible();
  await expect(canvas.getByText("React, Next.js + TypeScript")).toBeVisible();
};

export const DesktopLight: Story = { play: checkEvidence };

export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkEvidence,
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkEvidence,
};

export const MobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: checkEvidence,
};
