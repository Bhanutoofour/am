"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type AnchorHTMLAttributes, type ReactNode } from "react";
import { withLocalePrefix } from "@/utils/locale";

type LocalizedLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
  };

export default function LocalizedLink({
  href,
  children,
  onFocus,
  onMouseEnter,
  prefetch,
  ...props
}: LocalizedLinkProps) {
  const pathname = usePathname();
  const router = useRouter();
  const localizedHref =
    typeof href === "string" ? withLocalePrefix(href, pathname) : href;
  const canPrefetch =
    typeof localizedHref === "string" && localizedHref.startsWith("/");

  const warmRoute = () => {
    if (canPrefetch) {
      router.prefetch(localizedHref);
    }
  };

  return (
    <Link
      href={localizedHref}
      prefetch={prefetch ?? true}
      onMouseEnter={(event) => {
        warmRoute();
        onMouseEnter?.(event);
      }}
      onFocus={(event) => {
        warmRoute();
        onFocus?.(event);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
