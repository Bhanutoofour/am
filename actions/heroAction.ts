"use server";

import db from "@/db/drizzle";
import { heroSection } from "@/db/schema";
import { revalidatePath } from "next/cache";

// GET all hero section entries
export const getHeroSections = async (): Promise<HeroSection[]> => {
  try {
    const result = await db.select().from(heroSection).orderBy(heroSection.id);
    return result;
  } catch (error) {
    console.error("Error fetching hero sections:", error);
    throw error;
  }
};

// Revalidate the home page when hero data changes
export const revalidateHeroData = async () => {
  // Force Next.js to revalidate homepage
  revalidatePath("/");

  console.log("🔄 Hero page revalidated");
};
