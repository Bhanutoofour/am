import React from "react";
import styles from "./mediaStyles.module.scss";
import Image from "next/image";
import { limitString } from "@/utils/helper";

interface MediaDataType {
  title: string;
  desc: string;
  imageSrc: string;
  link: string;
  width: number;
  height: number;
}

interface MediaProp {
  data: MediaDataType[];
}

interface MediaCardProp {
  title: string;
  desc: string;
  imageSrc: string;
  link: string;
  imageWidth: number;
  imageHeight: number;
}

const MediaCard: React.FC<MediaCardProp> = ({
  title,
  desc,
  link,
  imageSrc,
  imageWidth,
  imageHeight,
}) => {
  return (
    <div className={styles.mediaCard}>
      {imageSrc && (
        <div className={styles.mediaCardLogo}>
          <Image
            src={imageSrc}
            alt={"media logo"}
            width={imageWidth || 100}
            height={imageHeight || 40}
          />
        </div>
      )}
      <h2 className={styles.mediaCardTitle}>{title}</h2>
      <p className={styles.mediaCardDesc} title={desc}>
        {limitString(desc, 80)}
      </p>
      <a
        className={styles.mediaCardLink}
        href={link}
        target="_blank"
        rel="noopener noreferrer"
      >
        Read More
      </a>
    </div>
  );
};

const Media: React.FC<MediaProp> = ({ data }) => {
  const duplicatedData = [...data, ...data];

  return (
    <div className={styles.mediaContainer}>
      <div className={styles.mediaTitle}>
        <h2 className={styles.title}>Our Story,</h2>
        <h2 className={styles.title}>Through Their Words</h2>
      </div>

      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          {duplicatedData.map((media, idx) => (
            <MediaCard
              key={idx}
              title={media.title}
              desc={media.desc}
              imageSrc={media.imageSrc}
              link={media.link}
              imageHeight={media.height}
              imageWidth={media.width}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Media;
