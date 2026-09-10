// Server-only content access: Markdown never enters the shared browser bundle.
import { getWriting } from "./writing";
import { validateRichBlocks, stripRichBlocks } from "./rich-blocks";
import { richBlockSchemas } from "./rich-block-registry";
import { publicProducts, siteUrl } from "./public-catalog";
import {
  contextureBuildRows,
  contextureContractSteps,
  voicedBuildRows,
  voicedCaptureRoutes,
  storyloopsOwnershipSteps,
  storyloopsBuildPrinciples,
  plantryPlanningSteps,
  plantryBuildPrinciples,
  productPageCopy,
  productLinks,
} from "./content/product-details";
import {
  eruptivCase,
  peppyHealthCase,
  logicallyCopy,
  logicallyMetrics,
  logicallyDecisions,
  supportingCases,
} from "./content/client-work";
import {
  readContentInputSchema,
  searchSiteInputSchema,
  type PublicContent,
  type ContentSummary,
} from "./content-schema";

const sectionLimit = 4000;
// Split at paragraph boundaries where possible. Long code/paragraphs are still
// bounded and returned in order, with continuation labels rather than dropped.
export function splitContent(
  title: string,
  content: string,
): PublicContent["sections"] {
  const chunks: string[] = [];
  let remaining = content.trim();
  while (remaining.length > sectionLimit) {
    const paragraph = remaining.lastIndexOf("\n\n", sectionLimit);
    let at = paragraph > sectionLimit / 2 ? paragraph : sectionLimit;
    if (/[\uD800-\uDBFF]/.test(remaining[at - 1])) at -= 1;
    chunks.push(remaining.slice(0, at));
    remaining = remaining.slice(at);
  }
  if (remaining.trim()) chunks.push(remaining);
  return chunks.map((content, index) => ({
    title: index ? `${title} (continued ${index + 1})` : title,
    content,
  }));
}

function section(title: string, content: string) {
  return { title, content };
}
function bullets(
  items: Array<{ title: string; description?: string; copy?: string }>,
) {
  return items
    .map((item) => `### ${item.title}\n${item.description ?? item.copy}`)
    .join("\n\n");
}
function productContent(): PublicContent[] {
  const featureContent = {
    contexture: contextureContractSteps
      .map((s) => `${s.title}: ${s.detail}`)
      .join("\n\n"),
    voiced: voicedCaptureRoutes
      .map((s) => `${s.title} (${s.shortcutLabel}): ${s.description}`)
      .join("\n\n"),
    storyloops: bullets(storyloopsOwnershipSteps),
    plantry: bullets(plantryPlanningSteps),
  };
  const specifications = {
    contexture: contextureBuildRows
      .map((s) => `${s.label}: ${s.value}`)
      .join("\n"),
    voiced: voicedBuildRows.map((s) => `${s.label}: ${s.value}`).join("\n"),
    storyloops: bullets(storyloopsBuildPrinciples),
    plantry: bullets(plantryBuildPrinciples),
  };
  return publicProducts.map((product) => {
    const copy = productPageCopy[product.slug];
    const hero = copy.hero;
    const overview =
      "description" in hero ? hero.description : hero.paragraphs.join("\n\n");
    const status =
      product.status === "LIVE"
        ? "live"
        : product.status === "R&D"
          ? "research"
          : "in-development";
    return {
      type: "products",
      slug: product.slug,
      title: product.name,
      summary: product.description,
      url: product.url,
      topics: [],
      status,
      sections: [
        section(
          hero.title,
          `${overview}\n\nCurrent status: ${product.status}.`,
        ),
        ...Object.entries(copy)
          .filter(([key]) => key !== "hero")
          .map(([key, value]) => {
            const group = value as { title?: string; paragraphs?: string[] };
            return section(
              group.title ?? key,
              group.paragraphs?.join("\n\n") ?? "",
            );
          }),
        section("Capabilities", featureContent[product.slug]),
        section("Build and platform", specifications[product.slug]),
        section(
          "Commercial terms",
          `${product.pricing.label}\n\n${product.pricing.description}`,
        ),
      ]
        .filter((s) => s.content)
        .flatMap((s) => splitContent(s.title, s.content)),
      links: productLinks[product.slug],
    };
  });
}

function clientContent(): PublicContent[] {
  const cases: PublicContent[] = [
    {
      type: "client-work",
      slug: "logically",
      title: `Logically: ${logicallyCopy.titles[0]}`,
      summary: logicallyCopy.paragraphs[0],
      url: `${siteUrl}/client-work/logically`,
      topics: ["AI", "MCP", "Next.js", "TypeScript"],
      links: [{ label: "Logically", url: "https://logically.ai" }],
      sections: [
        section(
          "Role and context",
          `${logicallyCopy.role}\n${logicallyCopy.engagement}\n${logicallyCopy.period}\nStack: ${logicallyCopy.stack}\n\n${logicallyCopy.paragraphs[0]}`,
        ),
        section(
          logicallyCopy.titles[1],
          logicallyCopy.paragraphs.slice(1, 3).join("\n\n"),
        ),
        section(logicallyCopy.titles[2], bullets(logicallyDecisions)),
        section(
          logicallyCopy.titles[3],
          `${logicallyCopy.paragraphs[3]}\n\n${logicallyMetrics.map(([v, k]) => `${k}: ${v}`).join("\n")}`,
        ),
      ],
    },
    ...(
      [
        ["eruptiv", eruptivCase],
        ["peppy-health", peppyHealthCase],
      ] as const
    ).map(([slug, item]) => ({
      type: "client-work" as const,
      slug,
      title: `${item.company}: ${item.title}`,
      summary: item.summary,
      url: `${siteUrl}/client-work/${slug}`,
      topics: item.stack.split(", "),
      links: [{ label: item.websiteLabel, url: item.websiteHref }],
      sections: [
        section(
          "Role and context",
          `${item.role}\nContract through Applification Ltd\n${item.period}\nStack: ${item.stack}\n\n${item.summary}`,
        ),
        section(item.situationTitle, item.situation.join("\n\n")),
        section(item.decisionsTitle, bullets(item.decisions)),
        section(
          item.resultTitle,
          `${item.result}\n\n${item.metrics.map(([v, k]) => `${k}: ${v}`).join("\n")}`,
        ),
      ],
    })),
    ...supportingCases.map((item) => ({
      type: "client-work" as const,
      slug: item.company.split("  /")[0].toLowerCase(),
      title: `${item.company.split("  /")[0]}: ${item.title}`,
      summary: item.copy,
      url: `${siteUrl}/client-work`,
      topics: [],
      links: [],
      sections: [section(item.title, `${item.company}\n\n${item.copy}`)],
    })),
  ];
  return cases.map((item) => ({
    ...item,
    sections: item.sections.flatMap((s) => splitContent(s.title, s.content)),
  }));
}

