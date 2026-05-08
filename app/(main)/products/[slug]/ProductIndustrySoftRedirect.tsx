"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/** Same destination as old server `redirect()`, without a full HTTP reload. */
export default function ProductIndustrySoftRedirect({
  href,
}: {
  href: string | null;
}) {
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (!href || ran.current) return;
    ran.current = true;
    router.replace(href);
  }, [href, router]);

  return null;
}
