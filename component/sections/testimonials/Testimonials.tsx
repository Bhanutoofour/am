// testimonials/TestimonialCard.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./styles.module.scss";
import { useKeenSlider } from "keen-slider/react";
import { ICONS } from "@/constants/Images/images";
import useWindowSize from "@/hooks/useWindowSize";
import { SCREENS } from "@/constants";

interface TestimonialCardProps {
  quote: string;
  author: string;
  location: string;
}

interface TestimonialProps {
  testimonials: Testimonial[];
  clients: clientsType[];
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  location,
}) => {
  function extractAndCapitalizeFirstLetter(name: string): string {
    if (!name) return "";
    const firstChar = name.trim().charAt(0);
    return firstChar ? firstChar.toUpperCase() : "";
  }

  return (
    <div className={`${styles.testimonialCard} keen-slider__slide`}>
      <Image
        src="/icons/quote.svg"
        alt={author}
        width={40}
        height={32}
        className={styles.quoteIcon}
      />
      <p className={styles.quote}>{quote}</p>
      <div className={styles.authorSection}>
        <div className={styles.avatar}>
          {extractAndCapitalizeFirstLetter(author)}
        </div>
        <div>
          <p className={styles.author}>{author}</p>
          <p className={styles.location}>{location}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials: React.FC<TestimonialProps> = ({
  testimonials,
  clients,
}) => {
  const { width } = useWindowSize();
  const [currentSlide, setCurrentSlide] = useState(1);
  const [sliderRef, instanceRef] = useKeenSlider({
    slides: {
      perView:
        width && width > SCREENS.TAB_LANDSCAPE
          ? 3.9
          : width && width > SCREENS.TAB_PORTRAIT
          ? 3
          : width && width > SCREENS.MOBILE_LANDSCAPE
          ? 2
          : 1,
      spacing: 16,
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

  // const perView = instanceRef.current?.options?.slides?.perView || 0;
  const totalSlides = instanceRef.current?.track?.details?.slides.length || 0;
  const maxSlide = totalSlides - Number(perViewValue);
  const stripPosition = maxSlide > 0 ? (currentSlide / maxSlide) * 80 : 0;

  return (
    <>
      <section className={styles.testimonialSection}>
        <div className={styles.content}>
          <div className={styles.testimonialHeadingContainer}>
            <div style={{ width: "100%" }}>
              <h2 className={styles.sectionTitle}>Customer Testimonial</h2>
              <p className={styles.sectionSubTitle}>
                Autocracy Machinery is trusted by fastest growth companies the
                focus on <br /> financial management Here`s what they have to
                say about us.
              </p>
            </div>
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
                  alt="left"
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
                  alt="right"
                  width={15}
                  height={15}
                />
              </button>
            </div>
          </div>

          <div
            ref={sliderRef}
            className={`${styles.testimonialCarousel} keen-slider`}
          >
            {testimonials.map((item, index) => (
              <TestimonialCard key={index} {...item} />
            ))}
          </div>

          {/* slider */}
          {width && width > SCREENS.MOBILE_LANDSCAPE ? (
            <div className={styles.slidingStripContainer}>
              <div
                className={styles.slidingStrip}
                style={{ left: `${stripPosition}%` }}
              ></div>
            </div>
          ) : (
            <div className={styles.dots}>
              {testimonials &&
                testimonials.length > 0 &&
                testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => instanceRef.current?.moveToIdx(idx)}
                    style={{
                      width: `${currentSlide === idx ? "1rem" : ".625rem"}`,
                      height: `${currentSlide === idx ? "1rem" : ".625rem"}`,
                      backgroundColor: `${
                        currentSlide === idx ? "#111111" : "#1111111A"
                      }`,
                      zIndex: 9,
                    }}
                  >
                    {" "}
                  </button>
                ))}
            </div>
          )}
        </div>
      </section>
      <div className={styles.happyClient}>
        <p className={styles.happyHeader}>Happy Clients</p>
        <div className={styles.clientImageBox}>
          {clients.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`client - ${idx}`}
              width={idx === 4 ? 240 : idx === 3 ? 220 : 170}
              height={70}
              className={styles.clientLogo}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Testimonials;
