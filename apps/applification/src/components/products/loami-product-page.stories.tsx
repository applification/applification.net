import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { usePathname } from "@storybook/nextjs-vite/navigation.mock";
import { expect, userEvent, waitFor, within } from "storybook/test";
import LoamiPage from "@/app/products/loami/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

function LoamiProductPageStory() {
  usePathname.mockReturnValue("/products/loami");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <LoamiPage />
      <SiteFooter />
    </div>
  );
}

const meta = {
  title: "Products/Loami/Full page",
  component: LoamiProductPageStory,
  parameters: {
    docs: { disable: true },
  },
} satisfies Meta<typeof LoamiProductPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

const verifyNoHorizontalOverflow: Story["play"] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await waitFor(() => expect(canvasElement.querySelector("[data-animation-ready]")).toHaveAttribute("data-animation-ready", "true"), { timeout: 15000 });
  await userEvent.click(canvas.getByRole("button", { name: "Pause Loami animation" }));
  await userEvent.click(canvas.getByRole("button", { name: "Thinking" }));
  await expect(canvas.getByRole("button", { name: "Thinking" })).toHaveAttribute("aria-pressed", "true");
  await expect(canvas.getByRole("img", { name: "Loami thinking" })).toBeVisible();
  await expect(canvas.getByRole("button", { name: "Play Loami animation" })).toBeVisible();
  const documentElement = canvasElement.ownerDocument.documentElement;

  await expect(documentElement.scrollWidth).toBeLessThanOrEqual(
    documentElement.clientWidth,
  );
};

export const DesktopLight: Story = { play: verifyNoHorizontalOverflow };

export const DesktopDark: Story = {
  play: verifyNoHorizontalOverflow,
  globals: { theme: "dark" },
};

export const MobileLight: Story = {
  play: verifyNoHorizontalOverflow,
  globals: { viewport: { value: "mobile", isRotated: false } },
};

export const MobileDark: Story = {
  play: verifyNoHorizontalOverflow,
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
};

export const TabletLight: Story = {
  globals: { viewport: { value: "tablet", isRotated: false } },
  play: verifyNoHorizontalOverflow,
};

export const LaptopLight: Story = {
  globals: { viewport: { value: "laptop", isRotated: false } },
  play: verifyNoHorizontalOverflow,
};
