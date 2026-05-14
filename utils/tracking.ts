"use client";

type TrackingPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: TrackingPayload[];
    gtag?: (...args: unknown[]) => void;
    gtag_report_conversion?: (url?: string) => boolean;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: string, payload: TrackingPayload = {}) {
  if (typeof window === "undefined") return;

  const eventPayload = {
    event,
    ...payload,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventPayload);

  if (typeof window.gtag === "function") {
    window.gtag("event", event, payload);
  }
}

export function trackLeadSubmission(payload: TrackingPayload = {}) {
  trackEvent("generate_lead", payload);
  trackEvent("form_submit", payload);

  if (typeof window !== "undefined") {
    if (typeof window.gtag_report_conversion === "function") {
      window.gtag_report_conversion();
    }

    if (typeof window.fbq === "function") {
      window.fbq("track", "Lead", payload);
    }
  }
}
