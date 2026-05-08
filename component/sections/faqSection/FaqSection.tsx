"use client";
import React, { useState } from "react";
import styles from "./faqSection.module.scss";
import { FAQs } from "@/data/qnaForFaq";
import Image from "next/image";
import { ICONS } from "@/constants/Images/images";

type Question = {
  question: string;
  answer: string;
};

type FAQCategory = {
  title: string;
  faqs: Question[];
};

const FaqSection = () => {
  const [activeSection, setActiveSection] = useState(FAQs[0]);
  const [openMap, setOpenMap] = useState<Record<string, number[]>>(() =>
    FAQs.reduce((acc, cat) => {
      acc[cat.title] = [0]; // first question open by default
      return acc;
    }, {} as Record<string, number[]>)
  );

  const toggleQuestion = (catTitle: string, idx: number) => {
    setOpenMap((prev) => {
      const current = prev[catTitle] || [];
      if (current.includes(idx)) {
        return { ...prev, [catTitle]: current.filter((i) => i !== idx) };
      }
      return { ...prev, [catTitle]: [...current, idx] };
    });
  };

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
            {cat.faqs.map((q, idx) => (
              <div
                key={q.question}
                className={styles.qnaItem}
                onClick={() => toggleQuestion(cat.title, idx)}
              >
                <div className={styles.qnaQuestion}>
                  <span>{q.question}</span>
                  <Image
                    src={ICONS.BLACK_DROPDOWN}
                    alt="up&down arrow"
                    width={14}
                    height={14}
                    style={{
                      transform: `${
                        openMap[cat.title]?.includes(idx)
                          ? "rotate(180deg)"
                          : "rotate(0deg)"
                      }`,
                      transition: "transform 0.3s ease",
                    }}
                  />
                </div>
                {openMap[cat.title]?.includes(idx) && (
                  <div className={styles.qnaAnswer}>{q.answer}</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqSection;
