import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Local assets keep preview generation independent of external font services.
const assets = Promise.all([
  readFile(join(process.cwd(), "assets/social/Newsreader-Regular.ttf")),
  readFile(join(process.cwd(), "assets/social/Geist-Regular.ttf")),
  readFile(join(process.cwd(), "public/brand/applification-mark-light.svg"), "base64"),
]);

// Light theme roles from globals.css, resolved for the standalone image renderer.
const palette = {
  background: "#f3f4f6",
  text: "#20242c",
  secondary: "#60646c",
  accent: "#006d9c",
  border: "#d9dce1",
};

type SocialImageOptions = {
  label: string;
  title: string;
  description: string;
};

export async function createSocialImage({
  label,
  title,
  description,
}: SocialImageOptions) {
  const [newsreader, geist, logo] = await assets;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "54px 72px 44px",
          background: palette.background,
          color: palette.text,
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* The image renderer embeds this local SVG in the final PNG. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/svg+xml;base64,${logo}`}
            width={73}
            height={34}
            alt=""
          />
          <span style={{ fontSize: 26 }}>Applification</span>
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            paddingBottom: 12,
          }}
        >
          <div style={{ display: "flex", fontSize: 24, color: palette.accent, marginBottom: 22 }}>
            {label}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Newsreader",
              fontSize: 112,
              letterSpacing: "-3px",
              lineHeight: 1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 38,
              lineHeight: 1.3,
              marginTop: 24,
              maxWidth: 990,
              color: palette.secondary,
            }}
          >
            {description}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${palette.border}`,
            paddingTop: 24,
            fontSize: 22,
            color: palette.secondary,
          }}
        >
          <span>Dave Hudson</span>
          <span>applification.net</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Newsreader", data: newsreader, weight: 400, style: "normal" },
        { name: "Geist", data: geist, weight: 400, style: "normal" },
      ],
    },
  );
}
