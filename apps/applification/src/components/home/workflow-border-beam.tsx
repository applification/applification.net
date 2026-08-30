type WorkflowBorderBeamProps = {
  from: "bottom" | "left" | "right" | "top";
  radius: number;
  to: "bottom" | "left" | "right" | "top";
};

export function WorkflowBorderBeam({
  from,
  radius,
  to,
}: WorkflowBorderBeamProps) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute -inset-px h-[calc(100%+2px)] w-[calc(100%+2px)] overflow-visible"
      data-motion-node-beam
      data-motion-node-beam-from={from}
      data-motion-node-beam-to={to}
    >
      <rect
        height="calc(100% - 2px)"
        pathLength="100"
        rx={radius}
        width="calc(100% - 2px)"
        x="1"
        y="1"
      />
    </svg>
  );
}
