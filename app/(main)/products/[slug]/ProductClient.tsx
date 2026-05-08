"use client";

import type { Dispatch, SetStateAction } from "react";
import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import ModelCard from "@/component/sections/modelCard/ModelCard";
import ProductCard from "@/component/molecules/productCard/ProductCard";
import IndustryCard from "@/component/molecules/industryCard/IndustryCard";
import ModelResponsiveCard from "@/component/sections/modelResponsiveCard/ModelResponsiveCard";
import { ICONS } from "@/constants/Images/images";
import { MODEL_FILTER, SCREENS } from "@/constants";
import useOutsideClick from "@/hooks/useOutsideClick";
import useWindowSize from "@/hooks/useWindowSize";
import { productSlug } from "@/utils/slug";
import styles from "./productMainPage.module.scss";

interface FilterOptionsProps {
  setFilterData: Dispatch<SetStateAction<FilterState>>;
  isSeriesFilter?: boolean;
  filterOptions: string[];
}

type ProductClientProps = {
  productObj: ProductDataType | null;
  products: ActiveProduct[];
  industries: ActiveIndustry[];
  industryId: number;
  productId: number;
  /** When set for the industry product flow, model links use `/industries/.../.../{modelNumberSlug}`. */
  modelBasePath?: string;
  basePath?: string;
  pageVariant?: "product" | "industry";
};

