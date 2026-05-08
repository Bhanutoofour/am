"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./modelPageLoading.module.scss";
import { useEffect } from "react";

export default function ModelPageLoading() {
  useEffect(() => {
    // Reset scroll position to top when loading component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.modelContainer}>
      {/* Hero Image Skeleton */}
      <div className={styles.imageWrapper}>
        <Skeleton height={400} className={styles.image} />
      </div>

      {/* Info Section Skeleton */}
      <div className={styles.infoSectionSkeleton}>
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <Skeleton height={32} width="40%" className={styles.title} />
            <Skeleton height={20} width="60%" className={styles.subtitle} />
          </div>
          <div className={styles.ctaButtons}>
            <Skeleton height={48} width={120} className={styles.brochure} />
            <Skeleton height={48} width={120} className={styles.quote} />
          </div>
        </div>
      </div>

      {/* Key Features Grid Skeleton */}
      <div className={styles.specGrid}>
        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
          <div key={item} className={styles.eachCard}>
            <Skeleton height={16} width="60%" className={styles.label} />
            <Skeleton height={20} width="80%" className={styles.value} />
          </div>
        ))}
      </div>

      {/* Model Description Skeleton */}
      <div className={styles.modelDetails}>
        {[1, 2, 3].map((item) => (
          <div key={item} style={{ marginBottom: "2rem" }}>
            <Skeleton
              height={24}
              width="70%"
              style={{ marginBottom: "1rem" }}
            />
            <Skeleton height={16} width="100%" count={3} />
          </div>
        ))}
      </div>

      {/* Table Details Skeleton */}
      <div className={styles.tableDetails}>
        <div className={styles.tableDesc}>
          <Skeleton
            height={32}
            width="60%"
            className={styles.tableDescHeading}
          />
          <Skeleton height={20} width="80%" className={styles.tableDescPara} />
        </div>
        <table className={styles.specTable}>
          <thead>
            <tr>
              <th>
                <Skeleton height={20} width={80} />
              </th>
              <th>
                <Skeleton height={20} width={80} />
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((item) => (
              <tr key={item}>
                <td>
                  <Skeleton height={20} width={100} />
                </td>
                <td>
                  <Skeleton height={20} width={120} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Yellow CTA Area Skeleton */}
      <div className={styles.yellowArea}>
        <Skeleton height={32} width="70%" className={styles.yellowHeading} />
        <div className={styles.ctaButtons}>
          <Skeleton height={48} width={120} className={styles.brochure} />
          <Skeleton height={48} width={120} className={styles.quote} />
        </div>
      </div>

      {/* More Models Section Skeleton */}
      <div className={styles.moreModels}>
        <Skeleton
          height={32}
          width="50%"
          className={styles.modelContainerHeading}
        />
        <div className={styles.modelCardContainer}>
          {[1, 2, 3, 4].map((item) => (
            <div key={item} style={{ minWidth: "280px" }}>
              <Skeleton height={200} style={{ marginBottom: "1rem" }} />
              <Skeleton height={20} width="80%" />
              <Skeleton height={16} width="60%" />
            </div>
          ))}
        </div>
      </div>

      {/* Contact Us Section Skeleton */}
      <div style={{ padding: "4rem 0" }}>
        <Skeleton height={300} />
      </div>
    </div>
  );
}
