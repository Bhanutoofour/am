"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./videos.module.scss";
import { useEffect } from "react";

export default function VideosLoading() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className={styles.videosPage}>
      {/* Page Header Skeleton */}
      <div className={styles.pageHeader}>
        <Skeleton height={40} width={200} className={styles.pageTitle} />
        <Skeleton
          height={24}
          width={24}
          className={styles.filterIconButton}
          circle
        />
      </div>

      <div className={styles.container}>
        {/* Sidebar Filters Skeleton */}
        <aside className={styles.sidebar}>
          {/* Filter Header Skeleton */}
          <div className={styles.filterHeader}>
            <Skeleton height={24} width={80} />
            <Skeleton height={20} width={60} />
          </div>

          {/* Sort By Skeleton */}
          <div className={styles.filterSection}>
            <Skeleton height={20} width={100} className={styles.filterTitle} />
            <div className={styles.radioGroup}>
              <Skeleton height={20} width={120} />
              <Skeleton height={20} width={120} />
            </div>
          </div>

          {/* Industries Filter Skeleton */}
          <div className={styles.filterSection}>
            <div className={styles.filterHeader}>
              <Skeleton
                height={20}
                width={100}
                className={styles.filterTitle}
              />
              <Skeleton height={16} width={16} />
            </div>
            <div className={styles.checkboxGroup}>
              {[1, 2, 3, 4, 5].map((item) => (
                <Skeleton key={item} height={18} width="80%" />
              ))}
            </div>
          </div>

          {/* Products Filter Skeleton */}
          <div className={styles.filterSection}>
            <div className={styles.filterHeader}>
              <Skeleton
                height={20}
                width={100}
                className={styles.filterTitle}
              />
              <Skeleton height={16} width={16} />
            </div>
            <div className={styles.checkboxGroup}>
              {[1, 2, 3, 4, 5].map((item) => (
                <Skeleton key={item} height={18} width="80%" />
              ))}
            </div>
          </div>

          {/* Models Filter Skeleton */}
          <div className={styles.filterSection}>
            <div className={styles.filterHeader}>
              <Skeleton
                height={20}
                width={100}
                className={styles.filterTitle}
              />
              <Skeleton height={16} width={16} />
            </div>
            <div className={styles.checkboxGroup}>
              {[1, 2, 3, 4, 5].map((item) => (
                <Skeleton key={item} height={18} width="80%" />
              ))}
            </div>
          </div>
        </aside>

        {/* Video Grid Skeleton */}
        <main className={styles.videoGrid}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className={styles.videoCard}>
              <div className={styles.videoThumbnail}>
                <Skeleton height="100%" width="100%" />
              </div>
              <div className={styles.videoInfo}>
                <Skeleton
                  height={14}
                  width={120}
                  className={styles.videoDate}
                />
                <Skeleton
                  height={32}
                  width="90%"
                  className={styles.videoTitle}
                />
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
