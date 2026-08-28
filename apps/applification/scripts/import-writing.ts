import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { parse } from "csv-parse/sync";
import {
  convertTipTapToMarkdown,
  getTipTapPlainText,
  type TipTapNode,
} from "../src/lib/tiptap-to-markdown";
import { parseWritingDocument } from "../src/lib/writing";

type PostRow = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  body: string;
  published: string;
  slug: string;
  tags: string;
};

type TagRow = {
  id: string;
  name: string;
};

type ManifestEntry = {
  sourceId: string;
  slug: string;
  type: "post" | "weeknote";
  oldUrl: string;
  outputFile: string;
  warnings: string[];
};

const repositoryDirectory = path.resolve(import.meta.dirname, "../../..");
const applicationDirectory = path.resolve(import.meta.dirname, "..");
const csvDirectory = path.join(repositoryDirectory, "csv");
const dryRunDirectory = path.join(applicationDirectory, ".migration", "writing");
const writeToCollection = process.argv.includes("--write");
const skipAssets = process.argv.includes("--skip-assets");

const outputContentDirectory = writeToCollection
  ? path.join(applicationDirectory, "content", "writing")
  : path.join(dryRunDirectory, "content", "writing");
const outputAssetsDirectory = writeToCollection
  ? path.join(applicationDirectory, "public", "images", "writing")
  : path.join(dryRunDirectory, "public", "images", "writing");
const manifestPath = writeToCollection
  ? path.join(outputContentDirectory, ".migration-manifest.json")
  : path.join(dryRunDirectory, "manifest.json");

function dateOnly(value: string) {
  return value.slice(0, 10);
}

async function readCsv<T>(filename: string) {
  const source = await fs.readFile(path.join(csvDirectory, filename), "utf8");
  return parse(source, {
    bom: true,
    columns: true,
    relax_column_count: true,
    skip_empty_lines: true,
  }) as T[];
}

function imageExtension(url: string, contentType: string | null) {
  const pathnameExtension = path.extname(new URL(url).pathname).toLowerCase();
  const allowedExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);

  if (allowedExtensions.has(pathnameExtension)) {
    return pathnameExtension === ".jpeg" ? ".jpg" : pathnameExtension;
  }

  const extensions: Record<string, string> = {
    "image/avif": ".avif",
    "image/gif": ".gif",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };

  return extensions[contentType?.split(";")[0] ?? ""] ?? ".jpg";
}

function collectImageNodes(node: TipTapNode, images: TipTapNode[] = []) {
  if (node.type === "image") {
    images.push(node);
  }

  for (const child of node.content ?? []) {
    collectImageNodes(child, images);
  }

  return images;
}

