import styles from "./rentalSkeletonCardStyles.module.scss";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function RentalModelCardSkeleton() {
  return (
    <div className={styles.card}>
      {/* Left Image Section */}
      <div className={styles.imageWrapper}>
        <Skeleton height="100%" width="100%" />
      </div>

      {/* Right Content Section */}
      <div className={styles.contentWrapper}>
        {/* Title */}
        <Skeleton width={150} height={24} />

        {/* Subtitle */}
        <Skeleton width={220} height={16} style={{ marginTop: "8px" }} />

        {/* Description */}
        <Skeleton
          count={3}
          width="90%"
          height={14}
          style={{ marginTop: "12px" }}
        />

        {/* Buttons */}
        <div className={styles.buttonWrapper}>
          <Skeleton width={120} height={40} />
          <Skeleton width={120} height={40} />
        </div>
      </div>
    </div>
  );
}
