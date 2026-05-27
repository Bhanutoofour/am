"use client";

import { useId, useState } from "react";
import styles from "./faqAccordion.module.scss";

export type FaqAccordionItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqAccordionItem[];
  defaultOpenIndex?: number | null;
  className?: string;
};

const HTML_PATTERN = /<\/?[a-z][\s\S]*>/i;

function FaqAnswer({ answer }: { answer: string }) {
  if (HTML_PATTERN.test(answer)) {
    return <div dangerouslySetInnerHTML={{ __html: answer }} />;
  }

  return <>{answer}</>;
}

export default function FaqAccordion({
  items,
  defaultOpenIndex = null,
  className = "",
}: FaqAccordionProps) {
  const faqItems = Array.isArray(items) ? items : [];
  const baseId = useId();
  const [openIndexes, setOpenIndexes] = useState<number[]>(
    typeof defaultOpenIndex === "number" ? [defaultOpenIndex] : []
  );

  const toggleItem = (index: number) => {
    setOpenIndexes((current) =>
      current.includes(index)
        ? current.filter((openIndex) => openIndex !== index)
        : [...current, index]
    );
  };

  return (
    <div className={`${styles.faqAccordion} ${className}`.trim()}>
      {faqItems.map((item, index) => {
        const isOpen = openIndexes.includes(index);
        const answerId = `${baseId}-answer-${index}`;

        return (
          <article
            key={`${item.question}-${index}`}
            className={styles.faqItem}
            data-open={isOpen}
          >
            <button
              type="button"
              className={styles.faqQuestion}
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() => toggleItem(index)}
            >
              <span>{item.question}</span>
              <span className={styles.faqIcon} aria-hidden="true" />
            </button>
            {isOpen && (
              <div id={answerId} className={styles.faqAnswer}>
                <FaqAnswer answer={item.answer} />
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
