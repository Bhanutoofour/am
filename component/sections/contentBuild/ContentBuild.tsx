import React from "react";
import styles from "./contentStyles.module.scss";

interface contentBuildProps {
  data: BuildForIndiaContentType[];
}

const ContentBuild: React.FC<contentBuildProps> = ({ data }) => {
  return (
    <div className={styles.buildSection}>
      <div className={styles.buildCardTitle}>
        <h2 className={styles.buildTitle}>
          Built for India. Engineered <br /> for Efficiency.
        </h2>
      </div>
      <div className={styles.BuildCardContainer}>
        {data &&
          data.map((item, idx) => (
            <div key={idx} className={styles.buildCard}>
              <div className={styles.wrapper}>
                <div className={styles.bar}></div>
                <div className={`${styles.bar} ${styles.small}`}></div>
              </div>
              <h4 className={styles.cardTitle}>{item.title}</h4>
              <p className={styles.cardDesc}>{item.desc}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ContentBuild;
