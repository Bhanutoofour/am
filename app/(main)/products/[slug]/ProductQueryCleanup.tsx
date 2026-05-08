"use client";

import { useEffect, useRef } from "react";

/**
 * Drops legacy `productId` / `industryId` from the URL bar without a full reload
 * (server `redirect()` would trigger a new document navigation).
 */
export default function ProductQueryCleanup() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current || typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    if (!sp.has("productId") && !sp.has("industryId")) return;
    ran.current = true;
    sp.delete("productId");
    sp.delete("industryId");
    const qs = sp.toString();
    const path = window.location.pathname;
    const next = qs ? `${path}?${qs}` : path;
    window.history.replaceState(window.history.state, "", next);
  }, []);

  return null;
}
