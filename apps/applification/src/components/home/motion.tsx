"use client";

import type { ReactNode } from "react";
import {
  animate,
  motion,
  stagger,
  useAnimationControls,
  useInView,
  useReducedMotion,
} from "motion/react";
import { useEffect, useLayoutEffect, useRef } from "react";

export const motionTokens = {
  duration: {
    quick: 0.18,
    reveal: 0.46,
    trace: 0.34,
  },
  ease: [0.22, 1, 0.36, 1] as const,
  distance: 14,
};

type MotionChildrenProps = {
  children: ReactNode;
  className?: string;
};

export function HeroEntrance({
  children,
  className,
  order,
}: MotionChildrenProps & { order: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element || reduceMotion) {
      return;
    }

    const controls = animate(
      element,
      { y: [motionTokens.distance, 0] },
      {
        delay: 0.06 + order * 0.075,
        duration: motionTokens.duration.reveal,
        ease: motionTokens.ease,
      },
    );

    return () => controls.stop();
  }, [order, reduceMotion]);

  return (
    <motion.div className={className} initial={false} ref={ref}>
      {children}
    </motion.div>
  );
}

export function MotionReveal({ children, className }: MotionChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, {
    amount: 0.12,
    margin: "0px 0px -8% 0px",
    once: true,
  });
  const prepared = useRef(false);

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element || reduceMotion) {
      controls.set({ y: 0 });
      return;
    }

    const bounds = element.getBoundingClientRect();
    const visibleNow = bounds.top < window.innerHeight && bounds.bottom > 0;
    prepared.current = true;
    controls.set({ y: motionTokens.distance });

    if (visibleNow) {
      void controls.start({
        transition: {
          duration: motionTokens.duration.reveal,
          ease: motionTokens.ease,
        },
        y: 0,
      });
    }
  }, [controls, reduceMotion]);

  useEffect(() => {
    if (!prepared.current || !inView || reduceMotion) {
      return;
    }

    void controls.start({
      transition: {
        duration: motionTokens.duration.reveal,
        ease: motionTokens.ease,
      },
      y: 0,
    });
  }, [controls, inView, reduceMotion]);

  return (
    <motion.div
      animate={controls}
      className={className}
      initial={false}
      ref={ref}
    >
      {children}
    </motion.div>
  );
}

export function ProofStagger({ children, className }: MotionChildrenProps) {
  const ref = useRef<HTMLDListElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { amount: 0.25, once: true });
  const hasRun = useRef(false);

  useEffect(() => {
    const list = ref.current;

    if (!list || !inView || hasRun.current || reduceMotion) {
      return;
    }

    hasRun.current = true;
    const metrics = Array.from(list.children);
    const controls = animate(
      metrics,
      { y: [10, 0] },
      {
        delay: stagger(0.07),
        duration: motionTokens.duration.reveal,
        ease: motionTokens.ease,
      },
    );

    return () => controls.stop();
  }, [inView, reduceMotion]);

  return (
    <motion.dl className={className} initial={false} ref={ref}>
      {children}
    </motion.dl>
  );
}

type SequenceStep = {
  connector?: string;
  duration: number;
  node?: string;
};

const heroSequence: SequenceStep[] = [
  { node: "human", duration: 1_800 },
  { node: "human", connector: "human-agent", duration: 460 },
  { node: "agent", duration: 1_800 },
  { node: "agent", connector: "agent-approval", duration: 460 },
  { node: "approval", duration: 1_800 },
  { node: "approval", connector: "reject", duration: 720 },
  { node: "agent", duration: 1_800 },
  { node: "agent", connector: "agent-approval", duration: 460 },
  { node: "approval", duration: 1_800 },
  { node: "approval", connector: "yes", duration: 520 },
  { node: "outcome", duration: 1_800 },
];

