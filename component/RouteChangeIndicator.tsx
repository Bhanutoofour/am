"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import styles from "./RouteChangeIndicator.module.scss";

const MAX_WAIT_MS = 8000;

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

export default function RouteChangeIndicator() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsNavigating(false);
  }, [pathname]);

  useEffect(() => {
    const finishNavigation = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsNavigating(false);
    };

    const startNavigation = () => {
      setIsNavigating(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(finishNavigation, MAX_WAIT_MS);
    };

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || isModifiedClick(event)) {
        return;
      }

      const target = event.target as Element | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;

      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);

      if (url.origin !== window.location.origin) {
        return;
      }

      const currentPath = `${window.location.pathname}${window.location.search}`;
      const nextPath = `${url.pathname}${url.search}`;

      if (nextPath === currentPath) {
        return;
      }

      startNavigation();
    };

    document.addEventListener("click", handleClick, true);
    window.addEventListener("pageshow", finishNavigation);
    window.addEventListener("popstate", finishNavigation);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("pageshow", finishNavigation);
      window.removeEventListener("popstate", finishNavigation);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`${styles.routeIndicator} ${
        isNavigating ? styles.visible : ""
      }`}
      aria-hidden={!isNavigating}
    >
      <div className={styles.track}>
        <span className={styles.bar} />
      </div>
      <span className={styles.dot} />
    </div>
  );
}
