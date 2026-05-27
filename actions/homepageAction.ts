"use server";

import db from "@/db/drizzle";
import { homepageSections } from "@/db/schema";
import { defaultHomepageCmsContent } from "@/data/homepageCmsDefaults";
import type { HomepageCmsContent, HomepageFaqCtaContent } from "@/types/homepage";
import { eq } from "drizzle-orm";

const HOME_SECTION_KEY = "home";

function mergeHomepageContent(
  value: Record<string, unknown> | null | undefined,
): HomepageCmsContent {
  const content = (value || {}) as Partial<HomepageCmsContent>;
  const faqCta = (content.faqCta || {}) as Partial<HomepageFaqCtaContent>;

  return {
    ...defaultHomepageCmsContent,
    ...content,
    buildForIndia: Array.isArray(content.buildForIndia)
      ? content.buildForIndia
      : defaultHomepageCmsContent.buildForIndia,
    awards: Array.isArray(content.awards)
      ? content.awards
      : defaultHomepageCmsContent.awards,
    certificates: Array.isArray(content.certificates)
      ? content.certificates
      : defaultHomepageCmsContent.certificates,
    media: Array.isArray(content.media)
      ? content.media
      : defaultHomepageCmsContent.media,
    testimonials: Array.isArray(content.testimonials)
      ? content.testimonials
      : defaultHomepageCmsContent.testimonials,
    clients: Array.isArray(content.clients)
      ? content.clients
      : defaultHomepageCmsContent.clients,
    faqCta: {
      ...defaultHomepageCmsContent.faqCta,
      ...faqCta,
      faqs: Array.isArray(faqCta.faqs)
        ? faqCta.faqs
        : defaultHomepageCmsContent.faqCta.faqs,
    },
  };
}

export async function getHomepageCmsContent(): Promise<HomepageCmsContent> {
  try {
    const [row] = await db
      .select()
      .from(homepageSections)
      .where(eq(homepageSections.sectionKey, HOME_SECTION_KEY))
      .limit(1);

    if (!row?.active) return defaultHomepageCmsContent;

    return mergeHomepageContent(row.content);
  } catch (error) {
    console.error("Error fetching homepage CMS content:", error);
    return defaultHomepageCmsContent;
  }
}
