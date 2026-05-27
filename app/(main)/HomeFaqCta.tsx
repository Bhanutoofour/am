"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./homeFaqCta.module.scss";
import { INDUSTRY } from "@/constants/Images/images";
import { submitContactForm } from "@/utils/zohoCRM";
import FaqAccordion from "@/component/sections/faqAccordion/FaqAccordion";
import { defaultHomepageCmsContent } from "@/data/homepageCmsDefaults";
import type { HomepageFaqCtaContent } from "@/types/homepage";

export default function HomeFaqCta({
  content = defaultHomepageCmsContent.faqCta,
}: {
  content?: HomepageFaqCtaContent;
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    industry: "",
    location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.industry ||
      !formData.location
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await submitContactForm({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        industry: formData.industry,
        state: formData.location,
        webLeadType: "Project Support",
        enquiryType: "Machine Selection",
      });

      if (success) {
        setIsSubmitted(true);
        setFormData({
          name: "",
          phone: "",
          email: "",
          industry: "",
          location: "",
        });
      } else {
        alert("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting project support form:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.homeFaqCta}>
      <script
        id="home-faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className={styles.faqHeader}>
        <p className={styles.eyebrow}>{content.faqEyebrow}</p>
        <h2>{content.faqTitle}</h2>
        <p>{content.faqIntro}</p>
      </div>
      <div className={styles.faqGrid}>
        {[
          content.faqs.slice(0, Math.ceil(content.faqs.length / 2)),
          content.faqs.slice(Math.ceil(content.faqs.length / 2)),
        ].map(
          (column, columnIndex) => (
            <div
              key={`home-faq-column-${columnIndex}`}
              className={styles.faqColumn}
            >
              <FaqAccordion items={column} />
            </div>
          )
        )}
      </div>
      <div className={styles.ctaSection}>
        <div className={styles.ctaImageContainer}>
          <Image
            src={content.ctaImage || INDUSTRY.SAMPLE_INDUSTRY}
            alt={content.ctaImageAltText || "Autocracy machinery"}
            width={760}
            height={520}
            className={styles.ctaImage}
          />
        </div>
        <div className={styles.ctaFormContainer}>
          <p className={styles.eyebrow}>{content.ctaEyebrow}</p>
          <h2>{content.ctaTitle}</h2>
          <p>{content.ctaIntro}</p>
          {isSubmitted ? (
            <div className={styles.ctaSuccess}>
              <h3>Thank you!</h3>
              <p>We received your details and will get back to you shortly.</p>
              <button type="button" onClick={() => setIsSubmitted(false)}>
                Submit another request
              </button>
            </div>
          ) : (
            <form className={styles.ctaForm} onSubmit={handleSubmit}>
              <label>
                <span>Name *</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) =>
                    handleInputChange("name", event.target.value)
                  }
                  placeholder="Type here"
                  required
                />
              </label>
              <label>
                <span>Phone number *</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) =>
                    handleInputChange("phone", event.target.value)
                  }
                  placeholder="Type here"
                  required
                />
              </label>
              <label>
                <span>Email *</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    handleInputChange("email", event.target.value)
                  }
                  placeholder="Type here"
                  required
                />
              </label>
              <label>
                <span>Industry *</span>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(event) =>
                    handleInputChange("industry", event.target.value)
                  }
                  placeholder="Type here"
                  required
                />
              </label>
              <label>
                <span>Location *</span>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(event) =>
                    handleInputChange("location", event.target.value)
                  }
                  placeholder="Type here"
                  required
                />
              </label>
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.name ||
                  !formData.phone ||
                  !formData.email ||
                  !formData.industry ||
                  !formData.location
                }
              >
                {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
