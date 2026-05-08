import { useRecordContext } from "react-admin";
import styles from "./BannerImagesField.module.scss";

interface BannerImagesFieldProps {
  source?: string;
  label?: string;
}

export const BannerImagesField = ({
  source = "bannerImages",
  label,
}: BannerImagesFieldProps) => {
  const record = useRecordContext();
  if (!record) return null;

  const bannerImages = record[source] || [];

  return (
    <div className={styles.bannerImages}>
      {bannerImages.slice(0, 4).map((item: any, index: number) => {
        const imageUrl = typeof item === "object" ? item.imageUrl : item;
        const altText =
          typeof item === "object" ? item.altText : `Banner ${index + 1}`;

        return (
          <div key={index} className={styles.imageWrapper}>
            <img src={imageUrl} alt={altText} className={styles.image} />
          </div>
        );
      })}
    </div>
  );
};
