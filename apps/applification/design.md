---
name: applification-web-design
description: "Design and review user-visible work for applification.net. Use for pages, components, copy, responsive behaviour, themes, motion, and Storybook stories."
---

# Design applification.net

Applification is Dave Hudson's working site. It explains how he builds and leads software work, shows commercial evidence, and gives people a direct route to discuss a contract. The site should read as the work of one experienced engineer with editorial judgment, not as a generic agency or SaaS template.

The visual identity comes from a deliberate contrast. Newsreader gives conclusions and page turns an editorial voice. Geist and the mono faces make delivery details, evidence, and product interfaces feel exact. Slate-blue surfaces connect the light and dark themes. Sky blue marks action and orientation.

## Scope and authority

This file owns durable design judgment. It explains what the interface should communicate, which choices belong to the Applification brand, and how agents should review user-visible changes.

Use the sources in this order:

1. The current task and supplied content decide what the page must do.
2. This file decides the brand rules and design constraints.
3. `src/app/globals.css`, `src/app/fonts.ts`, and established components own exact runtime values and supported implementation patterns.
4. Storybook records supported themes, viewports, states, and interaction behaviour.
5. `../../applification.pen` supplies visual intent, composition references, and design history. It is useful, but some frames lag behind production and it is not a mechanical source of truth.

When these sources disagree, preserve accessible production behaviour, identify the mismatch, and keep the correction inside the requested scope. Do not quietly rebuild current UI to match an older pen frame.

## Start with the reader's job

Name the reader and the decision before choosing a layout. Most pages serve one of these jobs:

- A prospective client needs to decide whether Dave fits a senior contract.
- A technical reader needs to understand how a product or delivery method works.
- A reader needs evidence that the claims are backed by shipped work.
- A contact needs to prepare a useful first conversation.

Put the strongest supported answer near the start. Keep exact evidence, qualifications, and technical depth available without making the first read feel like a data dump. Order content by reader need, not by the order it arrived in a brief.

## Brand character

Aim for calm, direct, technically literate, and personal. Confidence comes from specific claims, working examples, and visible constraints.

Avoid startup theatre, agency puffery, invented urgency, and vague claims about transformation. Do not make the site sound larger than the person and products behind it. Copy should use plain British English, active voice, sentence case, and the vocabulary a client or product user recognises.

The page should feel authored. A strong line break, a useful diagram, a product interaction, or a well-composed comparison is worth more than decorative effects.

## Shared colour system

The shared shell uses a compact palette:

- Slate-blue canvas and section colours from `--app-bg`, `--app-bg-end`, `--app-hero-end`, `--app-section`, `--app-muted-section`, and `--app-card`.
- Deep navy and near-white text from `--app-text-primary` with quieter copy from `--app-text-secondary` and `--app-text-muted`.
- Sky blue action and orientation colours from `--app-action`, `--app-label-text`, `--app-sky-text`, and `--app-focus`.
- Semantic status colours only when success, warning, error, or workflow ownership has meaning.

Use semantic variables. Do not add a raw colour to an ordinary page component when an existing role already expresses the intent. Shared shadcn components use their semantic aliases such as `background`, `foreground`, `primary`, `muted`, `border`, and `ring`.

Colour must explain something. Use it for action, state, product identity, data series, or orientation. Do not give peer facts different colours merely to make a panel lively. A section normally has one accent family. If hierarchy is weak, fix type, spacing, alignment, or content order before adding another colour.

Peer client cases and their evidence notes use the shared slate-blue surfaces. Distinguish clients through their evidence and composition, not separate feature backgrounds.

Featured editorial content uses scale and composition for emphasis. Do not turn `--app-selected` into a large page surface; reserve it for selected states and compact orientation cues.

Choice controls nested inside muted cards keep the `--app-card` fill when selected. Use the action border, type weight, and control state to show the choice instead of adding a blue background.

Theme counterparts preserve the same semantic role and comparable emphasis, not the same literal colour. Light mode uses a deeper cyan-blue for readable accent text; dark mode may use a paler cyan. Do not copy a bright dark-mode text value onto a light surface when it loses contrast.

Light mode uses a muted grey-blue canvas, slate section bands, and pale cards. Keep saturation low so the blue reads as an undertone. Ordinary page backgrounds and sections stay flat.

The homepage hero uses the `--hero-*` roles rather than the canvas roles. In light mode it deepens from the canvas colour into a darker slate gradient, so light mode stays light. In dark mode it drops to navy below the canvas so the first screen carries more depth and the agent-loop terminal reads as part of the hero. Hero text, labels, actions and focus rings use the `--hero-*` roles in both themes. The closing contract call to action keeps its default theme-aware surface. Do not add fixed navy page surfaces to the homepage in light mode.

