"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { type AnchorHTMLAttributes, type ReactNode } from "react";
import { withLocalePrefix } from "@/utils/locale";

type LocalizedLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
  };

export default function LocalizedLink({
  href,
  children,
  ...props
}: LocalizedLinkProps) {
  const pathname = usePathname();
  const localizedHref =
    typeof href === "string" ? withLocalePrefix(href, pathname) : href;

  return (
    <Link href={localizedHref} {...props}>
      {children}
    </Link>
  );
}