const workflowSequence: SequenceStep[] = [
  { node: "intent", duration: 1_800 },
  { node: "intent", connector: "intent-context", duration: 460 },
  { node: "context", duration: 1_800 },
  { node: "context", connector: "context-build", duration: 460 },
  { node: "build", duration: 1_800 },
  { node: "build", connector: "build-evidence", duration: 460 },
  { node: "evidence", duration: 1_800 },
  { node: "evidence", connector: "checks-return", duration: 720 },
  { node: "build", duration: 1_800 },
  { node: "build", connector: "build-evidence", duration: 460 },
  { node: "evidence", duration: 1_800 },
  { node: "evidence", connector: "evidence-approve", duration: 460 },
  { node: "approve", duration: 1_800 },
  { node: "approve", connector: "human-return", duration: 860 },
  { node: "context", duration: 1_800 },
  { node: "context", connector: "context-build", duration: 460 },
  { node: "build", duration: 1_800 },
  { node: "build", connector: "build-evidence", duration: 460 },
  { node: "evidence", duration: 1_800 },
  { node: "evidence", connector: "evidence-approve", duration: 460 },
  { node: "approve", duration: 1_800 },
];

function wait(duration: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, duration));
}

function stopAnimations(animations: Array<{ stop: () => void }>) {
  animations.splice(0).forEach((animation) => animation.stop());
}

type BeamEdge = "bottom" | "left" | "right" | "top";

function getBeamPosition(
  edge: BeamEdge,
  width: number,
  height: number,
) {
  const perimeter = (width + height) * 2;
  const positions: Record<BeamEdge, number> = {
    top: width / 2,
    right: width + height / 2,
    bottom: width + height + width / 2,
    left: width * 2 + height + height / 2,
  };

  return (positions[edge] / perimeter) * 100;
}

function setStaticDiagram(selector: string) {
  document.querySelectorAll<HTMLElement>(selector).forEach((diagram) => {
    delete diagram.dataset.motionRunning;
    diagram.querySelectorAll<HTMLElement>("[data-motion-node]").forEach((node) => {
      delete node.dataset.motionActive;
      node.style.removeProperty("opacity");
      node.style.removeProperty("transform");
    });
    diagram
      .querySelectorAll<SVGRectElement>("[data-motion-node-beam] rect")
      .forEach((beam) => {
        beam.style.removeProperty("opacity");
        beam.style.removeProperty("stroke-dashoffset");
      });
    diagram
      .querySelectorAll<HTMLElement>("[data-motion-connector]")
      .forEach((connector) => {
        connector.style.removeProperty("opacity");
      });
    diagram.querySelectorAll<SVGPathElement>("[data-motion-connector] path").forEach((path) => {
      path.style.removeProperty("opacity");
      path.style.removeProperty("stroke-dasharray");
      path.style.removeProperty("stroke-dashoffset");
    });
  });
}

