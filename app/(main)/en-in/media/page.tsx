import { Metadata } from "next";
import MediaPage from "@/app/(main)/media/page";
import { indiaCanonical, rootCanonical } from "@/utils/locale";

export const metadata: Metadata = {
  title: "Media | Autocracy Machinery India",
  description:
    "Read India-focused media features, interviews, and coverage about Autocracy Machinery, specialised trenchers, utility attachments, and infrastructure machinery.",
  alternates: {
    canonical: indiaCanonical("/media"),
    languages: {
      "en-IN": indiaCanonical("/media"),
      "x-default": rootCanonical("/media"),
    },
  },
  openGraph: {
    title: "Media | Autocracy Machinery India",
    description:
      "Media features and coverage about Autocracy Machinery and its specialised field machinery in India.",
    url: indiaCanonical("/media"),
    type: "website",
  },
};

export default MediaPage;
