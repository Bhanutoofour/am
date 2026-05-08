"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./breadcrumbs.module.scss";

const SITE_URL = "https://autocracymachinery.com";

const LABELS: Record<string, string> = {
  "about-us": "About Us",
  blog: "Blog",
  brochure: "Brochure",
  careers: "Careers",
  "contact-us": "Contact Us",
  "en-in": "India",
  faqs: "FAQs",
  "find-a-dealer": "Find a Dealer",
  "hire-rental-industry-equipment": "Hire Rental Industry Equipment",
  industries: "Industries",
  "privacy-policy": "Privacy Policy",
  product: "Product",
  products: "Products",
  "terms-and-conditions": "Terms and Conditions",
  videos: "Videos",
};

function formatSegment(segment: string) {
  const decoded = decodeURIComponent(segment);
  return (
    LABELS[decoded] ||
    decoded
      .split("-")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (!pathname || pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  if (!segments.length || segments[0] === "admin") return null;

  const items = [
    { label: "Home", href: "/" },
    ...segments.map((segment, index) => ({
      label: formatSegment(segment),
      href: `/${segments.slice(0, index + 1).join("/")}`,
    })),
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href}>
              {isLast ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
