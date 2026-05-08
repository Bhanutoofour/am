import Image from "next/image";
import styles from "./industryStyle.module.scss";
import Link from "next/link";
import { titleToSlug } from "@/utils/slug";

interface IndustryCardProps {
  title: string;
  imageSrc: string;
  id: number;
  isIndustryPage?: boolean;
  isLastCard?: boolean;
  altText?: string;
  basePath?: string;
}

const IndustryCard: React.FC<IndustryCardProps> = ({
  title,
  imageSrc,
  id,
  isIndustryPage = false,
  isLastCard = false,
  altText,
  basePath = "",
}) => {
  return (
    <Link
      href={`${basePath}/industries/${titleToSlug(title)}`}
      className={isIndustryPage ? "keen-slider__slide" : undefined}
      style={{ width: "100%" }}
    >
      <div
        className={styles.industryCard}
        style={
          isLastCard
            ? {
                marginRight: "0.3rem",
              }
            : {}
        }
      >
        <Image
          src={imageSrc?.trim()}
          alt={altText || title}
          width={245}
          height={272}
          className={styles.industryImage}
        />
        <div className={styles.overlay} />
        <div className={styles.industryDetail}>
          <p className={styles.cardTitle}>{title}</p>
          <div className={styles.hoverArrow}>
            <Image
              src="/icons/arrow_black_right.svg"
              alt="arrow"
              width={28}
              height={17}
              className={styles.arrow}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default IndustryCard;
