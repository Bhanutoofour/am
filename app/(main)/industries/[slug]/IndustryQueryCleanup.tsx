"use client";

import { useEffect, useRef } from "react";

export default function IndustryQueryCleanup() {
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