const FilterOptions: React.FC<FilterOptionsProps> = ({
  setFilterData,
  isSeriesFilter = false,
  filterOptions,
}) => {
  const handleClick = (value: string) => {
    setFilterData((prev) => ({
      ...prev,
      ...(isSeriesFilter
        ? {
            seriesFilterType: value,
            showSeriesFilter: false,
          }
        : {
            modelFilterType: value,
            showModelFilter: false,
          }),
    }));
  };

  return (
    <div className={styles.filterContainer}>
      {filterOptions.map((option) => (
        <button
          key={option}
          className={styles.filterBtn}
          onClick={() => handleClick(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default function ProductClient({
  productObj,
  products,
  industries,
  industryId,
  productId,
  modelBasePath,
  basePath = "",
  pageVariant = "product",
}: ProductClientProps) {
  const { width } = useWindowSize();
  const [filterData, setFilterData] = useState<FilterState>({
    showModelFilter: false,
    modelFilterType: "All Models",
    showSeriesFilter: false,
    seriesFilterType: "All Series",
  });
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [currentIndustrySlide, setCurrentIndustrySlide] = useState<number>(0);
  const modelFilterRef = useRef<HTMLDivElement>(null);
  const seriesFilterRef = useRef<HTMLDivElement>(null);

  useOutsideClick(modelFilterRef as React.RefObject<HTMLElement>, () => {
    if (filterData.showModelFilter) {
      setFilterData((prev) => ({ ...prev, showModelFilter: false }));
    }
  });

  useOutsideClick(seriesFilterRef as React.RefObject<HTMLElement>, () => {
    if (filterData.showSeriesFilter) {
      setFilterData((prev) => ({ ...prev, showSeriesFilter: false }));
    }
  });

  const [sliderRef, instanceRef] = useKeenSlider({
    slides: {
      perView: width && width > SCREENS.MOBILE_LANDSCAPE ? 4.5 : 2.2,
      spacing: 16,
    },
    slideChanged(slider) {
      if (slider.track?.details?.rel != null) {
        setCurrentSlide(slider.track.details.rel);
      }
    },
    created(slider) {
      if (slider.track?.details?.rel != null) {
        setCurrentSlide(slider.track.details.rel);
      }
    },
  });

  const [relatedSliderRef, relatedInstanceRef] = useKeenSlider({
    slides: {
      perView: width && width > SCREENS.MOBILE_LANDSCAPE ? 4.5 : 2.2,
      spacing: 16,
    },
    slideChanged(slider) {
      if (slider.track?.details?.rel != null) {
        setCurrentIndustrySlide(slider.track.details.rel);
      }
    },
    created(slider) {
      if (slider.track?.details?.rel != null) {
        setCurrentIndustrySlide(slider.track.details.rel);
      }
    },
  });

  const perViewValue = (() => {
    const slidesOption = instanceRef.current?.options?.slides;
    if (typeof slidesOption === "number") {
      return slidesOption;
    }
    if (
      typeof slidesOption === "object" &&
      slidesOption !== null &&
      "perView" in slidesOption
    ) {
      return slidesOption.perView || 0;
    }
    return 0;
  })();

  const filteredProducts = useMemo(() => {
    if (!products || !productId) return products;
    return products.filter((prod) => prod.id !== Number(productId));
  }, [products, productId]);

  const filteredIndustries = useMemo(() => {
    if (!industries || !industryId) return industries;
    return industries.filter((industry) => industry.id !== Number(industryId));
  }, [industries, industryId]);

  const maxSlide =
    (instanceRef.current?.track?.details?.slides.length || 0) -
    Number(perViewValue);

  const maxIndustrySlide =
    (relatedInstanceRef.current?.track?.details?.slides.length || 0) -
    Number(perViewValue);

  const productImage =
    productObj?.thumbnail || productObj?.generalImage || "";
  const productImageAlt =
    productObj?.thumbnailAltText ||
    productObj?.generalImageAltText ||
    `${productObj?.title || "Product"} image`;

  const availableSeries = useMemo(() => {
    if (!productObj?.models) return ["All Series"];
    const series = Array.from(
      new Set(productObj.models.map((model: Model) => model.series))
    );
    return ["All Series", ...series.map((seriesName) => `${seriesName} Series`)];
  }, [productObj?.models]);

  const filteredModels = useMemo(() => {
    if (!productObj?.models) return [];

    let filtered = productObj.models;

    if (filterData.seriesFilterType !== "All Series") {
      const seriesName = filterData.seriesFilterType.replace(" Series", "");
      filtered = filtered.filter((model: Model) => model.series === seriesName);
    }

    if (filterData.modelFilterType !== "All Models") {
      const modelType = filterData.modelFilterType.toLowerCase();
      filtered = filtered.filter(
        (model: Model) => model.machineType.toLowerCase() === modelType
      );
    }

    return filtered;
  }, [
    productObj?.models,
    filterData.seriesFilterType,
    filterData.modelFilterType,
  ]);

  const containerClassName =
    pageVariant === "industry"
      ? `${styles.productContainer} ${styles.industryProductContainer}`
      : styles.productContainer;

  return (
    <div className={containerClassName}>
      <div className={styles.productDetails}>
        <div className={styles.productContent}>
          <div className={styles.productInfo}>
            <h2 className={styles.productHeading}>
              {productObj?.title || "-"}
            </h2>
            <p className={styles.productDescription}>
              {productObj?.description ||
                "No description available for this product"}
            </p>
          </div>
          <div className={styles.industryTags}>
            {productObj?.industries?.map((tag: string, idx: number) => (
              <div
                className={styles.eachIndustry}
                key={`industry tag -- ${idx}`}
              >
                <p>{tag || "-"}</p>
              </div>
            ))}
          </div>
        </div>
        {productImage && (
          <div className={styles.productImageWrapper}>
            <Image
              src={productImage}
              alt={productImageAlt}
              width={560}
              height={360}
              className={styles.productImage}
              sizes="(max-width: 767px) 100vw, 36vw"
              priority
            />
          </div>
        )}
      </div>

      <div className={styles.modelContainerHeading}>
        <div className={styles.headingSection}>
          <h4 className={styles.headingText}>Model</h4>
        </div>
        <div className={styles.filterSeries}>
          <div
            className={styles.headingSelect}
            onClick={() =>
              setFilterData({
                ...filterData,
                showSeriesFilter: !filterData.showSeriesFilter,
              })
            }
          >
            <p className={styles.selectText}>{filterData.seriesFilterType}</p>
            <Image
              src={ICONS.BLACK_DROPDOWN}
              alt="black dropdown arrow"
              width={15}
              height={15}
            />
          </div>
          {filterData.showSeriesFilter && (
            <div ref={seriesFilterRef} className={styles.seriesFilterWrapper}>
              <FilterOptions
                setFilterData={setFilterData}
                isSeriesFilter
                filterOptions={availableSeries}
              />
            </div>
          )}
          <div
            className={styles.headingSelect}
            onClick={() =>
              setFilterData({
                ...filterData,
                showModelFilter: !filterData.showModelFilter,
              })
            }
          >
            <p className={styles.selectText}>{filterData.modelFilterType}</p>
            <Image
              src={ICONS.BLACK_DROPDOWN}
              alt="black dropdown arrow"
              width={15}
              height={15}
            />
          </div>
          {filterData.showModelFilter && (
            <div ref={modelFilterRef} className={styles.modelFilterWrapper}>
              <FilterOptions
                setFilterData={setFilterData}
                filterOptions={MODEL_FILTER}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.modelContainer}>
        {filteredModels.length > 0 ? (
          filteredModels.map((model: Model, idx: number) =>
            width && width > SCREENS.TAB_MINI ? (
              <ModelCard
                key={idx}
                model={model}
                isProductPage
                productName={productObj?.title}
                basePath={modelBasePath}
              />
            ) : (
              <ModelResponsiveCard
                key={idx}
                model={model}
                isProductPage
                productName={productObj?.title}
                basePath={modelBasePath}
              />
            )
          )
        ) : (
          <div className={styles.noModelsMessage}>
            <p>No models found for the selected filters.</p>
          </div>
        )}
      </div>

      <div className={styles.sliderWrapper}>
        <div className={styles.carouselHeader}>
          <h2 className={styles.caraouselHeading}>More Products</h2>
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
        {filteredProducts?.length > 0 && (
          <div
            ref={sliderRef}
            className={`${styles.industryCarousel} keen-slider`}
          >
            {filteredProducts.map((product: ActiveProduct) => (
              <Link
                key={product.id}
                href={`${basePath}/products/${productSlug(product.title ?? "")}`}
                className="keen-slider__slide"
              >
                <ProductCard
                  title={product.title}
                  imageSrc={product.thumbnail}
                  altText={product.thumbnailAltText}
                  isProductPage
                />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className={styles.sliderWrapper}>
        <div className={styles.carouselHeader}>
          <h2 className={styles.caraouselHeading}>More Industries</h2>
          <div className={styles.navButtons}>
            <button
              className={`${styles.arrowButton} ${
                currentIndustrySlide === 0 ? styles.disabled : ""
              }`}
              onClick={() => relatedInstanceRef.current?.prev()}
              disabled={currentIndustrySlide === 0}
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
                currentIndustrySlide >= maxIndustrySlide ? styles.disabled : ""
              }`}
              onClick={() => relatedInstanceRef.current?.next()}
              disabled={currentIndustrySlide >= maxIndustrySlide}
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
        {filteredIndustries?.length > 0 && (
          <div
            ref={relatedSliderRef}
            className={`${styles.industryCarousel} keen-slider`}
          >
            {filteredIndustries.map(
              (industry: ActiveIndustry, index: number) => (
                <IndustryCard
                  key={industry.id}
                  title={industry.title}
                  imageSrc={industry.thumbnail}
                  altText={industry.thumbnailAltText}
                  isIndustryPage
                  id={industry.id}
                  isLastCard={index === filteredIndustries.length - 1}
                  basePath={basePath}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