Keep text contrast at WCAG AA. In particular, do not replace the accessible light `--app-text-muted` value with the lighter value found in older pen frames.

### Product identities

Plantry, StoryLoops, Contexture, and Voiced may depart from the shared palette because their colours identify a real product or reproduce its interface. Scope those values to the product page, product preview, or illustration. The surrounding site shell should still use the shared typography, interaction sizes, focus behaviour, and content rhythm.

Prefer named product variables over repeated literals when the same colour has the same job. Raw values are acceptable inside a self-contained product screenshot, diagram, or faithful interface reproduction. They are not acceptable as an easy way to style general navigation, prose, or controls.

## Typography

The registered type roles live in `src/app/fonts.ts` and the corresponding utilities live in `src/app/globals.css`.

- `font-heading` uses Newsreader for page titles, section turns, article headings, and short editorial statements.
- `font-body` uses Geist for prose, navigation, controls, and explanations.
- `font-caption` uses IBM Plex Mono for compact labels, operational metadata, and short evidence annotations.
- `font-data` uses Geist Mono for code, identifiers, commands, timestamps, and aligned technical data.

Do not set whole paragraphs or tables in mono. Do not use a tracked uppercase label as decoration. A label must identify a content type, state, source, or step that helps the reader navigate.

Meaning-bearing labels in interactive workflows use at least 11 pixel type. Reserve 10 pixel captions for secondary metadata; do not rely on colour to make essential small text readable.

Large headings need deliberate line breaks and a stable measure. Keep body copy close to 60 to 70 characters per line. Preserve readable type before trying to make a layout denser.

## Layout and composition

The shared desktop content width is 1200 pixels. Standard outer spacing is 24 pixels on mobile, 48 pixels on tablet, and up to 120 pixels on a 1440 pixel viewport. A page may use a narrower reading column inside that frame.

Use composition to expose the page's argument:

- The homepage runs hero, client row, client outcomes, products row, contract call to action. The hero holds the claim, the working-method caption and the agent-loop diagram together; do not add a second AI section below it. The client row sets real client and public-sector names in Newsreader with a single mono label, because typographic names are honest evidence until supplied logos exist. Product showcases belong on the products pages; the homepage row gives each product one card with its own identity colours.
- A contract page should lead with fit, availability, or evidence rather than a generic welcome.
- A product page should lead with the product's job and a concrete view of the product.
- A case study should make the constraint, decision, and result easy to connect.
- A writing page should favour reading rhythm over card density.
- An interactive contact page should put the next useful action ahead of explanation about the mechanism.

Main-page and detail-page hero labels share top spacing of 48px below 1024px and 64px from 1024px. On the homepage, align the blue contract summary and place the introductory line above it. Anchor their content to the top; hero density and aside height must not move the opening label.

Choose section geometry before choosing components. Use a shared edge and consistent baselines. Evidence tables, diagrams, and product previews may use the full content width. Reading prose should not stretch across it.

Do not force every section into a card grid. Repeated containers are useful only for true peers. When one item carries the conclusion, give it more space or place it earlier.

Use a subtle canvas transition where the current shell calls for it. Do not introduce decorative gradients, glows, glass panels, or ornamental shadows into the shared site language.

The desktop header is the glass exception. At 820 pixels and wider it stays at the top while content scrolls underneath. After scrolling, use a translucent tint (52% in light mode, 64% in dark), 16px backdrop blur, subtle saturation and a fine highlight along the glass edge. Content colours should remain visible beneath it while navigation stays readable. Keep the initial header opaque, preserve the product theme, and use an opaque fallback when blur is unsupported or reduced transparency is requested. Anchor targets need 80 pixels of clearance below the header.

## Components and interaction

Reuse established components and shadcn controls before adding new markup. Keep colour and type in semantic variables or component variants. Use component `className` values mainly for layout and responsive composition.

Shared controls must have:

- A target at least 44 by 44 pixels where the control is interactive.
- A visible `--app-focus` or semantic ring.
- Clear hover, active, disabled, error, and loading behaviour when those states apply.
- A stable accessible name.
- No information conveyed by colour alone.

External website links open in a new tab with `rel="noopener noreferrer"`, a trailing north-east arrow icon, and an accessible "opens in a new tab" announcement. Use `ExternalLink` for ordinary external links; custom cards must preserve the same cues. Internal navigation, page anchors and email links keep their normal behaviour. Product subdomains are external destinations.

