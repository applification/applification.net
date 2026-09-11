import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { usePathname } from "@storybook/nextjs-vite/navigation.mock";
import { expect, within, userEvent, waitFor } from "storybook/test";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AgentsPage } from "./agents-page";
import { agentsCopy } from "@/lib/content/site-pages";

function Fixture() {
  usePathname.mockReturnValue("/agents");
  return (
    <>
      <SiteHeader />
      <AgentsPage />
      <SiteFooter />
    </>
  );
}

const meta = {
  title: "Agents/Complete page",
  component: Fixture,
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/agents" } },
  },
} satisfies Meta<typeof Fixture>;
export default meta;
type Story = StoryObj<typeof meta>;

const checkPage: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent("Explore my work with your AI.");
  await expect(canvas.getByRole("button", { name: "Copy prompt" })).toBeVisible();
  const destinations = [
    ["Open in ChatGPT", "https://chatgpt.com/"],
    ["Open in Claude", "https://claude.ai/new"],
    ["Open in Perplexity", "https://www.perplexity.ai/search/new"],
    ["Open in Grok", "https://grok.com/"],
    ["Copy prompt and open Gemini", "https://gemini.google.com/app"],
  ] as const;
  const buttons = destinations.map(([label]) => canvas.getByRole("button", { name: `${label}, opens in a new tab` }) as HTMLButtonElement);
  await expect(canvas.getByRole("textbox", { name: "Your prompt" })).toHaveValue(agentsCopy.prompt);
  for (const [index, [label, destination]] of destinations.entries()) {
    const button = buttons[index];
    await expect(button).toBeVisible();
    await expect(button.formAction).toBe(destination);
    await expect(button.form!.method).toBe("get");
    await expect(button.form!.target).toBe("_blank");
    await expect(button.form).toHaveAttribute("rel", "noopener noreferrer");
    await expect(new FormData(button.form!).get("q")).toBe(label.includes("Gemini") ? null : agentsCopy.prompt);
    await expect(button.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await expect(button.getBoundingClientRect().width).toBeGreaterThanOrEqual(144);
    await expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    await expect(button.textContent).toBe(label.split(" ").at(-1));
  }
  canvas.getByRole("textbox", { name: "Your prompt" }).focus();
  await userEvent.tab();
  for (const button of buttons) {
    await expect(button).toHaveFocus();
    await userEvent.tab();
  }
  await expect(canvas.getByRole("button", { name: "Copy prompt" })).toHaveFocus();
  await expect(canvas.getByText(/Enable web access/)).toBeVisible();
  await expect(
    canvas.getByRole("link", { name: "OpenAPI reference" }),
  ).toHaveAttribute("href", "/api/openapi.json");
  await expect(
    canvas.getByRole("link", { name: "Sandbox first call" }),
  ).toHaveAttribute("href", "/api/v1/sandbox");
  await expect(
    canvas.getByRole("link", { name: "Make the first call" }),
  ).toHaveAttribute("href", "/api/v1/sandbox");
  await expect(canvas.getAllByText(/free tier/i).length).toBeGreaterThan(0);
  const select = canvas.getByRole("combobox", {
    name: "Where would you like to look?",
  });
  await expect(select.getBoundingClientRect().height).toBe(44);
  await userEvent.click(select);
  const page = within(canvasElement.ownerDocument.body);
  for (const name of ["Client work", "Writing", "Products"]) {
    await waitFor(() =>
      expect(page.getByRole("option", { name })).toBeVisible(),
    );
  }
  await userEvent.keyboard("{End}{Enter}");
  await expect(select).toHaveTextContent("Products");
  await waitFor(() => expect(select).toHaveFocus());
  const form = select.closest("form")!;
  await expect(form).toHaveAttribute("action", "/api/v1/search");
  await expect(form).toHaveAttribute("method", "get");
  await expect(new FormData(form).get("type")).toBe("products");
  await expect(new FormData(form).getAll("type")).toHaveLength(1);
  await userEvent.tab();
  await expect(
    canvas.getByRole("textbox", { name: "Search words (optional)" }),
  ).toHaveFocus();
  await expect(
    canvas.getByRole("button", { name: "Find content" }),
  ).toBeEnabled();
  await expect(canvasElement.textContent).not.toMatch(
    /pricing|quoted per engagement|standard day rate/i,
  );
  const disclosure = canvasElement.querySelector("details")!;
  await expect(disclosure.open).toBe(false);
  await userEvent.click(canvas.getByText("API and WebMCP reference"));
  await expect(disclosure.open).toBe(true);
  await expect(canvas.getByText(/On 429, wait at least Retry-After/)).toBeVisible();
  await expect(
    canvas.getByRole("link", { name: "Read the full API specification" }),
  ).toBeVisible();
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  );
  await userEvent.click(canvas.getByText("API and WebMCP reference"));
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  );
};

export const DesktopLight: Story = { play: checkPage };
export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkPage,
};
export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkPage,
};
export const MobileDark: Story = {
  globals: { theme: "dark", viewport: { value: "mobile", isRotated: false } },
  play: checkPage,
};
export const TabletLight: Story = {
  globals: { viewport: { value: "tablet", isRotated: false } },
  play: checkPage,
};

export const SmallMobileLight: Story = {
  globals: { viewport: { value: "iphoneSeSmall", isRotated: false } },
  play: checkPage,
};

