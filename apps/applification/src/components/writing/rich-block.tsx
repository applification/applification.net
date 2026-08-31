import type { ComponentType } from "react";
import {
  parseRichBlock,
  type RichBlockSchemaRegistry,
} from "@/lib/rich-blocks";
import { richBlockSchemas } from "@/lib/rich-block-registry";
import { LinkPreview } from "./link-preview";
import { YouTubeEmbed } from "./youtube-embed";

export type RichBlockComponentRegistry = Record<
  string,
  ComponentType<Record<string, unknown>>
>;

export type RichBlockRegistry = {
  components: RichBlockComponentRegistry;
  schemas: RichBlockSchemaRegistry;
};

export const richBlockComponents = {
  "link-preview": LinkPreview,
  youtube: YouTubeEmbed,
} satisfies RichBlockComponentRegistry;

export const richBlockRegistry: RichBlockRegistry = {
  components: richBlockComponents,
  schemas: richBlockSchemas,
};

type RichBlockProps = {
  article: string;
  index: number;
  registry?: RichBlockRegistry;
  source: string;
};

export function RichBlock({
  article,
  index,
  registry = richBlockRegistry,
  source,
}: RichBlockProps) {
  const block = parseRichBlock(source, article, index, registry.schemas);
  const Component = registry.components[block.name];

  if (!Component) {
    throw new Error(
      `Invalid rich block in ${article} (rich block "${block.name}" ${index + 1}): no registered component`,
    );
  }

  return <Component {...(block.props as Record<string, unknown>)} />;
}
