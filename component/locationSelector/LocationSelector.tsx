"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { countryCodes } from "@/data/countryCodes";
import styles from "./locationSelector.module.scss";

const STORAGE_KEY = "autocracy-location-confirmed-v1";

const COUNTRY_BY_LOCALE_REGION: Record<string, string> = {
  AE: "United Arab Emirates",
  AU: "Australia",
  CA: "Canada",
  DE: "Germany",
  FR: "France",
  GB: "United Kingdom",
  IN: "India",
  LK: "Sri Lanka",
  NP: "Nepal",
  SG: "Singapore",
  US: "United States",
  ZA: "South Africa",
};

function countryFromBrowser() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timezone === "Asia/Calcutta" || timezone === "Asia/Kolkata") {
    return "India";
  }

  const locale =
    navigator.languages?.find((item) => item.includes("-")) ||
    navigator.language ||
    "";
  const region = locale.split("-").pop()?.toUpperCase() || "";

  return COUNTRY_BY_LOCALE_REGION[region] || "United States";
}

export default function LocationSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [showExportMessage, setShowExportMessage] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const countryOptions = useMemo(
    () =>
      Array.from(new Set(countryCodes.map((country) => country.country))).sort(
        (a, b) => a.localeCompare(b)
      ),
    []
  );

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    if (window.localStorage.getItem(STORAGE_KEY)) return;

    let isMounted = true;

    const detectCountry = async () => {
      try {
        const response = await fetch("/api/location", { cache: "no-store" });
        const data = (await response.json()) as { country?: string };
        const detectedCountry = data.country || countryFromBrowser();

        if (isMounted) {
          setSelectedCountry(
            countryOptions.includes(detectedCountry)
              ? detectedCountry
              : countryFromBrowser()
          );
          setIsVisible(true);
        }
      } catch {
        if (isMounted) {
          setSelectedCountry(countryFromBrowser());
          setIsVisible(true);
        }
      }
    };

    detectCountry();

    return () => {
      isMounted = false;
    };
  }, [countryOptions, pathname]);

  if (!isVisible) return null;

  const isIndiaSelected = selectedCountry === "India";

  const confirmSelection = () => {
    if (isIndiaSelected) {
      window.localStorage.setItem(STORAGE_KEY, selectedCountry);
      setIsVisible(false);
      if (!pathname?.startsWith("/en-in")) {
        router.push("/en-in/");
      }
      return;
    }

    setShowExportMessage(true);
  };

  const continueInternational = () => {
    window.localStorage.setItem(STORAGE_KEY, selectedCountry);
    setIsRedirecting(true);
    window.setTimeout(() => {
      setIsVisible(false);
      if (pathname !== "/") {
        router.push("/");
      } else {
        router.refresh();
      }
    }, 700);
  };

  const cancelSelection = () => {
    window.localStorage.setItem(STORAGE_KEY, selectedCountry);
    setIsVisible(false);
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Please confirm your location</h2>
        </div>

        <div className={styles.content}>
          <label className={styles.label} htmlFor="country-selector">
            Select Country
          </label>
          <div className={styles.selectWrap}>
            <select
              id="country-selector"
              className={styles.select}
              value={selectedCountry}
              onChange={(event) => {
                const country = event.target.value;
                setSelectedCountry(country);
                setShowExportMessage(country !== "India");
              }}
            >
              {countryOptions.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <span className={styles.selectArrow} aria-hidden />
          </div>

          {showExportMessage && !isIndiaSelected && (
            <div className={styles.exportMessage} role="status">
              <p>Great news — we export to {selectedCountry}</p>
              <span className={styles.inlineMessageText}>
                Continue to Global Website
              </span>
            </div>
          )}

          <div className={styles.actions}>
            {isIndiaSelected ? (
              <button
                type="button"
                className={styles.primaryButton}
                onClick={confirmSelection}
              >
                Confirm
              </button>
            ) : (
              <button
                type="button"
                className={styles.primaryButton}
                onClick={continueInternational}
                disabled={isRedirecting}
              >
                {isRedirecting ? "Redirecting..." : "Continue"}
              </button>
            )}
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={cancelSelection}
              >
                Cancel
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
