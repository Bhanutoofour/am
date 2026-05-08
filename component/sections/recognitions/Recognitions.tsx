"use client";

import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import RecognitionCard from "@/component/molecules/recognitionCard/RecognitionCard";
import Image from "next/image";
import { ICONS, IMAGES } from "@/constants/Images/images";
import { SCREENS } from "@/constants";
import useWindowSize from "@/hooks/useWindowSize";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export interface RecognitionData {
  imageSrc: string;
  title: string;
  logo?: string; // optional logo like startup india
}

export interface RecognitionsProps {
  title: string;
  data: RecognitionData[];
  conatinerClassName?: string;
}

const Recognitions: React.FC<RecognitionsProps> = ({
  title,
  data,
  conatinerClassName,
}) => {
  const { width } = useWindowSize();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSlide2, setCurrentSlide2] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const images = [
    IMAGES.RECOGNITION.AWARDS.AWARD_07,
    IMAGES.RECOGNITION.AWARDS.AWARD_08,
  ];

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1, // always 2 slides visible like figma
      spacing: 10,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });
  const [sliderRef2, instanceRef2] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: width && width > SCREENS.MOBILE_LANDSCAPE ? 3 : 2,
      spacing: 18,
    },
    slideChanged(slider) {
      setCurrentSlide2(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  useEffect(() => {
    if (!data.length || !instanceRef2.current) return;

    const interval = setInterval(() => {
      instanceRef2.current?.next();
    }, 2000);

    return () => clearInterval(interval);
  }, [data.length, instanceRef2.current]);

  if (title !== "Awards") return null;

  return (
    <section className={`${styles.recognitionContainer} ${conatinerClassName}`}>
      <div className={styles.awardsTitle}>
        <p className={styles.awards}>A W A R D S</p>
        <div className={styles.recognized}>
          <Image
            src={ICONS.RIGHT_LEAF}
            alt="awards icon"
            width={46}
            height={95}
          />
          <h2 className={styles.titleTwo}>
            We’ve Been Recognized for Disrupting the Industrial Game
          </h2>
          <Image
            src={ICONS.LEFT_LEAF}
            alt="awards icon"
            width={46}
            height={95}
          />
        </div>
        <p className={styles.titleThree}>
          From national startup honors to innovation awards, our journey is
          backed by the best celebrating bold ideas, breakthrough impact, and
          entrepreneurial excellence.
        </p>
      </div>
      <div className={styles.carouselSect}>
        <div className={styles.awardImageColumn}>
          <div ref={sliderRef} className={`keen-slider ${styles.carousel}`}>
            {images.map((src, idx) => (
              <div
                key={idx}
                className={`keen-slider__slide ${styles.cardWrapper}`}
              >
                <Image
                  src={src}
                  alt="Awards"
                  width={width && width > SCREENS.MOBILE_LANDSCAPE ? 704 : 353}
                  height={width && width > SCREENS.MOBILE_LANDSCAPE ? 344 : 178}
                  className={styles.awardImage}
                />
              </div>
            ))}
          </div>
          {loaded && instanceRef.current && (
            <div className={styles.dots}>
              {[
                ...Array(
                  instanceRef.current.track.details.slides.length,
                ).keys(),
              ].map((idx) => (
                <button
                  key={idx}
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                  className={`${styles.dot} ${
                    currentSlide === idx ? styles.active : ""
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        <div className={styles.awardCardsColumn}>
          <div
            ref={sliderRef2}
            className={`keen-slider ${styles.carousel} ${styles.awardCardsCarousel}`}
          >
            {data.map((recognition, idx) => (
              <div
                key={idx}
                className={`keen-slider__slide ${styles.cardWrapper}`}
              >
                <RecognitionCard
                  imageSrc={recognition.imageSrc}
                  title={recognition.title}
                />
              </div>
            ))}
          </div>
          {loaded && instanceRef2.current && (
            <div className={styles.dots}>
              {[
                ...Array(
                  instanceRef2.current.track.details.slides.length,
                ).keys(),
              ].map((idx) => (
                <button
                  key={idx}
                  onClick={() => instanceRef2.current?.moveToIdx(idx)}
                  className={`${styles.dot} ${
                    currentSlide2 === idx ? styles.active : ""
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Recognitions;