export function getPublishedContent(): PublicContent[] {
  // Explicit even in development: previews/drafts must never enter public tools.
  const writing: PublicContent[] = getWriting({ includeDrafts: false }).map(
    (entry) => {
      const blocks = validateRichBlocks(
        entry.body,
        entry.slug,
        richBlockSchemas,
      );
      const links: PublicContent["links"] = [];
      const supplements = blocks.map((block) => {
        const props = block.props as Record<string, string>;
        if (block.name === "link-preview") {
          links.push({ label: props.title, url: props.destination });
          return `${props.title}\n${props.description}\n${props.destination}`;
        }
        if (block.name === "youtube") {
          const url = `https://www.youtube.com/watch?v=${props.videoId}`;
          links.push({ label: props.title, url });
          return `${props.title} — ${props.channel}\n${url} (video; no transcript provided)`;
        }
        if (block.name === "tweet")
          return `${props.author}: ${props.quote}\nhttps://twitter.com/i/web/status/${props.id}`;
        return `${props.description}\n${props.caption}`;
      });
      const sections = splitContent(entry.title, stripRichBlocks(entry.body));
      if (supplements.length)
        sections.push(
          ...splitContent("Embedded references", supplements.join("\n\n")),
        );
      return {
        type: "writing",
        slug: entry.slug,
        title: entry.title,
        summary: entry.summary,
        topics: entry.topics,
        date: entry.date,
        ...(entry.updated ? { updated: entry.updated } : {}),
        url: `${siteUrl}/writing/${entry.slug}`,
        sections,
        links,
      };
    },
  );
  return [...clientContent(), ...productContent(), ...writing];
}

const stopWords = new Set(
  "a an and are as at be been by can dave did do does for from has have how i in is it me of on or shipped show that the them to was what which who with work".split(
    " ",
  ),
);
function terms(text: string) {
  return (
    text
      .toLowerCase()
      .match(/[\p{L}\p{N}]+/gu)
      ?.filter((term) => !stopWords.has(term)) ?? []
  );
}
function summary(item: PublicContent): ContentSummary {
  const metadata: ContentSummary = {
    type: item.type,
    slug: item.slug,
    title: item.title,
    summary: item.summary,
    url: item.url,
    topics: item.topics,
    ...(item.date ? { date: item.date } : {}),
    ...(item.updated ? { updated: item.updated } : {}),
    ...(item.status ? { status: item.status } : {}),
  };
  return {
    ...metadata,
    summary:
      metadata.summary.length > 240
        ? metadata.summary.slice(0, 237) + "…"
        : metadata.summary,
  };
}
export function searchSite(
  input: unknown = {},
  content = getPublishedContent(),
) {
  const {
    query = "",
    type,
    topic,
    status,
    after,
    before,
    limit = 5,
    offset = 0,
  } = searchSiteInputSchema.parse(input);
  const needles = [...new Set(terms(query))];
  const matches = content
    .filter(
      (item) =>
        (!type || item.type === type) &&
        (!topic ||
          item.topics.some((t) => t.toLowerCase() === topic.toLowerCase())) &&
        (!status || item.status === status) &&
        (!after || Boolean(item.date && item.date >= after)) &&
        (!before || Boolean(item.date && item.date <= before)),
    )
    .map((item) => {
      const title = new Set(terms(item.title)),
        meta = new Set(terms(item.summary + " " + item.topics.join(" ")));
      const body = new Set(
        terms(item.sections.map((s) => s.content).join(" ")),
      );
      const score = needles.reduce(
        (total, term) =>
          total +
          (title.has(term) ? 5 : meta.has(term) ? 3 : body.has(term) ? 1 : 0),
        0,
      );
      return { item, score };
    })
    .filter(({ score }) => !needles.length || score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        (b.item.date ?? "").localeCompare(a.item.date ?? "") ||
        a.item.slug.localeCompare(b.item.slug),
    );
  return {
    results: matches
      .slice(offset, offset + limit)
      .map(({ item }) => summary(item)),
    total: matches.length,
    nextOffset: offset + limit < matches.length ? offset + limit : null,
  };
}

export function readContent(input: unknown, content = getPublishedContent()) {
  const {
    type,
    slug,
    section: index = 0,
  } = readContentInputSchema.parse(input);
  const item = content.find((item) => item.type === type && item.slug === slug);
  if (!item || !item.sections[index]) return null;
  return {
    ...summary(item),
    sections: item.sections.map(({ title }, index) => ({ index, title })),
    section: index,
    content: item.sections[index].content,
    format: "markdown" as const,
    nextSection: index + 1 < item.sections.length ? index + 1 : null,
    links: item.links,
  };
}
