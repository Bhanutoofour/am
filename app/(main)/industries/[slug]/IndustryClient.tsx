"use client";
import styles from "./industry.module.scss";
import Image from "next/image";
import { ICONS } from "@/constants/Images/images";
import ProductCard from "@/component/molecules/productCard/ProductCard";
import "react-loading-skeleton/dist/skeleton.css";
import { useMemo, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import IndustryCard from "@/component/molecules/industryCard/IndustryCard";
import useWindowSize from "@/hooks/useWindowSize";
import { SCREENS } from "@/constants";
import Link from "next/link";
import BrochureDownloadModal from "@/component/GetQuoteModal/BrochureDownloadModal";
import { titleToSlug } from "@/utils/slug";

export default function IndustryClient({
  industryData,
  industries,
  industryId,
  basePath = "",
}: {
  industryData: IndustryDataType | null;
  industries: ActiveIndustry[];
  industryId: number;
  basePath?: string;
}) {
  const { width } = useWindowSize();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);

  // Slider config for more industry
  const [sliderRef, instanceRef] = useKeenSlider({
    slides: {
      perView: width && width > SCREENS.MOBILE_PORTRAIT ? 4.5 : 2.2,
      spacing: width && width > SCREENS.MOBILE_PORTRAIT ? 16 : 10,
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

  // Slider config for banner images
  const [bannerSliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: (industryData?.bannerImages?.length || 0) > 1,
      slides: {
        perView: 1,
      },
    },
    [
      (slider) => {
        // Only enable auto-scroll if there are multiple banner images
        if ((industryData?.bannerImages?.length || 0) <= 1) return;

        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;

        function clearNextTimeout() {
          clearTimeout(timeout);
        }

        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 3000);
        }

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });

        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  // Memoize filtered industries
  const filteredIndustries = useMemo(() => {
    if (!industries || !industryId) return industries;
    return industries.filter((industry) => industry.id !== Number(industryId));
  }, [industries, industryId]);

  const maxSlide =
    (instanceRef.current?.track?.details?.slides.length || 0) -
    Number(perViewValue);
  return (
    <section className={styles.industryHome}>
      {industryData && industryData?.bannerImages?.length > 1 ? (
        <div
          ref={bannerSliderRef}
          className={`keen-slider ${styles.bannerSlider}`}
          style={{ width: "100%" }}
        >
          {industryData?.bannerImages.map((item: any, index: number) => {
            // Handle both old string format and new object format
            const imageUrl = typeof item === "object" ? item.imageUrl : item;
            const altText =
              typeof item === "object" ? item.altText : `Banner ${index + 1}`;

            return (
              <div
                key={index}
                className={`keen-slider__slide ${styles.bannerSlide}`}
              >
                <Image
                  src={imageUrl}
                  alt={altText}
                  width={1200}
                  height={440}
                  className={styles.bannerImage}
                />
                <div className={styles.gradientOverlay}></div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className={styles.imageContainer}
          style={{
            backgroundImage: `url(${
              industryData?.bannerImages[0]?.imageUrl || ""
            })`,
          }}
        ></div>
      )}

      <div className={styles.industryData}>
        <div className={styles.industryInfo}>
          <h2 className={styles.industryHeading}>
            {industryData?.title || "-"}
          </h2>
          <p className={styles.industryDescription}>
            {industryData?.description || "--"}
          </p>
        </div>
        <button
          className={styles.brochureButton}
          disabled={!industryData?.brochure}
          onClick={() => setShowModal(true)}
        >
          <Image
            src={ICONS.DOWNLOAD_ICON_WHITE}
            alt="Download brochure"
            width={20}
            height={20}
          />
          BROCHURE
        </button>
      </div>

      <div className={styles.productHolder}>
        {industryData?.products && industryData?.products?.length > 0 ? (
          industryData?.products.map((product: any) => (
            <Link
              key={product.id}
              href={`${basePath}/industries/${titleToSlug(industryData?.title ?? "")}/${titleToSlug(product?.title ?? "")}`}
            >
              <ProductCard
                title={product.title}
                imageSrc={product.thumbnail}
                altText={product.thumbnailAltText || product.title || "Product"}
                isProductPage
              />
            </Link>
          ))
        ) : (
          <div className={styles.industryEmptyState}>
            <p>
              We're gearing up to launch products in this category shortly. Stay
              tuned!
            </p>
          </div>
        )}
      </div>

      <div className={styles.sliderWrapper}>
        <div className={styles.carouselHeader}>
          <h2 className={styles.caraouselHeading}>More Industries</h2>
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
        {filteredIndustries && filteredIndustries.length > 0 && (
          <div
            ref={sliderRef}
            className={`${styles.industryCarousel} keen-slider`}
          >
            {filteredIndustries.map(
              (industry: ActiveIndustry, index: number) => (
                <IndustryCard
                  key={industry?.id}
                  title={industry?.title}
                  imageSrc={industry?.thumbnail}
                  id={industry?.id}
                  isIndustryPage
                  isLastCard={index === filteredIndustries.length - 1}
                  altText={industry?.thumbnailAltText}
                  basePath={basePath}
                />
              )
            )}
          </div>
        )}
      </div>
      {showModal && (
        <BrochureDownloadModal
          industry={industryData?.title}
          setShowModal={setShowModal}
          downloadUrl={industryData?.brochure || ""}
        />
      )}
    </section>
  );
}
