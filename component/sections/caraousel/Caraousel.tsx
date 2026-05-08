"use client";

import styles from "./styles.module.scss";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/component/molecules/button/Button";
import { ICONS } from "@/constants/Images/images";
import GetQuoteModal from "@/component/GetQuoteModal/GetQuoteModal";

interface CaraouselProps {
  heroData: HeroSection[];
}

const Caraousel: React.FC<CaraouselProps> = ({ heroData }) => {
  const [opacities, setOpacities] = useState<number[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    heroData.length
      ? {
          loop: true,
          detailsChanged(s) {
            if (!s.track.details) return;
            const new_opacities = s.track.details.slides.map(
              (slide) => slide.portion
            );
            setOpacities(new_opacities);
          },
          initial: 2,
          slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel);
          },
        }
      : undefined
  );

  useEffect(() => {
    if (heroData.length > 0) {
      setCurrentSlide(0);
      setOpacities(Array(heroData.length).fill(1));
      instanceRef.current?.moveToIdx?.(0);
    }
  }, [heroData.length]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (!heroData.length) return;
    const interval = setInterval(() => {
      const nextIdx = (currentSlide + 1) % heroData.length;
      instanceRef.current?.moveToIdx?.(nextIdx);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroData.length, currentSlide]);

  if (!heroData || heroData.length === 0) {
    return null;
  }

  const renderHeroTitle = (title: string) => {
    const allInOnePrefix = "All In One";

    if (!title.startsWith(allInOnePrefix)) {
      const hyphenParts = title.split(/\s+-\s+/);

      if (hyphenParts.length === 2) {
        return (
          <>
            <span className={styles.titleLine}>{hyphenParts[0].trim()}</span>
            <span className={styles.titleLine}>- {hyphenParts[1].trim()}</span>
          </>
        );
      }

      const ampersandIndex = title.indexOf("&");

      if (ampersandIndex > -1) {
        return (
          <>
            <span className={styles.titleLine}>
              {title.slice(0, ampersandIndex + 1).trim()}
            </span>
            <span className={styles.titleLine}>
              {title.slice(ampersandIndex + 1).trim()}
            </span>
          </>
        );
      }

      return title;
    }

    return (
      <>
        <span className={styles.titleLine}>{allInOnePrefix}</span>
        <span className={`${styles.titleLine} ${styles.titleLineSecond}`}>
          {title.replace(allInOnePrefix, "").trim()}
        </span>
      </>
    );
  };

  return (
    <section className={styles.caraousel}>
      {/* Left Arrow */}
      <button
        onClick={() => instanceRef.current?.moveToIdx(currentSlide - 1)}
        className={styles.leftButton}
      >
        ←
      </button>
      {/* Carousel Content */}
      <div
        ref={sliderRef}
        className="keen-slider fader"
        style={{ width: "100%", height: "100%" }}
      >
        {heroData.map((src, idx) => (
          <div
            key={idx}
            className={`keen-slider__slide fader__slide ${styles.caraouselContainer}`}
          >
              <div
                style={{
                  opacity: opacities[idx] ?? 1,
                  position: "relative",
                  width: "100%",
                  height: "100%",
                }}
              >
                <img
                  src={src.image}
                  alt={src.altText || `Hero image ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center center",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient( 180deg, rgba(1, 6, 10, 0) 43.53%, #01060a 142.21%)",
                  }}
                />
                {currentSlide === idx && (
                  <div className={styles.caraouselContent}>
                    {src.title && (
                      <p className={styles.title}>{renderHeroTitle(src.title)}</p>
                    )}
                    {src.description && (
                      <p className={styles.description}>{src.description}</p>
                    )}
                    <Button
                      title="Get a quote"
                      bgColor="#F9C300"
                      buttonFontColor="#0A0A0B"
                      buttonBorder=".0625rem solid #F9C300"
                      responsiveClass={styles.heroButton}
                      handleClick={() => setShowModal(true)}
                    />
                  </div>
                )}
              </div>
              {/* logos  */}
              <div className={styles.certificates}>
                <Image
                  src={ICONS.MAD_IN_INDIA}
                  alt="ISO certified"
                  width={176}
                  height={53}
                />
              </div>
          </div>
        ))}
      </div>
      {/* Right Arrow */}
      <button
        onClick={() => instanceRef.current?.moveToIdx(currentSlide + 1)}
        className={styles.rightButton}
      >
        →
      </button>
      {/* Dots */}
      <div className={styles.dots}>
        {heroData &&
          heroData.length > 0 &&
          heroData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              style={{
                width: `${currentSlide === idx ? "1rem" : ".625rem"}`,
                height: `${currentSlide === idx ? "1rem" : ".625rem"}`,
                backgroundColor: `${
                  currentSlide === idx ? "#FFFFFF" : "#FFFFFF80"
                }`,
                zIndex: 9,
              }}
            >
              {" "}
            </button>
          ))}
      </div>
      {showModal && (
        <GetQuoteModal showModal={showModal} setShowModal={setShowModal} />
      )}
    </section>
  );
};

export default Caraousel;