Text hyperlinks use `link-sweep` on the anchor and `link-sweep-label` around the label. Keep a quiet underline at rest, then sweep a stronger line from left to right on desktop hover or keyboard focus over 240 milliseconds. Trailing arrows move slightly in their direction. Reduced motion shows the stronger underline immediately with stationary arrows. Keep this treatment on text links; navigation tabs, cards and filled action buttons retain their own interaction styles.

Do not publish Dave's email address in public pages, metadata, client-side code or `mailto:` links. Direct enquiries through the contact workflow, its manual brief form, or LinkedIn. Email delivery details belong in server-side configuration.

Use buttons for actions and links for navigation. Keep the same verb through the full interaction. If a control says "Publish", its confirmation says "Published".

Icons inside a filled action control inherit the label colour. Keep the control as one visual mark rather than adding a second accent to its icon.

Prefer native elements and source order. Use semantic headings, landmarks, lists, tables, figures, labels, and descriptions before adding ARIA.

## Responsive behaviour

Design at the content breakpoints rather than only at named devices. The required reference widths are the Storybook 1440 pixel desktop and 390 pixel mobile viewports. Use the existing intermediate Storybook widths to catch crowded navigation, broken grids, and premature desktop layouts.

Reflow before shrinking type. Grid and flex children need `min-width: 0` where content may overflow. Long tables may scroll inside a labelled region when reordering would damage lookup. Pages must not create horizontal document overflow at 320 pixels or wider.

Short mobile conversation workspaces use the available small-viewport height. Keep the opening choice and empty composer visible together, then collapse completed choices so the next question replaces them rather than stacking below them.

For the contact workspace, treat 375 by 667 pixels as an explicit compact-height reference alongside the standard 390 pixel mobile story. Keep route choices dense enough to preserve context. Before a route is selected, and for product or general enquiries, keep the composer to a 56 pixel single row with the return action beside the input. Contract enquiries expand the composer to include a dashed PDF/DOCX upload area inside the same border. Support both file picking and dropping over the composer, show the private attachment with a removal action, and keep typed text intact. Uploaded files are stored privately for delivery, not read by AI; explain this beside the composer. The placeholder already invites pasted text, so do not add a separate paste button.

Keep the contact composer quiet until it needs correction. Show no persistent character-limit caption. When a message exceeds 12,000 characters, preserve the full text, mark the input and focus outline with the accessible contact error colour, and explain the excess outside the bordered composer beside the attachment guidance. Block submission until the text fits. Manual completion uses the same pale surfaces and review step, preserving accepted details and making the pending original message available. Keep the mode switch beside Restart in the workspace header, labelled “Use form” in the AI view and “Use AI” in the form view. Switching preserves the draft. Do not repeat the switch or a LinkedIn contact link below the workspace. Manual form fields use two columns from the small breakpoint: pair enquiry type with subject, company or product, and name with email. Long answers span both columns, with shorter optional textareas. Keep a single column on phones and use the shared Select, Field, Input and Textarea components with explicit labels.

Keep action labels on one line. In narrow cards, remove redundant context from the visible label or stack paired controls before reducing control type.

The contact conversation and composer share a centred content column capped at 880 pixels, with minimum side insets of 12 pixels on mobile and 20 pixels from the small breakpoint. Align the opening route-choice message with the composer. Individual reply bubbles may retain a readable maximum width.

Keep the full enquiry workflow closed initially, in its own outlined card separated from the chat card. Its disclosure is a prominent “See how this AI chat enquiry works” row with a miniature AI → Review → Email sequence. Use the page background, with no additional filled surface behind the call to action. The full diagram expands within this workflow card. Keep the centred approval note between the chat and workflow cards, clear of the chat's shadow. The preview plays one short sequence when it enters view and stays still for reduced motion. The whole preview is the native disclosure control, with inset keyboard focus. When expanded, replace the preview and teaser with a compact “AI chat enquiry workflow” heading and a “Hide” control. Align the overview with both edges of the diagram and keep it to one short sentence inviting visitors to choose an example. The diagram caption explains that this is an example, not live enquiry status. Keep the Vercel attribution below the diagram. Put the changing step explanation above the diagram, alongside playback controls, with a step counter, the active node title and a matching colour accent. At desktop widths, keep this caption below the site header while the diagram scrolls; on phones it stays in normal document flow. Reveal each new step heading with a brief character-by-character typing effect; reserve its full space, expose the complete text to screen readers, show it in full when paused and skip the effect for reduced motion. Keep the explanation immediately readable. When paused or finished, show Previous and Next icon buttons beside Resume or Replay. Step navigation stays paused, disables the first/last boundaries, updates the highlighted node and explanation together, and resumes from the selected step. Allow at least three seconds to read each automatic step, with longer holds for the more involved stages (1.4 times the original sequence durations). Give the active diagram node a lighter fill mixed from its existing semantic colour, alongside the stronger outline; preserve that highlight while paused. Keep the illustrated-example disclaimer beneath the diagram.

