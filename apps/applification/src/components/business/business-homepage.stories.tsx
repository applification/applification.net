import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BusinessHomepage } from "./business-homepage";

function Homepage({ contactAvailable = true }: { contactAvailable?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader site="business" contactAvailable={contactAvailable} />
      <BusinessHomepage contactAvailable={contactAvailable} />
      <SiteFooter site="business" />
    </div>
  );
}
const meta = {
  title: "Homepage/MCP business",
  component: Homepage,
  parameters: { docs: { disable: true } },
} satisfies Meta<typeof Homepage>;
export default meta;
type Story = StoryObj<typeof meta>;
const checkBusiness: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Your systems and data,usable through AI assistants.",
  );
  for (const action of canvas.getAllByRole("link", {
    name: "Discuss a project",
  }))
    await expect(action).toHaveAttribute("href", "/contact?route=general");
  await expect(
    canvas.getByRole("heading", { name: "MCP Apps & generative UI" }),
  ).toBeVisible();
  await expect(canvas.getByText("Loami · In development")).toBeVisible();
  await expect(
    canvas.getByText("StoryLoops · Archived experiment"),
  ).toBeVisible();
  await expect(
    canvas.getByRole("link", { name: "Read the Logically case" }),
  ).toHaveAttribute("href", "/client-work/logically");
  await expect(
    canvas.getByRole("link", {
      name: /Dave’s engineering profile & CV.*opens in a new tab/,
    }),
  ).toHaveAttribute("href", "https://dave.applification.net");
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  );
};
export const DesktopLight: Story = { play: checkBusiness };
export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkBusiness,
};
export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkBusiness,
};
export const MobileDark: Story = {
  globals: { theme: "dark", viewport: { value: "mobile", isRotated: false } },
  play: checkBusiness,
};
export const Tablet: Story = {
  globals: { viewport: { value: "tablet", isRotated: false } },
  play: checkBusiness,
};
export const SmallMobile: Story = {
  globals: { viewport: { value: "iphoneSeSmall", isRotated: false } },
  play: checkBusiness,
};
export const KeyboardExample: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole("button", { name: "Staff information" });
    first.focus();
    await userEvent.tab();
    const operations = canvas.getByRole("button", {
      name: "Operational system",
    });
    await expect(operations).toHaveFocus();
    await expect(getComputedStyle(operations).outlineStyle).not.toBe("none");
    await userEvent.keyboard("{Enter}");
    await expect(operations).toHaveAttribute("aria-pressed", "true");
    await expect(
      canvas.getByText("Team sign-in · assigned accounts only"),
    ).toBeVisible();
    await userEvent.tab();
    await userEvent.keyboard(" ");
    await expect(
      canvas.getByText(
        "The user reviews and approves before the integration writes.",
      ),
    ).toBeVisible();
  },
};
export const ContactDisabled: Story = {
  args: { contactAvailable: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.queryByRole("link", { name: "Discuss a project" }),
    ).toBeNull();
    await expect(
      canvas.getAllByRole("link", {
        name: /Discuss a project on LinkedIn.*opens in a new tab/,
      }),
    ).toHaveLength(2);
  },
};
