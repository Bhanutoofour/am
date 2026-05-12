"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./homeFaqCta.module.scss";
import { INDUSTRY } from "@/constants/Images/images";
import { submitContactForm } from "@/utils/zohoCRM";

const homeFaqs = [
  {
    question: "What does Autocracy Machinery manufacture?",
    answer:
      "Autocracy Machinery manufactures trencher machines, tractor attachments, solar EPC equipment, aquatic weed harvesters, pontoons, forklifts, and utility machinery for infrastructure and field projects.",
  },
  {
    question: "Which Autocracy Machinery equipment is used for OFC cable laying?",
    answer:
      "Chain trenchers, rock wheel trenchers, and compact trenching machines are used for OFC cable laying, telecom ducts, underground utilities, irrigation pipelines, and solar cable routes.",
  },
  {
    question: "Can Autocracy Machinery help select the right model?",
    answer:
      "Yes. Share your application, soil type, trench width, trench depth, route length, tractor or carrier details, and productivity target for model guidance.",
  },
  {
    question: "Where can I compare Autocracy Machinery products by industry?",
    answer:
      "Use the industries page to compare machines for telecom, water management, solar, agriculture, construction, and more.",
  },
  {
    question: "Do you offer machines for water management?",
    answer:
      "Yes. Autocracy offers aquatic weed harvesters, floating trash collectors, pontoons, lake cleaning machines, and related water body cleaning equipment.",
  },
  {
    question: "Can I request brochures before buying?",
    answer:
      "Yes. Product and model brochures can be requested from the brochure page or relevant product pages.",
  },
  {
    question: "Are machines available for agriculture applications?",
    answer:
      "Yes. Autocracy machines support farm trenching, drip irrigation pipelines, drainage work, landscaping, sod harvesting, sprigging, and other agriculture workflows.",
  },
  {
    question: "Can products be matched to project conditions?",
    answer:
      "Yes. The team can review location, terrain, soil, depth, productivity, and machine-fit requirements.",
  },
  {
    question: "How do I get pricing or a quote?",
    answer:
      "Submit your contact details and project requirements, and the Autocracy team will follow up with guidance.",
  },
  {
    question: "Does Autocracy support multiple industries?",
    answer:
      "Yes. Machines are used across telecom, water, solar, agriculture, defence, construction, and environmental projects.",
  },
];

export default function HomeFaqCta() {
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
    mainEntity: homeFaqs.map((faq) => ({
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
        <p className={styles.eyebrow}>FAQs</p>
        <h2>Autocracy Machinery Questions</h2>
        <p>
          Quick answers for buyers comparing trencher machines, solar EPC
          equipment, water body cleaning machines, agriculture attachments, and
          model options for real field applications.
        </p>
      </div>
      <div className={styles.faqGrid}>
        {[homeFaqs.slice(0, 5), homeFaqs.slice(5, 10)].map(
          (column, columnIndex) => (
            <div
              key={`home-faq-column-${columnIndex}`}
              className={styles.faqColumn}
            >
              {column.map((faq) => (
                <article key={faq.question} className={styles.faqCard}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </article>
              ))}
            </div>
          )
        )}
      </div>
      <div className={styles.ctaSection}>
        <div className={styles.ctaImageContainer}>
          <Image
            src={INDUSTRY.SAMPLE_INDUSTRY}
            alt="Autocracy machinery"
            width={760}
            height={520}
            className={styles.ctaImage}
          />
        </div>
        <div className={styles.ctaFormContainer}>
          <p className={styles.eyebrow}>Project Support</p>
          <h2>Find the right machine for your project</h2>
          <p>
            Share your project requirements to compare trenchers, attachments,
            aquatic weed harvesters, forklifts, and industry-ready model options
            for your site conditions.
          </p>
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