function summaryFromDocument(document: TipTapNode) {
  const text = getTipTapPlainText(document);
  if (text.length <= 220) {
    return text;
  }

  const shortened = text.slice(0, 220);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > 160 ? lastSpace : 220).trim()}…`;
}

async function downloadImage(
  sourceUrl: string,
  slug: string,
  index: number,
) {
  const response = await fetch(sourceUrl, {
    headers: { "user-agent": "Applification writing migration/1.0" },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const extension = imageExtension(sourceUrl, response.headers.get("content-type"));
  const hash = createHash("sha1").update(sourceUrl).digest("hex").slice(0, 10);
  const filename = `${slug}-${String(index + 1).padStart(2, "0")}-${hash}${extension}`;
  await fs.writeFile(
    path.join(outputAssetsDirectory, filename),
    Buffer.from(await response.arrayBuffer()),
  );

  return `/images/writing/${filename}`;
}

async function localiseImages(document: TipTapNode, slug: string) {
  const warnings: string[] = [];
  const images = collectImageNodes(document);

  await Promise.all(
    images.map(async (image, index) => {
      const sourceUrl = typeof image.attrs?.src === "string" ? image.attrs.src : "";
      const alt = typeof image.attrs?.alt === "string" ? image.attrs.alt.trim() : "";

      if (!alt) {
        warnings.push(`Image ${index + 1} has no alt text`);
      }

      if (!sourceUrl || skipAssets) {
        return;
      }

      try {
        const localUrl = await downloadImage(sourceUrl, slug, index);
        image.attrs = { ...image.attrs, src: localUrl };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        warnings.push(`Could not download image ${index + 1} from ${sourceUrl}: ${message}`);
      }
    }),
  );

  return warnings;
}

function parseTagIds(value: string) {
  const parsed = JSON.parse(value) as unknown;
  if (!Array.isArray(parsed) || parsed.some((tagId) => typeof tagId !== "string")) {
    throw new Error(`Invalid tags value: ${value}`);
  }
  return parsed;
}

async function run() {
  const [posts, tags] = await Promise.all([
    readCsv<PostRow>("Post.csv"),
    readCsv<TagRow>("Tag.csv"),
  ]);
  const tagNames = new Map(tags.map((tag) => [tag.id, tag.name]));
  const publishedPosts = posts.filter((post) => post.published === "PUBLISHED");

  await Promise.all([
    fs.mkdir(outputContentDirectory, { recursive: true }),
    fs.mkdir(outputAssetsDirectory, { recursive: true }),
  ]);

  const manifestEntries: ManifestEntry[] = [];

  for (const post of publishedPosts) {
    const document = structuredClone(JSON.parse(post.body)) as TipTapNode;
    if (document.type !== "doc") {
      throw new Error(`Post ${post.id} (${post.slug}) does not contain a TipTap doc root`);
    }

    const topicNames = parseTagIds(post.tags).map((tagId) => {
      const tagName = tagNames.get(tagId);
      if (!tagName) {
        throw new Error(`Post ${post.id} (${post.slug}) references missing tag ${tagId}`);
      }
      return tagName;
    });
    const type = topicNames.includes("weeknote") ? "weeknote" : "post";
    const warnings = await localiseImages(document, post.slug);
    const conversion = convertTipTapToMarkdown(document);
    warnings.push(...conversion.warnings);

    const description = post.description.trim();
    const summary = description || summaryFromDocument(document);
    if (!description) {
      warnings.push("Description was missing and the summary was derived from the body");
    }

    const frontmatter = {
      title: post.title.trim(),
      date: dateOnly(post.createdAt),
      updated: dateOnly(post.updatedAt),
      type,
      summary,
      topics: topicNames.length ? topicNames : ["writing"],
      featured: false,
      draft: false,
      slug: post.slug,
      legacyId: post.id,
    };
    const source = matter.stringify(`${conversion.markdown}\n`, frontmatter);
    const filename = `${post.slug}.md`;

    parseWritingDocument(filename, source);
    await fs.writeFile(path.join(outputContentDirectory, filename), source, "utf8");

    manifestEntries.push({
      sourceId: post.id,
      slug: post.slug,
      type,
      oldUrl: `/${type === "weeknote" ? "weeknotes" : "posts"}/${post.slug}`,
      outputFile: `content/writing/${filename}`,
      warnings: [...new Set(warnings)],
    });
  }

  const postCount = manifestEntries.filter((entry) => entry.type === "post").length;
  const weeknoteCount = manifestEntries.filter((entry) => entry.type === "weeknote").length;
  const slugs = new Set(manifestEntries.map((entry) => entry.slug));

  if (
    manifestEntries.length !== 36 ||
    postCount !== 29 ||
    weeknoteCount !== 7 ||
    slugs.size !== manifestEntries.length
  ) {
    throw new Error(
      `Migration validation failed: ${manifestEntries.length} entries, ${postCount} posts, ${weeknoteCount} weeknotes, ${slugs.size} unique slugs`,
    );
  }

  const manifest = {
    mode: writeToCollection ? "collection" : "dry-run",
    counts: {
      published: manifestEntries.length,
      posts: postCount,
      weeknotes: weeknoteCount,
      warnings: manifestEntries.reduce((count, entry) => count + entry.warnings.length, 0),
    },
    entries: manifestEntries,
  };

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log(
    `${writeToCollection ? "Imported" : "Dry run generated"} ${postCount} posts and ${weeknoteCount} weeknotes.`,
  );
  console.log(`Manifest: ${manifestPath}`);
}

await run();
