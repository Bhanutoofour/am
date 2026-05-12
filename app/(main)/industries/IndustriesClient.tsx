"use client";

import IndustryCard from "@/component/molecules/industryCard/IndustryCard";
import styles from "./industries.module.scss";

interface IndustriesClientProps {
  industries: ActiveIndustry[];
  basePath?: string;
  market?: "global" | "india";
}

export default function IndustriesClient({
  industries,
  basePath = "",
  market = "global",
}: IndustriesClientProps) {
  const isIndiaMarket = market === "india" || basePath === "/en-in";
  const faqs = [
    {
      question:
        "How does Autocracy Machinery help choose trenchers and infrastructure machines?",
      answer:
        "Autocracy Machinery recommends trenchers, attachments, aquatic weed harvesters, floating pontoons, and other infrastructure machines based on application, soil or water conditions, trench width, trench depth, required output, and carrier compatibility.",
    },
    {
      question: "Which industries use Autocracy Machinery trenching equipment?",
      answer:
        "Autocracy Machinery trenching equipment is used for OFC telecommunications, solar cable trenching, water pipelines, irrigation, landscaping, construction utilities, defence corridors, and civil engineering projects.",
    },
    {
      question:
        "Can Autocracy Machinery machines support OFC cable and utility trenching?",
      answer:
        "Yes. Autocracy Machinery manufactures trenchers and related equipment for OFC cable laying, telecom ducts, irrigation pipelines, solar utility routes, and other infrastructure trenching applications.",
    },
    {
      question:
        "What details are available on Autocracy Machinery industry pages?",
      answer:
        "Each industry page connects buyers to relevant Autocracy Machinery products, model specifications, application guidance, product images, videos, brochures, and quote options for that application.",
    },
  ];

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className={styles.industriesPage}>
      <script
        id="industries-faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
      <section className={styles.heroSection}>
        <p className={styles.eyebrow}>
          {isIndiaMarket ? "Industry Solutions in India" : "Industry Solutions"}
        </p>
        <h1 className={styles.heading}>
          {isIndiaMarket
            ? "Find Equipment for Your Industry in India"
            : "Find Equipment for Your Industry"}
        </h1>
        <p className={styles.intro}>
          {isIndiaMarket
            ? "Explore Autocracy Machinery equipment for Indian industry applications, including OFC trenching machines, solar cable trenching equipment, water pipeline trenchers, agriculture attachments, construction utility machines, defence trenching equipment, landscaping machines, and water body cleaning solutions built for Indian field conditions."
            : "Explore Autocracy Machinery equipment by industry application, including OFC telecommunications trenchers, solar EPC equipment, water management machines, agriculture and landscaping attachments, construction utility machines, defence trenching equipment, and environmental cleaning solutions."}
        </p>
      </section>
      {industries.length > 0 ? (
        <div className={styles.grid}>
          {industries.map((industry) => (
            <IndustryCard
              key={industry.id}
              id={industry.id}
              title={industry.title}
              imageSrc={industry.thumbnail}
              altText={industry.thumbnailAltText}
              basePath={basePath}
            />
          ))}
        </div>
      ) : (
        <p className={styles.emptyState}>No industries available.</p>
      )}
      <section className={styles.insightGrid}>
        <article className={styles.insightCard}>
          <span>01</span>
          <h2>
            {isIndiaMarket
              ? "Match Machines to Indian Site Conditions"
              : "Match Equipment to Work Conditions"}
          </h2>
          <p>
            {isIndiaMarket
              ? "Autocracy Machinery helps match trenchers in India, post hole diggers, solar attachments, aquatic weed harvesters, and floating pontoons to soil, water, route access, carrier fit, and project productivity."
              : "Autocracy Machinery helps match trenchers, post hole diggers, utility attachments, aquatic weed harvesters, and floating pontoons to project type, ground or water conditions, operating corridor, and productivity expectations."}
          </p>
        </article>
        <article className={styles.insightCard}>
          <span>02</span>
          <h2>Compare Product Fit Faster</h2>
          <p>
            Each industry route connects buyers to relevant Autocracy
            Machinery products, model specifications, brochures, product media,
            and application guidance without sorting through unrelated
            equipment.
          </p>
        </article>
        <article className={styles.insightCard}>
          <span>03</span>
          <h2>Plan Projects With Practical Inputs</h2>
          <p>
            Use industry pages to align machine choice with trench depth,
            trench width, route length, terrain, utility type, carrier
            compatibility, and field productivity goals.
          </p>
        </article>
      </section>
      <section className={styles.processSection}>
        <div className={styles.processIntro}>
          <p className={styles.eyebrow}>Selection Workflow</p>
          <h2>From Industry Need to Model Shortlist</h2>
        </div>
        <div className={styles.processSteps}>
          <div>
            <h3>Identify the application</h3>
            <p>
              Choose the industry closest to your project, such as OFC cable
              laying, irrigation trenching, solar utility work, civil
              construction, landscaping, or environmental cleaning.
            </p>
          </div>
          <div>
            <h3>Review suitable products</h3>
            <p>
              Open the industry page to see related Autocracy Machinery
              products and understand how each machine category supports that
              work.
            </p>
          </div>
          <div>
            <h3>Compare model details</h3>
            <p>
              Move into model pages for specifications, images, videos,
              brochures, application details, and quote actions.
            </p>
          </div>
        </div>
      </section>
      <section className={styles.seoSection}>
        <div className={styles.seoCopy}>
          <h2>Industrial Machinery Built Around Field Applications</h2>
          <p>
            Autocracy Machinery helps project teams select industrial and
            infrastructure machines by real site requirements, including
            trenching, OFC cable routing, pipeline trenching, utility corridors,
            irrigation trenching, solar infrastructure, aquatic weed removal,
            lake cleaning, landscaping, and civil construction work.
          </p>
          <p>
            Each industry page highlights relevant Autocracy Machinery products
            and model options so buyers can compare equipment based on working
            conditions, project goals, deployment needs, and machine
            specifications.
          </p>
        </div>
        {industries.length > 0 && (
          <div className={styles.linkPanel}>
            <h2>Browse Industry Applications</h2>
            <ul>
              {industries.map((industry) => (
                <li key={industry.id}>{industry.title}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
      <section className={styles.faqSection}>
        <div className={styles.faqHeader}>
          <p className={styles.eyebrow}>FAQs</p>
          <h2>Industry Equipment Questions</h2>
        </div>
        <div className={styles.faqGrid}>
          {faqs.map((faq) => (
            <article key={faq.question} className={styles.faqCard}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
