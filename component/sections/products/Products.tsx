"use client";
import React, { useState } from "react";
import styles from "./product.module.scss";
import ProductCard from "@/component/molecules/productCard/ProductCard";
import Image from "next/image";
import { ICONS } from "@/constants/Images/images";
import useWindowSize from "@/hooks/useWindowSize";
import { useKeenSlider } from "keen-slider/react";
import { SCREENS } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import { productSlug } from "@/utils/slug";
import LocalizedLink from "@/component/LocalizedLink";
import { withLocalePrefix } from "@/utils/locale";

interface ProductsProps {
  products: ActiveProduct[];
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { width } = useWindowSize();
  const router = useRouter();
  const pathname = usePathname();

  const handleViewAll = () => {
    router.push(withLocalePrefix("/products", pathname));
  };

  const slidesPerView = (() => {
    if (!width) return 4;
    if (width >= SCREENS.TAB_LANDSCAPE) return 4;
    if (width >= SCREENS.TAB_PORTRAIT) return 3;
    if (width >= SCREENS.MOBILE_LANDSCAPE) return 2.25;
    if (width >= SCREENS.MOBILE_MIDSCREEN) return 1.6;
    return 1.12;
  })();

  const slideSpacing = width && width >= SCREENS.MOBILE_LANDSCAPE ? 24 : 14;

  const [sliderRef, instanceRef] = useKeenSlider({
    slides: {
      perView: slidesPerView,
      spacing: slideSpacing,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  const perViewValue = (() => {
    const slidesOption = instanceRef.current?.options?.slides;
    if (typeof slidesOption === "number") return slidesOption;
    if (
      typeof slidesOption === "object" &&
      slidesOption !== null &&
      "perView" in slidesOption
    ) {
      return Number(slidesOption.perView) || 0;
    }
    return 0;
  })();

  const totalSlides = instanceRef.current?.track?.details?.slides.length || 0;
  const maxSlide =
    instanceRef.current?.track?.details?.maxIdx ??
    Math.max(0, Math.ceil(totalSlides - Number(perViewValue)));

  const stripPosition = maxSlide > 0 ? (currentSlide / maxSlide) * 80 : 0;

  return (
    <section className={styles.productSection}>
      <div className={styles.content}>
        <div className={styles.productHeadingContainer}>
          <h4 className={styles.sectionTitle}>
            Trenchers, Attachments and Utility Machines
          </h4>
          <div className={styles.navigationContainer}>
            <button className={styles.viewAll} onClick={handleViewAll}>
              VIEW ALL PRODUCTS
            </button>
            <div className={styles.navButtons}>
              <button
                className={`${styles.arrowButton} ${
                  currentSlide === 0 ? styles.disabled : ""
                }`}
                onClick={() => instanceRef.current?.prev()}
                disabled={currentSlide === 0}
              >
                <Image
                  src={ICONS.CAROUSEL_ARROW}
                  alt="left arrow"
                  width={15}
                  height={15}
                  style={{ transform: "rotate(180deg)" }}
                />
              </button>
              <button
                className={`${styles.arrowButton} ${
                  currentSlide >= maxSlide ? styles.disabled : ""
                }`}
                onClick={() => instanceRef.current?.next()}
                disabled={currentSlide >= maxSlide}
              >
                <Image
                  src={ICONS.CAROUSEL_ARROW}
                  alt="right arrow"
                  width={15}
                  height={15}
                />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.productGrid}>
          {products && products.length > 0 ? (
            <>
              <div
                ref={sliderRef}
                className={`${styles.productAllCarousel} keen-slider`}
              >
                {products.map((data) => (
                  <LocalizedLink
                    key={data.id}
                    href={`/products/${productSlug(data?.title ?? "")}`}
                    className="keen-slider__slide"
                  >
                    <ProductCard
                      title={data.title}
                      imageSrc={data.thumbnail}
                      altText={data.thumbnailAltText}
                    />
                  </LocalizedLink>
                ))}
              </div>
            </>
          ) : (
            <p>No products available.</p>
          )}
        </div>

        {/* Sliding Strip Indicator */}
        <div className={styles.slidingStripContainer}>
          <div
            className={styles.slidingStrip}
            style={{ left: `${Math.min(stripPosition, 80)}%` }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default Products;
