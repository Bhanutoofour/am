import { Metadata } from "next";
import Image from "next/image";
import { MediaData } from "@/data/recognitionsData";
import { SITE_URL } from "@/utils/locale";
import styles from "./mediaPage.module.scss";

export const metadata: Metadata = {
  title: "Media | Autocracy Machinery",
  description:
    "Read media features, interviews, and coverage about Autocracy Machinery, specialised trenchers, utility attachments, and infrastructure machinery.",
  alternates: {
    canonical: `${SITE_URL}/media`,
  },
  openGraph: {
    title: "Media | Autocracy Machinery",
    description:
      "Media features and coverage about Autocracy Machinery and its specialised field machinery.",
    url: `${SITE_URL}/media`,
    type: "website",
  },
};

export default function MediaPage() {
  return (
    <section className={styles.mediaPage}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Resources</p>
        <h1>Media</h1>
        <p>
          Coverage, interviews, and featured stories about Autocracy Machinery,
          specialised trenchers, utility attachments, and field-ready machinery
          for infrastructure, agriculture, and environmental applications.
        </p>
      </div>

      <div className={styles.mediaGrid}>
        {MediaData.map((item) => (
          <article key={`${item.title}-${item.link}`} className={styles.card}>
            <div className={styles.logoBox}>
              {item.imageSrc ? (
                <Image
                  src={item.imageSrc}
                  alt={`${item.title} media logo`}
                  width={item.width || 160}
                  height={item.height || 40}
                />
              ) : (
                <span
                  className={item.logoVariant ? styles[item.logoVariant] : ""}
                >
                  <strong>{item.publication}</strong>
                  {item.logoSubtitle && <small>{item.logoSubtitle}</small>}
                </span>
              )}
            </div>
            <div className={styles.cardContent}>
              <h2>{item.title}</h2>
              <p>{item.desc}</p>
            </div>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              Read More
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
