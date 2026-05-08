"use client";
import React, { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./rentalPageLoading.module.scss";
import RentalModelCardSkeleton from "../rentalModelSkeletonCard/RentalModelSkeletonCard";

const RentalPageLoading = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className={styles.rentalSkeleton}>
      <div className={styles.rentalHeadingSkeleton}>
        <Skeleton height={32} width={350} className={styles.contentHeading} />
        <Skeleton height={20} width={500} className={styles.contentPara} count={3}  />
      </div>
      <div className={styles.rentalCardContainerSkeleton}>
        {[1, 2, 3, 4].map((_, i) => (
          <RentalModelCardSkeleton key={i + _} />
        ))}
      </div>
    </div>
  );
};

export default RentalPageLoading;
