import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { ContactWorkspace } from "./contact-workspace";

const meta = {
  title: "Contact/Workspace",
  component: ContactWorkspace,
  args: {
    initialRoute: null,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ContactWorkspace>;

export default meta;
type Story = StoryObj<typeof meta>;

async function checkWorkspace(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);

  await expect(
    canvas.getByRole("heading", {
      name: "Start with a message. End with a checked brief.",
    }),
  ).toBeVisible();
  await expect(canvas.getByText("Enquiry assistant")).toBeVisible();
  await expect(
    canvas.getByText(/Your enquiry is only sent after you review/),
  ).toBeVisible();

  const contractRoute = canvas.getByRole("radio", {
    name: /Contract enquiry/,
  });
  await userEvent.click(contractRoute);
  await expect(contractRoute).toHaveAttribute("aria-checked", "true");
  await expect(
    canvas.getByText(/Tell me about the company, the work and when/),
  ).toBeVisible();

  const message = canvas.getByRole("textbox", { name: "Describe your enquiry" });
  await userEvent.type(message, "A three-month React contract from October.");
  await userEvent.click(canvas.getByRole("button", { name: "Submit" }));
  await expect(
    canvas.getByText("A three-month React contract from October.", { selector: "p" }),
  ).toBeVisible();
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  );
}

export const DesktopLight: Story = { play: ({ canvasElement }) => checkWorkspace(canvasElement) };

export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: ({ canvasElement }) => checkWorkspace(canvasElement),
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: ({ canvasElement }) => checkWorkspace(canvasElement),
};

export const ProductPreselected: Story = {
  args: { initialProduct: "contexture", initialRoute: "product" },
};
