"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./productPageLoading.module.scss";
import { useEffect } from "react";

export default function ProductPageLoading() {
  useEffect(() => {
    // Reset scroll position to top when loading component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.productContainer}>
      {/* Product Details Section Skeleton */}
      <div className={styles.productDetails}>
        <div className={styles.productInfo}>
          <Skeleton height={48} width="70%" className={styles.productHeading} />
          <Skeleton
            height={20}
            width="60%"
            className={styles.productDescription}
          />
        </div>
        <div className={styles.industryTags}>
          {[1, 2, 3].map((item) => (
            <Skeleton
              key={item}
              height={32}
              width={80}
              className={styles.eachIndustry}
            />
          ))}
        </div>
      </div>

      {/* Model Container Heading Skeleton */}
      <div className={styles.modelContainerHeading}>
        <div className={styles.headingSection}>
          <Skeleton height={32} width={100} className={styles.headingText} />
        </div>
        <div className={styles.filterSeries}>
          <Skeleton height={40} width={120} className={styles.headingSelect} />
          <Skeleton height={40} width={120} className={styles.headingSelect} />
        </div>
      </div>

      {/* Models Grid Skeleton */}
      <div className={styles.modelContainer}>
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className={styles.modelCard}>
            <Skeleton height={200} className={styles.modelImage} />
            <div className={styles.modelInfo}>
              <Skeleton height={24} width="80%" className={styles.modelTitle} />
              <Skeleton
                height={16}
                width="60%"
                className={styles.modelDescription}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Related Products Section Skeleton */}
      <div className={styles.sliderWrapper}>
        <div className={styles.carouselHeader}>
          <Skeleton
            height={32}
            width={200}
            className={styles.caraouselHeading}
          />
          <div className={styles.navButtons}>
            <Skeleton height={48} width={48} className={styles.arrowButton} />
            <Skeleton height={48} width={48} className={styles.arrowButton} />
          </div>
        </div>
        <div className={styles.productCarousel}>
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className={styles.productCard}>
              <Skeleton height={150} className={styles.productImage} />
              <Skeleton
                height={20}
                width="90%"
                className={styles.productTitle}
              />
            </div>
          ))}
        </div>
      </div>

      {/* More Industries Section Skeleton */}
      <div className={styles.sliderWrapper}>
        <div className={styles.carouselHeader}>
          <Skeleton
            height={32}
            width={200}
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
    </div>
  );
}
