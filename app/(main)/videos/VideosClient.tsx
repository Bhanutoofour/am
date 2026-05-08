"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import styles from "./videos.module.scss";
import { VideoWithRelations } from "@/actions/videoAction";
import VideoModal from "./VideoModal";
import { ICONS, INDUSTRY } from "@/constants/Images/images";
import { getThumbnailUrl, formatDate } from "@/utils/videoHelpers";

interface VideosClientProps {
  videos: VideoWithRelations[];
  industries: ActiveIndustry[];
  products: ActiveProduct[];
  models: {
    id: number;
    modelNumber: string;
    modelTitle: string;
    productName: string;
  }[];
}


const VideosClient: React.FC<VideosClientProps> = ({
  videos,
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
  const [selectedVideo, setSelectedVideo] = useState<{
    embedLink: string;
    title: string;
  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [thumbnailUrls, setThumbnailUrls] = useState<Map<number, string>>(
    new Map()
  );

  // Load and validate thumbnails
  useEffect(() => {
    const loadThumbnails = async () => {
      const urlMap = new Map<number, string>();
      await Promise.all(
        videos.map(async (video) => {
          const url = await getThumbnailUrl(video.embedLink);
          urlMap.set(video.id, url);
        })
      );
      setThumbnailUrls(urlMap);
    };
    
    if (videos.length > 0) {
      loadThumbnails();
    }
  }, [videos]);

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

  // Filter and sort videos
  const filteredAndSortedVideos = useMemo(() => {
    let filtered = videos;

    // Filter by industries
    if (selectedIndustries.length > 0) {
      filtered = filtered.filter((video) =>
        video.industryIds.some((id) => selectedIndustries.includes(id))
      );
    }

    // Filter by products
    if (selectedProducts.length > 0) {
      filtered = filtered.filter((video) =>
        video.productIds.some((id) => selectedProducts.includes(id))
      );
    }

    // Filter by models
    if (selectedModels.length > 0) {
      filtered = filtered.filter((video) =>
        video.modelIds.some((id) => selectedModels.includes(id))
      );
    }

    // Sort videos
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  }, [videos, selectedIndustries, selectedProducts, selectedModels, sortBy]);

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

  // Open video in modal
  const openVideo = (embedLink: string, title: string) => {
    setSelectedVideo({ embedLink, title });
  };

  // Close video modal
  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div className={styles.videosPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Videos</h1>
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
                <button onClick={resetFilters} className={styles.resetButton}>
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

        {/* Video Grid */}
        <main className={styles.videoGrid}>
          {filteredAndSortedVideos.length === 0 ? (
            <div className={styles.noResults}>
              <h3>No videos found</h3>
              <p>Try adjusting your filters to see more videos.</p>
              <button onClick={resetFilters} className={styles.clearAllButton}>
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredAndSortedVideos.map((video) => {
              return (
                <div
                  key={video.id}
                  className={styles.videoCard}
                  onClick={() => openVideo(video.embedLink, video.title)}
                >
                  <div className={styles.videoThumbnail}>
                    <Image
                      src={thumbnailUrls.get(video.id) || INDUSTRY.SAMPLE_INDUSTRY}
                      alt={video.title}
                      width={400}
                      height={225}
                      className={styles.thumbnailImage}
                    />
                    <div className={styles.playButton}>
                      <Image
                        src={ICONS.YOUTUBE_RED}
                        alt="Play Video"
                        width={72}
                        height={50}
                      />
                    </div>
                  </div>
                  <div className={styles.videoInfo}>
                    <p className={styles.videoDate}>
                      {formatDate(video.createdAt)}
                    </p>
                    <h3 className={styles.videoTitle}>{video.title}</h3>
                  </div>
                </div>
              );
            })
          )}
        </main>
      </div>
      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={closeVideo}
          embedLink={selectedVideo.embedLink}
          title={selectedVideo.title}
        />
      )}
    </div>
  );
};

export default VideosClient;