function checkGeminiCopy(fail: boolean): NonNullable<Story["play"]> {
  return async ({ canvasElement }) => {
    const descriptor = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    let copied = "";
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (text: string) => {
      if (fail) throw new Error("Clipboard unavailable");
      copied = text;
    } } });
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Copy prompt and open Gemini, opens in a new tab" }) as HTMLButtonElement;
    const keepStoryOpen = (event: Event) => event.preventDefault();
    button.form!.addEventListener("submit", keepStoryOpen);
    try {
      await userEvent.click(button);
      await expect(canvas.getByText(fail ? "Select and copy your prompt, then paste it into Gemini." : "Prompt copied. Paste it into Gemini to start your conversation.")).toBeVisible();
      await expect(copied).toBe(fail ? "" : agentsCopy.prompt);
      await expect(button.formAction).toBe("https://gemini.google.com/app");
      await expect(button.form!.target).toBe("_blank");
    } finally {
      button.form!.removeEventListener("submit", keepStoryOpen);
      if (descriptor) Object.defineProperty(navigator, "clipboard", descriptor);
      else Reflect.deleteProperty(navigator, "clipboard");
    }
  };
}

export const GeminiCopyPrompt: Story = { play: checkGeminiCopy(false) };
export const GeminiClipboardUnavailable: Story = { play: checkGeminiCopy(true) };

export const EditAndResetPrompt: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("textbox", { name: "Your prompt" }) as HTMLTextAreaElement;
    const edited = "Read https://www.applification.net and compare R&D + C# projects.\nWhat’s relevant to my team?";
    const buttons = within(canvas.getByRole("group", { name: "Open this prompt with an assistant" })).getAllByRole("button") as HTMLButtonElement[];
    const descriptor = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    let copied = "";
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (text: string) => { copied = text; } } });
    const submissions: FormData[] = [];
    const preventNavigation = (event: Event) => {
      event.preventDefault();
      submissions.push(new FormData(event.target as HTMLFormElement));
    };
    const forms = new Set(buttons.map(button => button.form!));
    forms.forEach(form => form.addEventListener("submit", preventNavigation));
    try {
      await userEvent.clear(field);
      await userEvent.type(field, edited);
      for (const button of buttons) await userEvent.click(button);
      await expect(submissions).toHaveLength(5);
      for (const submission of submissions.slice(0, 4)) await expect(submission.get("q")).toBe(edited);
      await expect(submissions[4].get("q")).toBeNull();
      await expect(copied).toBe(edited);
      await userEvent.click(canvas.getByRole("button", { name: "Copy prompt" }));
      await expect(copied).toBe(edited);
      await expect(canvas.getByText("Prompt copied. Paste it into your chat.")).toBeVisible();
      await userEvent.type(field, " More detail.");
      await expect(canvas.queryByText("Prompt copied. Paste it into your chat.")).not.toBeInTheDocument();
      await userEvent.click(canvas.getByRole("button", { name: "Reset prompt" }));
      await expect(field).toHaveValue(agentsCopy.prompt);
      await expect(new FormData(field.form!).get("q")).toBe(agentsCopy.prompt);
      await userEvent.clear(field);
      await userEvent.type(field, "   ");
      for (const button of buttons) await expect(button).toBeDisabled();
      await expect(canvas.getByRole("button", { name: "Copy prompt" })).toBeDisabled();
      await userEvent.click(canvas.getByRole("button", { name: "Reset prompt" }));
      for (const button of buttons) await expect(button).toBeEnabled();
    } finally {
      forms.forEach(form => form.removeEventListener("submit", preventNavigation));
      if (descriptor) Object.defineProperty(navigator, "clipboard", descriptor);
      else Reflect.deleteProperty(navigator, "clipboard");
    }
  },
};

const checkMenuDismissal: NonNullable<Story["play"]> = async ({
  canvasElement,
}) => {
  const select = within(canvasElement).getByRole("combobox", {
    name: "Where would you like to look?",
  });
  await userEvent.click(select);
  const menu = within(canvasElement.ownerDocument.body).getByRole("listbox");
  await waitFor(() =>
    expect(
      within(menu).getByRole("option", { name: "Client work" }),
    ).toBeVisible(),
  );
  await waitFor(() =>
    expect(
      within(menu).getByRole("option", { name: "Client work" }),
    ).toHaveFocus(),
  );
  await expect(within(menu).getAllByRole("option")).toHaveLength(3);
  await expect(menu.getBoundingClientRect().left).toBeGreaterThanOrEqual(0);
  await expect(menu.getBoundingClientRect().right).toBeLessThanOrEqual(
    window.innerWidth,
  );
  await userEvent.keyboard("{Escape}");
  await waitFor(() => expect(select).toHaveFocus());
  await expect(select).toHaveTextContent("Client work");
  await expect(select).toHaveAttribute("aria-expanded", "false");
};
export const MenuDismissalLight: Story = { play: checkMenuDismissal };
export const MenuDismissalDark: Story = {
  globals: { theme: "dark" },
  play: checkMenuDismissal,
};
export const MenuDismissalMobileDark: Story = {
  globals: { theme: "dark", viewport: { value: "mobile", isRotated: false } },
  play: checkMenuDismissal,
};
