import type { Metadata } from "next";
import Link from "next/link";
import styles from "./blog.module.scss";

export const metadata: Metadata = {
  title: "Blog Not Found | Autocracy Machinery",
  description: "The blog post you are looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className={styles.blogPage}>
      <div className={styles.contentWrapper} style={{ textAlign: "center", padding: "4rem 1rem" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem", color: "#111113" }}>
          404
        </h1>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#111113" }}>
          Blog Not Found
        </h2>
        <p style={{ fontSize: "1rem", marginBottom: "2rem", color: "#666" }}>
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/blog"
          style={{
            display: "inline-block",
            padding: "0.75rem 2rem",
            backgroundColor: "#FFC107",
            color: "#000",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: 600,
          }}
        >
          Back to Blogs
        </Link>
      </div>
    </div>
  );
}

