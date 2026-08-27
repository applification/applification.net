import type { Preview } from "@storybook/nextjs-vite";
import { appFontVariables } from "../src/app/fonts";
import "../src/app/globals.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Site colour theme",
      toolbar: {
        icon: "paintbrush",
        items: [
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
    viewport: { value: "desktop", isRotated: false },
  },
  parameters: {
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "error",
    },
    viewport: {
      options: {
        desktop: {
          name: "Desktop design · 1440px",
          styles: { height: "900px", width: "1440px" },
          type: "desktop",
        },
        mobile: {
          name: "Mobile design · 390px",
          styles: { height: "844px", width: "390px" },
          type: "mobile",
        },
        wideMobile: {
          name: "Wide mobile QA · 646px",
          styles: { height: "743px", width: "646px" },
          type: "mobile",
        },
        reviewMobile: {
          name: "Review mobile QA · 547px",
          styles: { height: "743px", width: "547px" },
          type: "mobile",
        },
        tablet: {
          name: "Tablet QA · 900px",
          styles: { height: "900px", width: "900px" },
          type: "tablet",
        },
        narrowTablet: {
          name: "Narrow tablet QA · 850px",
          styles: { height: "743px", width: "850px" },
          type: "tablet",
        },
        compactTablet: {
          name: "Compact tablet QA · 781px",
          styles: { height: "743px", width: "781px" },
          type: "tablet",
        },
        laptop: {
          name: "Laptop QA · 1142px",
          styles: { height: "743px", width: "1142px" },
          type: "desktop",
        },
        compactLaptop: {
          name: "Compact laptop QA · 1107px",
          styles: { height: "743px", width: "1107px" },
          type: "desktop",
        },
      },
    },
    options: {
      storySort: {
        order: ["Layout", "Homepage"],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme === "dark" ? "dark" : "light";

      if (typeof document !== "undefined") {
        document.documentElement.dataset.theme = theme;
      }

      return (
        <div
          className={`${appFontVariables} font-body min-h-screen bg-[var(--app-bg)] text-[var(--app-text-primary)] antialiased`}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
