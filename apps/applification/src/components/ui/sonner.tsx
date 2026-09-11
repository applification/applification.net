"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="bottom-right"
      duration={4000}
      offset={{ bottom: "calc(76px + env(safe-area-inset-bottom))", right: 24 }}
      mobileOffset={{ bottom: "calc(76px + env(safe-area-inset-bottom))", left: 16, right: 16 }}
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          // Follow the site's CSS-selected Human or Agent palette directly.
          fontFamily: "inherit",
          "--normal-bg": "var(--app-card)",
          "--normal-text": "var(--app-text-primary)",
          "--normal-border": "var(--app-border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
          description: "text-[var(--app-text-secondary)]!",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