function animateDiagramStep(
  selector: string,
  step: SequenceStep,
  animations: Array<{ stop: () => void }>,
) {
  stopAnimations(animations);

  document.querySelectorAll<HTMLElement>(selector).forEach((diagram) => {
    diagram.dataset.motionRunning = "true";

    diagram.querySelectorAll<HTMLElement>("[data-motion-node]").forEach((node) => {
      const active = node.dataset.motionNode === step.node;
      node.dataset.motionActive = active ? "true" : "false";
    });

    if (step.node && !step.connector) {
      const activeNode = diagram.querySelector<HTMLElement>(
        `[data-motion-node="${step.node}"]`,
      );
      const beamSvg = activeNode?.querySelector<SVGSVGElement>(
        "[data-motion-node-beam]",
      );
      const beam = beamSvg?.querySelector<SVGRectElement>("rect");

      if (activeNode && beam && beamSvg) {
        const bounds = activeNode.getBoundingClientRect();
        const fromEdge = (beamSvg.dataset.motionNodeBeamFrom ?? "left") as BeamEdge;
        const toEdge = (beamSvg.dataset.motionNodeBeamTo ?? "right") as BeamEdge;
        const start = getBeamPosition(fromEdge, bounds.width, bounds.height);
        const end = getBeamPosition(toEdge, bounds.width, bounds.height);
        const distanceToExit = (end - start + 100) % 100;
        const from = -start;
        const to = -(start + 100 + distanceToExit);
        const controls = animate(
          beam,
          {
            opacity: [0, 1, 1, 0],
            strokeDashoffset: [from, to],
          },
          {
            duration: Math.max(1.2, (step.duration / 1000) * 0.96),
            ease: "linear",
            times: [0, 0.06, 0.94, 1],
          },
        );
        animations.push(controls);
      }
    }

    diagram
      .querySelectorAll<HTMLElement>("[data-motion-connector]")
      .forEach((connector) => {
        const active = connector.dataset.motionConnector === step.connector;
        connector.style.opacity = connector.hasAttribute("data-motion-label")
          ? "1"
          : active
            ? "1"
            : "0.2";
        connector.dataset.motionActive = active ? "true" : "false";
      });

    if (step.connector) {
      diagram
        .querySelectorAll<SVGPathElement>(
          `[data-motion-connector="${step.connector}"] path`,
        )
        .forEach((path) => {
          const controls = animate(
            path,
            { opacity: [0.3, 1], pathLength: [0, 1], pathOffset: [0.08, 0] },
            {
              duration: motionTokens.duration.trace,
              ease: motionTokens.ease,
            },
          );
          animations.push(controls);
        });
    }

    const live = diagram.querySelector<HTMLElement>("[data-motion-live]");
    const liveNode = diagram.dataset.motionSequence === "hero-approval" ? "agent" : "build";

    if (live) {
      live.style.opacity = "1";
      if (step.node === liveNode) {
        const controls = animate(
          live,
          { opacity: [1, 0.28, 1] },
          { duration: 0.72, ease: "easeInOut", repeat: Infinity },
        );
        animations.push(controls);
      }
    }
  });
}

function useDiagramSequence({
  replayDelay,
  selector,
  steps,
}: {
  replayDelay: number;
  selector: string;
  steps: SequenceStep[];
}) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const diagrams = Array.from(document.querySelectorAll<HTMLElement>(selector));

    if (diagrams.length === 0 || reduceMotion) {
      setStaticDiagram(selector);
      return;
    }

    let disposed = false;
    let visible = false;
    let running = false;
    let lastCompletedAt = 0;
    const animations: Array<{ stop: () => void }> = [];

    const play = async () => {
      if (running || disposed || !visible) {
        return;
      }

      running = true;
      const remainingDelay = Math.max(0, lastCompletedAt + replayDelay - Date.now());

      if (remainingDelay > 0) {
        await wait(remainingDelay);
      }

      if (disposed || !visible) {
        running = false;
        return;
      }

      for (const step of steps) {
        if (disposed || !visible) {
          break;
        }
        animateDiagramStep(selector, step, animations);
        await wait(step.duration);
      }

      stopAnimations(animations);
      setStaticDiagram(selector);
      lastCompletedAt = Date.now();
      running = false;

      if (!disposed && visible) {
        void play();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible) {
          void play();
        }
      },
      { threshold: 0.3 },
    );

    diagrams.forEach((diagram) => observer.observe(diagram));

    return () => {
      disposed = true;
      observer.disconnect();
      stopAnimations(animations);
      setStaticDiagram(selector);
    };
  }, [reduceMotion, replayDelay, selector, steps]);
}

export function HeroSequenceController() {
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reduceMotion) {
      return;
    }

    const diagrams = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-motion-sequence="hero-approval"]',
      ),
    );
    const controls = animate(
      diagrams,
      { y: [motionTokens.distance, 0] },
      {
        delay: 0.32,
        duration: motionTokens.duration.reveal,
        ease: motionTokens.ease,
      },
    );

    return () => controls.stop();
  }, [reduceMotion]);

  useDiagramSequence({
    replayDelay: 10_000,
    selector: '[data-motion-sequence="hero-approval"]',
    steps: heroSequence,
  });
  return null;
}

export function WorkflowSequenceController() {
  useDiagramSequence({
    replayDelay: 12_000,
    selector: '[data-motion-sequence="delivery-workflow"]',
    steps: workflowSequence,
  });
  return null;
}
