"use client";

import { useEffect, useRef } from "react";

/**
 * Strips query string from model URLs without a full document reload.
 */
export default function ModelQueryCleanup() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current || typeof window === "undefined") return;
    if (!window.location.search) return;
    ran.current = true;
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname
    );
  }, []);

  return null;
}
