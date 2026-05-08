import React from "react";
import styles from "./modelCard.module.scss";
import Image from "next/image";
import Link from "next/link";
import {
  modelSlug as buildModelSlug,
  modelNumberSlug,
  titleToSlug,
} from "@/utils/slug";

interface ModelState {
  model: Model;
  isProductPage?: boolean;
  productName?: string;
  /** e.g. `/industries/ofc/chain-trencher` → model link adds `/{modelNumberSlug}` only. */
  basePath?: string;
}

const ModelCard: React.FC<ModelState> = ({
  model,
  isProductPage,
  productName,
  basePath,
}) => {
  const slug = buildModelSlug(
    (productName || model?.productName) ?? "",
    model?.modelTitle ?? "",
    model?.modelNumber ?? "",
  );
  const numberSlug = modelNumberSlug(model?.modelNumber ?? "");
  const productSeg = titleToSlug((productName || model?.productName) ?? "");
  const productsPathHref =
    productSeg && numberSlug
      ? `/products/${productSeg}/${numberSlug}`
      : `/product/${slug}`;

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.cardContent}>
        <div className={styles.imageSection}>
          <Image
            src={model?.thumbnail}
            alt={model?.thumbnailAltText || "Model thumbnail image"}
            width={300}
            height={150}
            className={styles.productImage}
          />
        </div>
        <div className={styles.detailsSection}>
          <p className={styles.seriesTitle}>{model?.series || "-"} Series</p>
          <div className={styles.titleArea}>
            <p className={styles.modelTitle}>{model?.modelNumber || "-"}</p>
            <p className={styles.subtitle}>
              {model?.modelTitle} | {model?.machineType}
            </p>
          </div>
          <div className={styles.specsRow}>
            {model?.keyFeatures &&
              model?.keyFeatures?.length > 0 &&
              model?.keyFeatures
                ?.slice(0, isProductPage ? 4 : 7)
                .map((feature, idx) => (
                  <div className={styles.specItem} key={idx}>
                    <p className={styles.specLabel}>{feature?.name}</p>
                    <p className={styles.specValue}>{feature?.value}</p>
                  </div>
                ))}
          </div>
        </div>
        <Link
          href={basePath ? `${basePath}/${numberSlug}` : productsPathHref}
          className={styles.ctaSection}
        >
          <button className={styles.viewDetailsBtn}>VIEW DETAILS</button>
        </Link>
      </div>
    </div>
  );
};

export default ModelCard;
