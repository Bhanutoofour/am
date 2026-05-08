import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./productStyle.module.scss";

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className={`${styles.productCard} ${styles.skeletonCard}`}>
      <Skeleton
        className={styles.productImage}
        height={178}
        width={245}
        style={{ borderRadius: "0.25rem" }}
      />
      <div className={styles.productDetail}>
        <h2 className={styles.cardTitle}>
          <Skeleton width={120} height={24} />
        </h2>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
