import React, { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey:              string;
          theme?:               "light" | "dark" | "auto";
          callback:             (token: string) => void;
          "error-callback"?:   () => void;
          "expired-callback"?: () => void;
        }
      ) => string;
      reset:  (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITEKEY as string;

function waitForTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  return new Promise((resolve) => {
    const iv = setInterval(() => {
      if (window.turnstile) { clearInterval(iv); resolve(); }
    }, 50);
    setTimeout(() => clearInterval(iv), 15_000);
  });
}

export function useTurnstile(): {
  getToken:   () => Promise<string | null>;
  reset:      () => void;
  WidgetSlot: () => React.ReactElement;
  ready:      boolean;
} {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef  = useRef<string | null>(null);
  const tokenRef     = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  const mountWidget = useCallback(() => {
    if (!containerRef.current || !window.turnstile || widgetIdRef.current) return;

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      theme:   "dark",
      callback: (token: string) => {
        tokenRef.current = token;
      },
      "error-callback": () => {
        tokenRef.current = null;
      },
      "expired-callback": () => {
        tokenRef.current = null;
        // Auto-reset to get a fresh token immediately
        if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
      },
    });

    setReady(true);
  }, []);

  useEffect(() => {
    waitForTurnstile().then(() => mountWidget());
  }, [mountWidget]);

  const handleSlotRef = useCallback(
    (el: HTMLDivElement | null) => {
      containerRef.current = el;
      if (el && window.turnstile && !widgetIdRef.current) {
        mountWidget();
      } else if (!el && widgetIdRef.current) {
        // Container unmounted — clean up so remount works correctly
        window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = null;
        tokenRef.current    = null;
      }
    },
    [mountWidget],
  );

  // Poll for the token — managed mode issues it automatically after mount.
  // Returns it once available, or null after 10s.
  const getToken = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      // Already have it
      if (tokenRef.current) {
        resolve(tokenRef.current);
        // Don't clear — worker validates it, token remains valid until used server-side
        return;
      }

      // Not ready yet — poll for up to 10s
      let elapsed = 0;
      const iv = setInterval(() => {
        elapsed += 100;
        if (tokenRef.current) {
          clearInterval(iv);
          resolve(tokenRef.current);
          return;
        }
        if (elapsed >= 10_000) {
          clearInterval(iv);
          resolve(null);
        }
      }, 100);

      // If widget isn't mounted yet, kick it off
      if (!widgetIdRef.current) {
        waitForTurnstile().then(() => mountWidget());
      }
    });
  }, [mountWidget]);

  const reset = useCallback(() => {
    tokenRef.current = null;
    if (window.turnstile && widgetIdRef.current) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, []);

  function WidgetSlot(): React.ReactElement {
    return React.createElement("div", {
      ref:   handleSlotRef,
      style: {
        position:      "absolute",
        width:         "1px",
        height:        "1px",
        overflow:      "hidden",
        opacity:       0,
        pointerEvents: "none",
      } as React.CSSProperties,
      "aria-hidden": "true",
    });
  }

  return { getToken, reset, WidgetSlot, ready };
}