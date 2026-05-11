"use client";

import React from "react";
import Image from "next/image";
import styles from "./blog.module.scss";
import { formatDate } from "@/utils/videoHelpers";
import LocalizedLink from "@/component/LocalizedLink";

interface BlogClientProps {
  blog: {
    id: number;
    title: string;
    slug: string;
    description: string;
    banner: string;
    bannerAltText: string;
    content: string;
    published: boolean | null;
    createdAt: Date;
    updatedAt: Date;
    industryIds: number[];
    productIds: number[];
    modelIds: number[];
    seoMetadata?: {
      pageTitle?: string;
      pageDescription?: string;
      pageKeywords?: string;
      socialTitle?: string;
      socialDescription?: string;
      socialImage?: string;
    } | null;
  };
  relatedBlogs?: {
    id: number;
    title: string;
    slug: string;
    description: string;
    banner: string;
    bannerAltText: string;
    createdAt: Date;
  }[];
}


export default function BlogClient({
  blog,
  relatedBlogs = [],
}: BlogClientProps) {
  return (
    <div className={styles.blogPage}>
      <article className={styles.blogArticle}>
        {/* Banner Image */}
        <div className={styles.bannerSection}>
          <Image
            src={blog.banner}
            alt={blog.bannerAltText || blog.title}
            width={1200}
            height={600}
            className={styles.bannerImage}
            priority
          />
        </div>

        {/* Blog Content */}
        <div className={styles.contentWrapper}>
          {/* Header */}
          <header className={styles.blogHeader}>
            <time className={styles.blogDate}>
              {formatDate(blog.createdAt)}
            </time>
          </header>

          {/* Rich Text Content */}
          <div
            className={styles.blogContent}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </article>

      {/* Related Blogs */}
      {relatedBlogs && relatedBlogs.length > 0 && (
        <section className={styles.relatedSection}>
          <h2 className={styles.relatedHeading}>Related Blogs</h2>
          <div className={styles.relatedGrid}>
            {relatedBlogs.map((rb) => (
              <LocalizedLink
                key={rb.id}
                href={`/blog/${rb.slug}`}
                className={styles.relatedCard}
              >
                <div className={styles.relatedImageWrap}>
                  <Image
                    src={rb.banner}
                    alt={rb.bannerAltText || rb.title}
                    width={400}
                    height={225}
                  />
                </div>
                <div className={styles.relatedInfo}>
                  <p className={styles.relatedDate}>
                    {formatDate(rb.createdAt)}
                  </p>
                  <h3 className={styles.relatedTitle}>{rb.title}</h3>
                </div>
              </LocalizedLink>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
