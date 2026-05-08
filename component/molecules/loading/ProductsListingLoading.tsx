import React from "react";
import styles from "./productsListingLoading.module.scss";

const ProductsListingLoading: React.FC = () => {
  return (
    <div className={styles.productsPageLoading}>
      {/* Header Skeleton */}
      <div className={styles.headerSection}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <div className={styles.titleSkeleton}></div>
            <div className={styles.subtitleSkeleton}></div>
          </div>
          <div className={styles.filterSection}>
            <div className={styles.filterSkeleton}></div>
          </div>
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className={styles.container}>
        <div className={styles.productsGrid}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className={styles.productCardSkeleton}>
              <div className={styles.productImageSkeleton}></div>
              <div className={styles.productInfoSkeleton}>
                <div className={styles.productTitleSkeleton}></div>
                <div className={styles.productIndustrySkeleton}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsListingLoading;
