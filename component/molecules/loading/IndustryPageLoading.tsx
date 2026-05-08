"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./industryPageLoading.module.scss";
import { useEffect } from "react";

export default function IndustryPageLoading() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className={styles.industryHome}>
      {/* Banner/Image Section Skeleton */}
      <div className={styles.bannerSkeleton}>
        <Skeleton height={440} className={styles.bannerImage} />
      </div>

      {/* Industry Info Section Skeleton */}
      <div className={styles.industryData}>
        <div className={styles.industryInfo}>
          <Skeleton
            height={48}
            width="60%"
            className={styles.industryHeading}
          />
          <Skeleton
            height={20}
            width="80%"
            className={styles.industryDescription}
          />
          <Skeleton height={56} width={140} className={styles.brochureButton} />
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className={styles.productHolder}>
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className={styles.productCard}>
            <Skeleton height={200} className={styles.productImage} />
            <Skeleton height={20} width="90%" className={styles.productTitle} />
          </div>
        ))}
      </div>

      {/* More Industries Section Skeleton */}
      <div className={styles.sliderWrapper}>
        <div className={styles.carouselHeader}>
          <Skeleton
            height={40}
            width={250}
            className={styles.caraouselHeading}
          />
          <div className={styles.navButtons}>
            <Skeleton height={48} width={48} className={styles.arrowButton} />
            <Skeleton height={48} width={48} className={styles.arrowButton} />
          </div>
        </div>
        <div className={styles.industryCarousel}>
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className={styles.industryCard}>
              <Skeleton height={150} className={styles.industryImage} />
              <Skeleton
                height={18}
                width="80%"
                className={styles.industryTitle}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
