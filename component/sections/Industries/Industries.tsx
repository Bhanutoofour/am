"use client";

import React, { useState } from "react";
import styles from "./industries.module.scss";
import Image from "next/image";
import Button from "@/component/molecules/button/Button";
import useWindowSize from "@/hooks/useWindowSize";
import { SCREENS } from "@/constants";
import IndustryCard from "@/component/molecules/industryCard/IndustryCard";

interface IndustriesProps {
  industries: ActiveIndustry[];
}

const Industries: React.FC<IndustriesProps> = ({ industries }) => {
  const { width } = useWindowSize();
  const [viewAll, setViewAll] = useState<boolean>(false);

  let data: ActiveIndustry[] = [];
  if (width && industries.length) {
    if (viewAll) {
      data = industries;
    } else {
      data =
        width > SCREENS.MOBILE_PORTRAIT
          ? industries.slice(0, 8)
          : industries.slice(0, 6);
    }
  }

  return (
    <section className={styles.industrySection}>
      <Image
        src={"/icons/section_corner_bottom_right_up.svg"}
        alt="section-corner"
        width={150}
        height={150}
        className={styles.sectionCorner}
      />
      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>Choose Your Industry</h2>

        <div className={styles.industryGrid}>
          {data && data.length > 0 ? (
            data.map((item, id) => (
              <IndustryCard
                title={item?.title}
                id={item?.id}
                imageSrc={item?.thumbnail || ""}
                altText={item?.thumbnailAltText}
                key={item?.id || id}
              />
            ))
          ) : (
            <p>No industries available.</p>
          )}
        </div>

        {width && width > SCREENS.MOBILE_PORTRAIT ? industries.length > 8 : industries.length > 6 && <Button
          title={`VIEW ${viewAll ? "LESS" : "ALL"} INDUSTRIES`}
          bgColor="#01060A"
          buttonFontColor="#F9C300"
          buttonBorder="1px solid #0A0A0B"
          handleClick={() => setViewAll(!viewAll)}
        />}
      </div>
    </section>
  );
};

export default Industries;
