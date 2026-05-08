"use client";

import React from "react";
import styles from "./brochureCard.module.scss";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BrochureCardSkeleton: React.FC = () => {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.cardContent}>
        <div className={styles.imageWrapper}>
          <Skeleton height={141} width={100} className={styles.brochureImage} />
          <Skeleton
            height={16}
            width={148}
            className={styles.brochureImageShadow}
          />
        </div>
        <div className={styles.textSection}>
          <Skeleton height={22} width="80%" className={styles.title} />
          <Skeleton height={14} width="60%" className={styles.subtitle} />
        </div>
        <div className={styles.mobileContent}>
          <div className={styles.textSection}>
            <Skeleton height={22} width="80%" className={styles.title} />
            <Skeleton height={14} width="60%" className={styles.subtitle} />
          </div>
          <Skeleton height={32} width="100%" className={styles.downloadBtn} />
        </div>
      </div>
      <Skeleton height={32} width="100%" className={styles.downloadBtn} />
    </div>
  );
};

export default BrochureCardSkeleton;
