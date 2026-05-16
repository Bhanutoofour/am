"use client";

import React, { useState } from "react";
import { FAQs } from "@/data/qnaForFaq";
import styles from "./resFaq.module.scss";
import Image from "next/image";
import { ICONS } from "@/constants/Images/images";
import FaqAccordion from "@/component/sections/faqAccordion/FaqAccordion";

type Question = {
  question: string;
  answer: string;
};

type FAQCategory = {
  title: string;
  faqs: Question[];
};

const ResponsiveFaq = () => {
  const [selectedFaq, setSelectedFaq] = useState<FAQCategory | null>(null);

  return (
    <div className={styles.faqWrapper}>
      {!selectedFaq ? (
        <div className={styles.faqSectionHolder}>
          {FAQs.map((o) => (
            <div
              key={o.title}
              onClick={() => setSelectedFaq(o)}
              className={styles.rightSectionElement}
            >
              <p>{o.title}</p>
              <Image
                src={ICONS.BLACK_DROPDOWN}
                alt={o.title}
                width={16}
                height={16}
                style={{ transform: "rotate(-90deg)" }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.qnaWrapper}>
          {/* Back button + title */}
          <div
            className={styles.backHeader}
            onClick={() => setSelectedFaq(null)}
          >
            <Image
              src={ICONS.BLACK_DROPDOWN}
              alt={selectedFaq.title}
              width={16}
              height={16}
              style={{ transform: "rotate(90deg)" }}
            />
            <p>{selectedFaq.title}</p>
          </div>

          <FaqAccordion items={selectedFaq.faqs} />
        </div>
      )}
    </div>
  );
};

export default ResponsiveFaq;