Responsive reflow may change geometry, density, and content order, but it must not invent a new colour treatment for the same content. Keep the desktop palette and hierarchy unless the smaller view represents a genuinely different product state.

Light and dark themes are both first-class for the shared site. Product interfaces that intentionally have one theme must remain legible inside either shell and should document that exception in their story.

## Motion

Motion should explain state or direction. The homepage working-method sequence, menu transitions, and theme transition are examples of motion with a job.

The theme toggle uses a 400 millisecond circular reveal expanding from the control. Capture final colours together so controls do not lag behind the reveal. Reduced motion and browsers without View Transitions switch immediately.

Keep one orchestrated motion idea per section. Do not add ambient movement to make a static composition feel more expensive. Respect `prefers-reduced-motion`, preserve the final state without animation, and never require motion to understand the content.

## Generated-design patterns to reject

Do not ship these defaults unless the content gives them a real job:

- A centred generic hero followed by a uniform card grid.
- Rainbow fact labels or unrelated accent colours assigned to peers.
- Pills for ordinary metadata.
- Cards nested inside cards.
- Decorative numbered sections when order does not matter.
- Large icons used as filler.
- Tiny muted copy used to make a crowded layout fit.
- Repeated summaries that restate the same claim.
- A separate visual system for a new page.
- Decorative charts or diagrams that do not make a relationship easier to understand.

Restraint must still look designed. Strong typography, useful contrast, exact alignment, and a page-specific organising idea should carry the work.

## Storybook is the executable reference

Add or update the nearest story for every material UI change. Full-page work should normally cover desktop light, desktop dark, mobile light, and mobile dark. Add intermediate widths when a component changes topology between those states.

Story play functions should check observable failures that have happened before, such as horizontal overflow, missing controls, inaccessible names, incorrect order, or a grid that does not reflow. Keep subjective composition review visual.

The global Storybook accessibility setting treats violations as errors. Do not weaken it to make a change pass.

## Agent workflow

Before changing user-visible code:

1. Read this file and the current implementation.
2. Open the nearest full-page and component stories.
3. Inspect the relevant pen frame when it helps with composition or design history.
4. State which source is current when they disagree.
5. Name the page's reader, job, shared palette, type roles, layout idea, and one distinguishing element before coding.

While implementing:

1. Reuse semantic tokens and established components.
2. Remove redundant colour choices in the affected area.
3. Keep product colours inside a product boundary.
4. Preserve keyboard access, focus, reduced motion, both shared themes, and responsive behaviour.

Before finishing:

1. Run lint, type checking, unit tests, Storybook tests, and the production build as appropriate.
2. Review affected stories at 1440 and 390 pixels in every supported theme.
3. Check at least one intermediate width for layout changes.
4. Inspect keyboard focus and reduced motion for interactive changes.
5. Compare screenshots rather than trusting class names.

## Keeping the sources aligned

Change this file when a durable design decision changes. Change CSS variables or shared components when the exact mechanic changes. Change Storybook when supported states or verification change. Update the pen document when a new composition becomes an approved design reference, but do not block a production correction on an older frame.

Known current limitations:

- Several pen frames predate the latest production implementation.
- The combined About and contact pen frames are historical. Use the standalone current contact page and iPhone SE workspace frames for contact composition, selected-state, and compact-height decisions.
- The pen document has page frames rather than a reusable component library.
- Product-detail coverage in the pen document is not complete across themes.
- Some product mockups still contain repeated literal colours that should become scoped product variables when those components next change.
- `PageShell` is legacy and should not be treated as the preferred page pattern.

When repeated review feedback exposes a missing rule, add the narrowest observable correction here. Put repeatable mechanics in code and mechanical failures in tests.

The desktop sticky header contracts from 64px to 40px when scrolling down beyond 80px, and expands immediately on upward scrolling. The compact version uses the logo mark alone, 13px navigation labels and a 32px theme control. Its original layout space remains reserved to prevent scroll jumps. CSS transitions last 220ms and are disabled for reduced motion; visible keyboard focus restores the full header. Mobile keeps the full static header.

In the compact desktop header, hide navigation links while scrolling down. Keep the logo and theme switcher visible. Restore navigation on upward scrolling, near the top, or when keyboard focus enters the header.

The active navigation pill slides between desktop links with a short spring. Position it in the navigation's local coordinate system. Do not use shared-layout projection: document scroll restoration and the sticky header's changing size must never animate the pill from page content into the header. Reduced motion changes its position immediately. The header's own reveal and resize transitions remain independent.
