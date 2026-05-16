"use client";
import React, { useState } from "react";
import styles from "./faqSection.module.scss";
import { FAQs } from "@/data/qnaForFaq";
import FaqAccordion from "@/component/sections/faqAccordion/FaqAccordion";

const FaqSection = () => {
  const [activeSection, setActiveSection] = useState(FAQs[0]);

  return (
    <div className={styles.faqSectionHolder}>
      {/* Left Sidebar */}
      <div className={styles.sectionHolder}>
        {FAQs.map((o) => (
          <a
            key={o.title}
            href={`#${o.title.replace(/\s+/g, "-")}`} // convert title to id-friendly string
            onClick={() => setActiveSection(o)}
            className={styles.rightSectionElement}
            style={{
              cursor: "pointer",
              fontWeight: `${activeSection.title === o.title ? "600" : "500"}`,
              color: `${
                activeSection.title === o.title ? "#0a0a0b" : "#0a0a0b8e"
              }`,
            }}
          >
            {o.title}
          </a>
        ))}
      </div>

      {/* Right QnA Accordion (all categories stacked) */}
      <div className={styles.qnaHolder}>
        {FAQs.map((cat) => (
          <div
            key={cat.title}
            id={cat.title.replace(/\s+/g, "-")} // anchor target
            className={styles.qnaCategory}
          >
            <h3 className={styles.qnaCategoryTitle}>{cat.title}</h3>
            <FaqAccordion items={cat.faqs} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqSection;
