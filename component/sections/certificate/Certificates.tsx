"use client";

import React, { useEffect, useState } from "react";
import styles from "./certificate.module.scss";
import RecognitionCard from "@/component/molecules/recognitionCard/RecognitionCard";
import Image from "next/image";
import useWindowSize from "@/hooks/useWindowSize";
import { SCREENS } from "@/constants";

export interface CertificatesProps {
  data: RecognitionData[];
}

const Certificates: React.FC<CertificatesProps> = ({ data }) => {
  //   const [marqueeItems, setMarqueeItems] = useState<RecognitionData[]>([]);
  const [isScrollable, setIsScrollable] = useState<boolean>(false);
  const { width } = useWindowSize();

  return (
    <section className={styles.certificateContainer}>
      <Image
        src="/icons/section_corner_top_right_down.svg"
        alt="section-corner"
        width={150}
        height={150}
        className={styles.sectionCorner}
      />
      <p className={styles.mainHeading}>Our Certifications</p>

      <div className={styles.certificateMarquee}>
        <div className={styles.certificateMarqueeContent}>
          {data.map((recognition, idx) => (
            <div key={idx} className={styles.cardWrapper}>
              <RecognitionCard
                imageSrc={recognition.imageSrc}
                title={recognition.title}
                isLastItem={idx === data.length - 1}
                isResponsive={
                  (width && width < SCREENS.MOBILE_LANDSCAPE) || false
                }
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
