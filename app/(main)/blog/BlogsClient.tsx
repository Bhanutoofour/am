"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./blogs.module.scss";
import { ICONS, INDUSTRY } from "@/constants/Images/images";
import { formatDate } from "@/utils/videoHelpers";

interface BlogWithRelations {
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
}

interface ActiveIndustry {
  id: number;
  title: string;
}

interface ActiveProduct {
  id: number;
  title: string;
}

interface ActiveModel {
  id: number;
  modelNumber: string;
  modelTitle: string;
  productName: string;
}

interface BlogsClientProps {
  blogs: BlogWithRelations[];
  industries: ActiveIndustry[];
  products: ActiveProduct[];
  models: ActiveModel[];
}

// Truncate description
const truncateDescription = (text: string, maxLength: number = 150): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

const BlogsClient: React.FC<BlogsClientProps> = ({
  blogs,
  industries,
  products,
  models,
}) => {
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [selectedIndustries, setSelectedIndustries] = useState<number[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedModels, setSelectedModels] = useState<number[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    industries: true,
    products: true,
    models: true,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [failedBanners, setFailedBanners] = useState<Map<number, string>>(
    new Map()
  );

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Close sidebar
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Filter and sort blogs
  const filteredAndSortedBlogs = useMemo(() => {
    let filtered = blogs;

    // Filter by industries
    if (selectedIndustries.length > 0) {
      filtered = filtered.filter((blog) =>
        blog.industryIds.some((id) => selectedIndustries.includes(id))
      );
    }

    // Filter by products
    if (selectedProducts.length > 0) {
      filtered = filtered.filter((blog) =>
        blog.productIds.some((id) => selectedProducts.includes(id))
      );
    }

    // Filter by models
    if (selectedModels.length > 0) {
      filtered = filtered.filter((blog) =>
        blog.modelIds.some((id) => selectedModels.includes(id))
      );
    }

    // Sort blogs
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  }, [blogs, selectedIndustries, selectedProducts, selectedModels, sortBy]);

  // Toggle filter selection
  const toggleIndustry = (industryId: number) => {
    setSelectedIndustries((prev) =>
      prev.includes(industryId)
        ? prev.filter((id) => id !== industryId)
        : [...prev, industryId]
    );
  };

  const toggleProduct = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleModel = (modelId: number) => {
    setSelectedModels((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedIndustries([]);
    setSelectedProducts([]);
    setSelectedModels([]);
    setSortBy("newest");
  };

  return (
    <div className={styles.blogsPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Blogs</h1>
        {!sidebarOpen && (
          <button
            className={styles.filterIconButton}
            onClick={toggleSidebar}
            aria-label="Toggle filters"
          >
            <Image
              src={ICONS.FILTER_ICON}
              alt="Filter"
              width={24}
              height={24}
            />
          </button>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={closeSidebar} />
      )}

      <div className={styles.container}>
        {/* Sidebar Filters */}
        <aside
          className={`${styles.sidebar} ${
            sidebarOpen ? styles.sidebarOpen : ""
          }`}
        >
          <div className={styles.filterHeader}>
            <h2>Filter</h2>
            <div className={styles.filterHeaderActions}>
              {(selectedIndustries.length > 0 ||
                selectedProducts.length > 0 ||
                selectedModels.length > 0) && (
                <button
                  onClick={resetFilters}
                  className={styles.resetButton}
                  aria-label="Reset filters"
                >
                  Reset
                </button>
              )}
              <button
                className={styles.closeSidebarButton}
                onClick={closeSidebar}
                aria-label="Close filters"
              >
                <Image
                  src={ICONS.CLOSE_ICON}
                  alt="Close"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>

          {/* Sort By */}
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Sort by</h3>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="newest"
                  checked={sortBy === "newest"}
                  onChange={(e) =>
                    setSortBy(e.target.value as "newest" | "oldest")
                  }
                />
                <span>Newest</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="oldest"
                  checked={sortBy === "oldest"}
                  onChange={(e) =>
                    setSortBy(e.target.value as "newest" | "oldest")
                  }
                />
                <span>Oldest</span>
              </label>
            </div>
          </div>

          {/* Industries Filter */}
          <div className={styles.filterSection}>
            <div
              className={styles.filterHeader}
              onClick={() => toggleSection("industries")}
            >
              <h3 className={styles.filterTitle}>Industries</h3>
              <span className={styles.toggleIcon}>
                {expandedSections.industries ? "−" : "+"}
              </span>
            </div>
            {expandedSections.industries && (
              <div className={styles.checkboxGroup}>
                {industries.map((industry) => (
                  <label key={industry.id} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={selectedIndustries.includes(industry.id)}
                      onChange={() => toggleIndustry(industry.id)}
                    />
                    <span>{industry.title}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Products Filter */}
          <div className={styles.filterSection}>
            <div
              className={styles.filterHeader}
              onClick={() => toggleSection("products")}
            >
              <h3 className={styles.filterTitle}>Products</h3>
              <span className={styles.toggleIcon}>
                {expandedSections.products ? "−" : "+"}
              </span>
            </div>
            {expandedSections.products && (
              <div className={styles.checkboxGroup}>
                {products.map((product) => (
                  <label key={product.id} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleProduct(product.id)}
                    />
                    <span>{product.title}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Models Filter */}
          <div className={styles.filterSection}>
            <div
              className={styles.filterHeader}
              onClick={() => toggleSection("models")}
            >
              <h3 className={styles.filterTitle}>Models</h3>
              <span className={styles.toggleIcon}>
                {expandedSections.models ? "−" : "+"}
              </span>
            </div>
            {expandedSections.models && (
              <div className={styles.checkboxGroup}>
                {models.map((model) => (
                  <label key={model.id} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={selectedModels.includes(model.id)}
                      onChange={() => toggleModel(model.id)}
                    />
                    <span>{model.modelTitle}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Blog List */}
        <main className={styles.blogList}>
          {filteredAndSortedBlogs.length === 0 ? (
            <div className={styles.noResults}>
              <h3>No blogs found</h3>
              <p>Try adjusting your filters to see more blogs.</p>
              <button onClick={resetFilters} className={styles.clearAllButton}>
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredAndSortedBlogs.map((blog) => {
              const bannerUrl =
                failedBanners.get(blog.id) ||
                blog.banner ||
                INDUSTRY.SAMPLE_INDUSTRY;

              return (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className={styles.blogCard}
                >
                  <div className={styles.blogImage}>
                    <Image
                      src={bannerUrl}
                      alt={blog.bannerAltText || blog.title}
                      width={400}
                      height={250}
                      className={styles.bannerImage}
                      onError={() => {
                        if (!failedBanners.has(blog.id)) {
                          setFailedBanners((prev) => {
                            const newMap = new Map(prev);
                            newMap.set(blog.id, INDUSTRY.SAMPLE_INDUSTRY);
                            return newMap;
                          });
                        }
                      }}
                    />
                  </div>
                  <div className={styles.blogInfo}>
                    <p className={styles.blogDate}>
                      {formatDate(blog.createdAt)}
                    </p>
                    <h3 className={styles.blogTitle}>{blog.title}</h3>
                    <p className={styles.blogDescription}>
                      {truncateDescription(blog.description)}
                    </p>
                  </div>
                </Link>
              );
            })
          )}
        </main>
      </div>
    </div>
  );
};

export default BlogsClient;
