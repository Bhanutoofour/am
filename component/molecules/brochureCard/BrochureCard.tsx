"use client"

import React from "react";
import styles from "./brochureCard.module.scss";
import Image from "next/image";
import { ICONS } from "@/constants/Images/images";

interface BrochureCardProps {
  title: string;
  subtitle: string;
  onDownloadClick: () => void;
}

const BrochureCard: React.FC<BrochureCardProps> = ({
  title,
  subtitle,
  onDownloadClick,
}) => {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.cardContent}>
        <div className={styles.imageWrapper}>
          <Image
            src={ICONS.BROCHURE_THUMBNAIL}
            alt={`${title} Brochure`}
            width={100}
            height={141}
            className={styles.brochureImage}
          />
          <span className={styles.brochureImageShadow} />
        </div>
        <div className={styles.textSection}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <div className={styles.mobileContent}>
          <div className={`${styles.textSection}`}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
          <button className={styles.downloadBtn} onClick={onDownloadClick}>
            DOWNLOAD
          </button>
        </div>
      </div>
      <button className={styles.downloadBtn} onClick={onDownloadClick}>
        DOWNLOAD
      </button>
    </div>
  );
};

export default BrochureCard;
