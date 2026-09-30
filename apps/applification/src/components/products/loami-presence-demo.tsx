"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import type { Rive } from "@rive-app/canvas-lite";

const states = ["idle", "listening", "thinking", "speaking"] as const;
const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

export function LoamiPresenceDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const riveRef = useRef<Rive | null>(null);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<(typeof states)[number]>("idle");
  const [playing, setPlaying] = useState(true);
  const reducedMotion = useReducedMotion();
  const paused = !playing || reducedMotion === true;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let instance: Rive | undefined;
    const resize = () =>
      instance?.resizeDrawingSurfaceToCanvas(
        Math.max(window.devicePixelRatio || 1, 2),
      );
    const observer = new ResizeObserver(resize);

    void import("@rive-app/canvas-lite")
      .then(({ Rive, Layout, Fit, Alignment }) => {
        if (disposed) return;
        instance = new Rive({
          src: "/images/loami/loami-presence.riv",
          canvas,
          autoplay: true,
          autoBind: true,
          stateMachine: "Presence",
          layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
          onLoad: () => {
            if (disposed || !instance) return;
            resize();
            riveRef.current = instance;
            setReady(true);
          },
          onLoadError: () => {
            if (!disposed) setReady(false);
          },
        });
        observer.observe(canvas);
      })
      .catch(() => {
        if (!disposed) setReady(false);
      });

    return () => {
      disposed = true;
      observer.disconnect();
      riveRef.current = null;
      instance?.cleanup();
    };
  }, []);

  useEffect(() => {
    const model = riveRef.current?.viewModelInstance;
    if (!ready || !model) return;
    const pose = model.enum("state");
    if (pose) pose.value = state;
    const reduced = model.boolean("reducedMotion");
    if (reduced) reduced.value = paused;
    const level = model.number("level");
    if (level)
      level.value = state === "listening" || state === "speaking" ? 60 : 0;
  }, [ready, state, paused]);

  useEffect(() => {
    if (!ready || paused) return;
    const timer = window.setInterval(() => {
      setState(
        (current) => states[(states.indexOf(current) + 1) % states.length],
      );
    }, 4000);
    return () => window.clearInterval(timer);
  }, [ready, paused]);

  return (
    <figure>
      <div className="flex items-center justify-center gap-5">
        <div
          role="img"
          aria-label={`Loami ${state}`}
          className="relative size-40 shrink-0 sm:size-48"
          data-animation-ready={ready}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/loami/loami-3d-hello.png"
            alt=""
            width={320}
            height={320}
            className={`absolute inset-0 size-full object-contain ${ready ? "invisible" : ""}`}
          />
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={`absolute inset-0 size-full ${ready ? "" : "invisible"}`}
          />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/loami/loami-wordmark-light.svg"
          alt="Loami"
          width={680}
          height={263}
          className="w-36 max-w-[45%] sm:w-44"
        />
      </div>
      <div
        className="mt-4 flex flex-wrap items-center justify-center gap-1"
        role="group"
        aria-label="Loami animation states"
      >
        {states.map((value) => (
          <button
            key={value[0].toUpperCase() + value.slice(1)}
            type="button"
            aria-pressed={state === value}
            onClick={() => {
              setState(value);
              setPlaying(false);
            }}
            className={`min-h-11 rounded-lg px-3 text-xs font-semibold capitalize ${state === value ? "bg-[var(--app-card)] text-[var(--app-text-primary)]" : "text-[var(--app-text-secondary)] hover:bg-[var(--app-card)]"} ${focus}`}
          >
            {value[0].toUpperCase() + value.slice(1)}
          </button>
        ))}
        {!reducedMotion && (
          <button
            type="button"
            onClick={() => setPlaying((current) => !current)}
            aria-label={
              playing ? "Pause Loami animation" : "Play Loami animation"
            }
            className={`inline-flex size-11 items-center justify-center rounded-lg text-[var(--app-text-primary)] hover:bg-[var(--app-card)] ${focus}`}
          >
            {playing ? (
              <Pause aria-hidden="true" size={16} />
            ) : (
              <Play aria-hidden="true" size={16} />
            )}
          </button>
        )}
      </div>
      <figcaption className="mt-2 text-center text-xs text-[var(--app-text-secondary)]">
        Loami’s animated presence. A preview of its four states.
      </figcaption>
    </figure>
  );
}
