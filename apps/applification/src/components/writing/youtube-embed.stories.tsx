import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { YouTubeEmbed } from "./youtube-embed";

const title = "Node.js and its many, many new features with Matteo Collina";

function YouTubeFixture() {
  return (
    <main className="mx-auto w-full max-w-[760px] px-6 py-14 min-[720px]:px-10">
      <YouTubeEmbed channel="CodeTV" videoId="evCnOaVaOTo" title={title} />
    </main>
  );
}

const meta = {
  title: "Writing/YouTube embed",
  component: YouTubeFixture,
  tags: ["autodocs"],
} satisfies Meta<typeof YouTubeFixture>;

export default meta;
type Story = StoryObj<typeof meta>;

const checkPrivatePlayer: NonNullable<Story["play"]> = async ({
  canvasElement,
}) => {
  const canvas = within(canvasElement);
  const playButton = canvas.getByRole("button", {
    name: `Play video: ${title}`,
  });
  const fallback = canvas.getByRole("link", { name: /Watch on YouTube/ });

  await expect(playButton).toBeVisible();
  await expect(canvas.queryByTitle(title)).not.toBeInTheDocument();
  await expect(fallback).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=evCnOaVaOTo",
  );
  await expect(fallback).toHaveAttribute("target", "_blank");
  playButton.focus();
  await expect(playButton).toHaveFocus();
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  );
};

export const DesktopLight: Story = { play: checkPrivatePlayer };

export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkPrivatePlayer,
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkPrivatePlayer,
};

export const MobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: checkPrivatePlayer,
};

export const LoadedPlayer: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const playButton = canvas.getByRole("button", {
      name: `Play video: ${title}`,
    });

    await userEvent.click(playButton);

    const player = await canvas.findByTitle(title);
    await expect(player).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/evCnOaVaOTo?autoplay=1&rel=0",
    );
    await expect(player).toHaveAttribute("loading", "lazy");
    await waitFor(() => expect(player).toHaveFocus());
  },
};
