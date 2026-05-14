"use client";

import { useEffect } from "react";
import { trackEvent } from "@/utils/tracking";

function buttonText(element: Element) {
  return (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80);
}

export default function TrackingEvents() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;

      const link = target.closest("a[href]") as HTMLAnchorElement | null;
      if (link) {
        const href = link.getAttribute("href") || "";
        const label = buttonText(link);

        if (href.startsWith("tel:")) {
          trackEvent("phone_click", {
            link_url: href,
            link_text: label,
          });
          return;
        }

        if (href.includes("wa.me") || href.includes("whatsapp")) {
          trackEvent("whatsapp_click", {
            link_url: href,
            link_text: label,
          });
          return;
        }

        if (href.includes("/brochure")) {
          trackEvent("brochure_link_click", {
            link_url: href,
            link_text: label,
          });
          return;
        }

        if (href.includes("/find-a-dealer")) {
          trackEvent("find_dealer_click", {
            link_url: href,
            link_text: label,
          });
        }
      }

      const button = target.closest("button") as HTMLButtonElement | null;
      if (!button) return;

      const label = buttonText(button).toLowerCase();
      if (label.includes("get a quote") || label.includes("get quote")) {
        trackEvent("quote_button_click", {
          button_text: buttonText(button),
        });
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
