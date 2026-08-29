import { ArrowRight } from "lucide-react";

export type ContextureEntity = {
  accent: "amber" | "pink" | "purple";
  fields: string[];
  name: string;
};

const listingEntities: ContextureEntity[] = [
  {
    accent: "purple",
    name: "users",
    fields: ["name string", "email string", "householdId id"],
  },
  {
    accent: "pink",
    name: "households",
    fields: ["name string", "members id[]", "createdAt number"],
  },
  {
    accent: "amber",
    name: "recipes",
    fields: ["title string", "source enum", "ownerId id"],
  },
];

export const contextureDomainEntities: ContextureEntity[] = [
  {
    accent: "purple",
    name: "Household",
    fields: ["members[]", "preferences", "pantry"],
  },
  {
    accent: "pink",
    name: "Recipe",
    fields: ["ingredients[]", "season", "effort"],
  },
  {
    accent: "amber",
    name: "Meal plan",
    fields: ["days[]", "servings", "status"],
  },
];

const accentClasses = {
  amber: "border-[#fab387]",
  pink: "border-[#f38ba8]",
  purple: "border-[#cba6f7]",
};

const accentRingClasses = {
  amber: "ring-[#fab387]",
  pink: "ring-[#f38ba8]",
  purple: "ring-[#cba6f7]",
};

function EntityCard({
  compact,
  detail,
  entity,
}: {
  compact: boolean;
  detail: boolean;
  entity: ContextureEntity;
}) {
  return (
    <div
      className={`${detail ? `${accentRingClasses[entity.accent]} min-h-[168px] rounded-xl p-[18px] ring-1 ring-inset sm:min-h-[210px]` : `${accentClasses[entity.accent]} min-w-0 rounded-lg border ${compact ? "p-2" : "p-2.5 min-[1024px]:p-3"}`} bg-[#313244]`}
    >
      <div
        className={`${detail ? "text-sm leading-[18px]" : compact ? "truncate whitespace-nowrap text-[9px] leading-none" : "break-words text-[9px] leading-[1.1] min-[821px]:text-[10px] min-[1280px]:text-xs"} font-data font-bold text-[#cdd6f4]`}
      >
        {entity.name}
      </div>
      <ul
        className={`${detail ? "mt-[14px] gap-0 text-xs leading-[1.6]" : compact ? "mt-2 gap-1.5 overflow-hidden text-[7px] leading-[1.2]" : "mt-2 gap-1.5 text-[7px] leading-[1.35] min-[1024px]:text-[9px]"} font-data grid text-[#bac2de]`}
      >
        {(compact ? entity.fields.slice(0, 2) : entity.fields).map((field) => (
          <li className={compact ? "truncate whitespace-nowrap" : "break-words"} key={field}>
            {field}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EntityConnector() {
  return (
    <ArrowRight
      aria-hidden="true"
      className="hidden self-center text-[#89dceb] sm:block"
      size={22}
      strokeWidth={1.6}
    />
  );
}

type ContextureSchemaPreviewProps = {
  compact?: boolean;
  description?: string;
  detail?: boolean;
  entities?: ContextureEntity[];
};

export function ContextureSchemaPreview({
  compact = false,
  description = "Contexture schema preview with users, households and recipes tables.",
  detail = false,
  entities = listingEntities,
}: ContextureSchemaPreviewProps) {
  if (!detail) {
    return (
      <figure className="h-full bg-[#111827]">
        <div
          aria-hidden="true"
          className="grid h-full grid-cols-3 gap-2 p-3.5 min-[1024px]:gap-3 min-[1024px]:p-5"
        >
          {entities.map((entity) => (
            <EntityCard compact={compact} detail={false} entity={entity} key={entity.name} />
          ))}
        </div>
        <figcaption className="sr-only">{description}</figcaption>
      </figure>
    );
  }

  return (
    <figure className="overflow-hidden rounded-[18px] bg-[#181825] ring-1 ring-[#45475a] ring-inset min-[1024px]:h-[430px]">
      <div aria-hidden="true" className="flex h-full flex-col">
        <div className="flex h-[52px] shrink-0 flex-wrap items-center justify-between gap-2 bg-[#313244] px-[18px]">
          <span className="font-caption text-[11px] font-bold text-[#cdd6f4]">
            <span className="text-[#a6e3a1]">●</span>{" "}
            CONTEXTURE / DOMAIN MODEL
          </span>
          <span className="font-caption text-[10px] font-semibold text-[#a6e3a1]">
            REVIEWED&nbsp; · &nbsp;NO DRIFT
          </span>
        </div>
        <div className="grid min-h-0 flex-1 gap-3 p-[22px] sm:grid-cols-[minmax(0,1fr)_22px_minmax(0,1fr)_22px_minmax(0,1fr)] sm:gap-[14px] min-[1024px]:items-center">
          {entities.map((entity, index) => (
            <div className="contents" key={entity.name}>
              <EntityCard compact={false} detail entity={entity} />
              {index < entities.length - 1 ? <EntityConnector /> : null}
            </div>
          ))}
        </div>
      </div>
      <figcaption className="sr-only">{description}</figcaption>
    </figure>
  );
}
