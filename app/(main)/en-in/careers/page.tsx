import CareersClient from "@/app/(main)/careers/CareersClient";
import type { Metadata } from "next";
import { indiaCanonical, rootCanonical } from "@/utils/locale";

export const metadata: Metadata = {
  title: "Careers | Autocracy Machinery India",
  description:
    "Explore career opportunities with Autocracy Machinery in India across manufacturing, engineering, sales, service, and operations.",
  alternates: {
    canonical: indiaCanonical("/careers"),
    languages: {
      "en-IN": indiaCanonical("/careers"),
      "x-default": rootCanonical("/careers"),
    },
  },
};

export default function IndiaCareersPage() {
  return <CareersClient />;
}
