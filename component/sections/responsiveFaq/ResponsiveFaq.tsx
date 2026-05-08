"use client";

import React, { useState } from "react";
import { FAQs } from "@/data/qnaForFaq";
import styles from "./resFaq.module.scss";
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

const ResponsiveFaq = () => {
  const [selectedFaq, setSelectedFaq] = useState<FAQCategory | null>(null);

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

          {/* Questions */}
          {selectedFaq.faqs.map((q, idx) => (
            <div
              key={q.question}
              className={styles.qnaItem}
              onClick={() => toggleQuestion(selectedFaq.title, idx)}
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
                      openMap[selectedFaq.title]?.includes(idx)
                        ? "rotate(180deg)"
                        : "rotate(0deg)"
                    }`,
                    transition: "transform 0.3s ease",
                  }}
                />
              </div>
              {openMap[selectedFaq.title]?.includes(idx) && (
                <div className={styles.qnaAnswer}>{q.answer}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResponsiveFaq;
