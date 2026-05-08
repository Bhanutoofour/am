"use client";
import React from "react";
import styles from "./faqStyles.module.scss";
import FaqSection from "@/component/sections/faqSection/FaqSection";
import useWindowSize from "@/hooks/useWindowSize";
import { SCREENS } from "@/constants";
import ResponsiveFaq from "@/component/sections/responsiveFaq/ResponsiveFaq";

export default function FaqClient() {
  const { width } = useWindowSize();

  return (
    <div className={styles.faqContainer}>
      <div className={styles.faqHeader}>
        <h1 className={styles.faqHeading}>Frequently Asked Questions</h1>
        <p className={styles.faqHeadingDetails}>
          Find quick answers to common questions about Autocracy
        </p>
      </div>
      {width && width > SCREENS.MOBILE_LANDSCAPE ? (
        <FaqSection />
      ) : (
        <ResponsiveFaq />
      )}
    </div>
  );
}
