import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./blog.module.scss";

export default function Loading() {
  return (
    <div className={styles.blogPage}>
      <article className={styles.blogArticle}>
        {/* Banner Skeleton */}
        <div className={styles.bannerSection}>
          <Skeleton height={400} style={{ borderRadius: "8px" }} />
        </div>

        {/* Content Skeleton */}
        <div className={styles.contentWrapper}>
          <div className={styles.blogHeader}>
            <Skeleton height={16} width={120} style={{ marginBottom: "1rem" }} />
            <Skeleton height={60} width="80%" style={{ marginBottom: "1rem" }} />
            <Skeleton height={24} width="100%" />
          </div>

          <div className={styles.blogContent}>
            <Skeleton height={20} width="100%" style={{ marginBottom: "1rem" }} />
            <Skeleton height={20} width="100%" style={{ marginBottom: "1rem" }} />
            <Skeleton height={20} width="90%" style={{ marginBottom: "1rem" }} />
            <Skeleton height={300} width="100%" style={{ marginBottom: "2rem", borderRadius: "8px" }} />
            <Skeleton height={20} width="100%" style={{ marginBottom: "1rem" }} />
            <Skeleton height={20} width="95%" style={{ marginBottom: "1rem" }} />
            <Skeleton height={20} width="100%" />
          </div>
        </div>
      </article>
    </div>
  );
}

