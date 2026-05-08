"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./brochureStyle.module.scss";
import BrochureCardSkeleton from "@/component/molecules/brochureCard/BrochureCardSkeleton";

export default function BrochureLoading() {
  return (
    <div className={styles.container}>
      {/* Page Title Skeleton */}
      <Skeleton height={40} width={300} className={styles.navTitle} />

      <div className={styles.innerContainer}>
        {/* Left Navigation Skeleton */}
        <div className={styles.leftNav}>
          <div className={styles.productList}>
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className={styles.productItem}>
                <Skeleton
                  height={41}
                  width={78}
                  className={styles.productIcon}
                />
                <Skeleton
                  height={20}
                  width="60%"
                  className={styles.productName}
                />
                <Skeleton height={20} width={20} className={styles.arrow} />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area Skeleton */}
        <div className={styles.mainContent}>
          {/* Brochure Content Skeleton */}
          <div className={styles.brochureContent}>
            {/* Equipments Section Skeleton */}
            <section className={styles.section}>
              <Skeleton
                height={32}
                width={150}
                className={`${styles.sectionTitle} ${styles.skeleton}`}
              />
              <div className={styles.brochureGrid}>
                {[1, 2, 3, 4].map((item) => (
                  <BrochureCardSkeleton key={item} />
                ))}
              </div>
            </section>

            {/* Attachments Section Skeleton */}
            <section className={styles.section}>
              <Skeleton
                height={32}
                width={150}
                className={`${styles.sectionTitle} ${styles.skeleton}`}
              />
              <div className={styles.brochureGrid}>
                {[1, 2, 3, 4].map((item) => (
                  <BrochureCardSkeleton key={item} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
