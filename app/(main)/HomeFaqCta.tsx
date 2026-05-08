import Link from "next/link";
import styles from "./homeFaqCta.module.scss";

const homeFaqs = [
  {
    question: "What does Autocracy Machinery manufacture?",
    answer:
      "Autocracy Machinery manufactures trenchers, attachments, post hole diggers, aquatic weed harvesters, floating pontoons, and infrastructure machines for telecom, water management, solar, agriculture, landscaping, construction, and environmental applications.",
  },
  {
    question: "Which Autocracy Machinery equipment is used for OFC cable laying?",
    answer:
      "Autocracy Machinery trenchers and related utility trenching machines are used for OFC cable laying, telecom duct routes, pipeline trenching, irrigation lines, and solar cable trenching projects.",
  },
  {
    question: "Can Autocracy Machinery help select the right model?",
    answer:
      "Yes. Buyers can share application details, soil or water conditions, trench depth, route length, carrier compatibility, and output goals so the Autocracy team can guide suitable products and models.",
  },
  {
    question: "Where can I compare Autocracy Machinery products by industry?",
    answer:
      "Use the industries page to compare machinery by application, including OFC telecommunications, water management, solar energy, agriculture, landscaping, construction, civil engineering, and environmental sustainability.",
  },
];

export default function HomeFaqCta() {
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
          Quick answers for buyers comparing trenchers, infrastructure
          machines, environmental equipment, and model options for real field
          applications.
        </p>
      </div>
      <div className={styles.faqGrid}>
        {homeFaqs.map((faq) => (
          <article key={faq.question} className={styles.faqCard}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </article>
        ))}
      </div>
      <div className={styles.ctaSection}>
        <div>
          <p className={styles.eyebrow}>Project Support</p>
          <h2>Find the right machine for your application</h2>
          <p>
            Share your project requirements with Autocracy Machinery to compare
            trenchers, attachments, aquatic weed harvesters, and industry-ready
            model options.
          </p>
        </div>
        <div className={styles.ctaActions}>
          <Link href="/contact-us" className={styles.primaryAction}>
            Get a Quote
          </Link>
          <Link href="/brochure" className={styles.secondaryAction}>
            View Brochures
          </Link>
        </div>
      </div>
    </section>
  );
}
