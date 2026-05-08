import Image from "next/image";
import styles from "./productStyle.module.scss";
import useWindowSize from "@/hooks/useWindowSize";
import { SCREENS } from "@/constants";

interface ProductCardProps {
  title: string;
  imageSrc: string;
  altText?: string;
  isProductPage?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  imageSrc,
  altText,
  isProductPage,
}) => {
  const { width } = useWindowSize();
  return (
    <div
      className={`${styles.productCard} ${
        isProductPage && styles.productCardGrey
      } keen-slider__slide`}
    >
      <Image
        src={imageSrc}
        alt={altText || title}
        width={width && width > SCREENS.MOBILE_LANDSCAPE ? 245 : 176}
        height={width && width > SCREENS.MOBILE_LANDSCAPE ? 272 : 186}
        className={styles.productImage}
      />
      <div className={styles.productDetail}>
        <h2 className={styles.cardTitle}>{title}</h2>
        <div className={styles.hoverArrow}>
          <Image
            src={"/icons/arrow_black_right.svg"}
            alt="arrow"
            width={28}
            height={17}
            className={styles.arrow}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
