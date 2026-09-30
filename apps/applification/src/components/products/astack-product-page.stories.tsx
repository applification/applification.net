import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { usePathname } from "@storybook/nextjs-vite/navigation.mock";
import { expect, within, userEvent, waitFor } from "storybook/test";
import AstackPage from "@/app/products/astack/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

function AstackProductPageStory() {
  usePathname.mockReturnValue("/products/astack");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <AstackPage />
      <SiteFooter />
    </div>
  );
}

const meta = {
  title: "Products/Astack/Full page",
  component: AstackProductPageStory,
  parameters: {
    docs: { disable: true },
  },
} satisfies Meta<typeof AstackProductPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

const verifyNoHorizontalOverflow: Story["play"] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const website = canvas.getByRole("link", {
    name: "Explore astack , opens in a new tab",
  });
  await expect(website).toHaveAttribute(
    "href",
    "https://astack.applification.net/",
  );
  await expect(
    canvas.getByRole("link", { name: "Get started , opens in a new tab" }),
  ).toHaveAttribute("href", "https://astack.applification.net/#adopt");
  canvas.getByRole("link", { name: "Product index" }).focus();
  await userEvent.tab();
  const attribution = canvas.getByRole("link", {
    name: "Poteto’s pstack , opens in a new tab",
  });
  await expect(attribution).toHaveFocus();
  await expect(attribution).toHaveAttribute(
    "href",
    "https://github.com/cursor/plugins/tree/main/pstack",
  );
  await userEvent.tab();
  await expect(website).toHaveFocus();
  const map = canvas.getByRole("region", { name: "astack engineering routes" });
  for (const name of [
    "Feature",
    "Bug fix",
    "Refactor",
    "Performance",
    "Investigation",
    "Pull request",
    "App control",
    "Project setup",
  ]) {
    await expect(
      within(map).getByRole("heading", { level: 3, name }),
    ).toBeVisible();
  }
  await expect(within(map).getByText("Ends with an answer")).toBeVisible();
  await userEvent.tab();
  await userEvent.tab();
  const chooser = canvas.getByRole("combobox", {
    name: "Choose an eval example",
  });
  await expect(chooser).toHaveFocus();
  await userEvent.tab();
  await userEvent.tab();
  await expect(map).toHaveFocus();

  for (const [request, route] of [
    ["An edit disappears after saving and reopening", "Bug fix"],
    ["Why does the tenant check live in the backend?", "Investigation"],
  ]) {
    await userEvent.click(chooser);
    await userEvent.click(
      within(canvasElement.ownerDocument.body).getByRole("option", {
        name: request,
      }),
    );
    await waitFor(() =>
      expect(canvasElement.ownerDocument.body.style.pointerEvents).not.toBe(
        "none",
      ),
    );
    await expect(canvas.getByText(`Expected route: ${route}`)).toBeVisible();
    const selected = map.querySelectorAll("li[data-selected]");
    await expect(selected).toHaveLength(1);
    await expect(selected[0]).toHaveTextContent(route);
  }
  await userEvent.click(chooser);
  await userEvent.click(
    within(canvasElement.ownerDocument.body).getByRole("option", {
      name: "Show all routes",
    }),
  );
  await waitFor(() =>
    expect(canvasElement.ownerDocument.body.style.pointerEvents).not.toBe(
      "none",
    ),
  );
  await expect(map.querySelectorAll("li[data-selected]")).toHaveLength(0);
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
