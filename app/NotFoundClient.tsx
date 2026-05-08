"use client";

import { useRouter } from "next/navigation";
import styles from "./notFound.module.scss";
import { IMAGES } from "@/constants/Images/images";

export default function NotFoundClient() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundText}>404</div>
      <div
        className={styles.content}
        style={{
          backgroundImage: `url(${IMAGES.NOT_FOUND_BG})`,
        }}
      >
        <h1 className={styles.title}>Oops! Page not found</h1>
        <p className={styles.description}>
          The page you&apos;re looking for doesn&apos;t seem to exist. But
          don&apos;t worry, we&apos;ve got plenty of amazing templates waiting
          for you!
        </p>
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${styles.homeButton}`}
            onClick={handleGoHome}
          >
            GO HOME
          </button>
        </div>
      </div>
    </div>
  );
}
