import React from "react";
import styles from "./modelResStyles.module.scss";
import Image from "next/image";
import Link from "next/link";
import { modelSlug, modelNumberSlug, titleToSlug } from "@/utils/slug";

interface ModelState {
  model: Model;
  isProductPage?: boolean;
  productName?: string;
  basePath?: string;
}

const ModelResponsiveCard: React.FC<ModelState> = ({
  model,
  productName,
  basePath,
}) => {
  const keyFeatures = Array.isArray(model?.keyFeatures)
    ? model.keyFeatures
    : [];
  const slug = modelSlug(
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
  const detailHref = basePath ? `${basePath}/${numberSlug}` : productsPathHref;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Link href={detailHref} className={styles.titleLink}>
          <h2 className={styles.modelName}>{model.modelNumber || "-"}</h2>
        </Link>
        {/* <span className={styles.seriesTag}>{model?.series || "-"} Series</span> */}
      </div>

      <p className={styles.subtitle}>
        {model?.modelTitle} | {model?.machineType}
      </p>

      <Link
        href={detailHref}
        className={styles.imageWrapper}
        aria-label={`View details for ${model?.modelNumber || "model"}`}
      >
        <Image
          src={model.thumbnail}
          alt={model.thumbnailAltText || "Model thumbnail image"}
          width={500}
          height={250}
          className={styles.image}
        />
      </Link>

      <div className={styles.trenchWidths}>
        {keyFeatures.length > 0 &&
          keyFeatures.map((feat, index) => (
            <div key={index} className={styles.trenchWidth}>
              <span className={styles.label}>{feat?.name}</span>
              <span className={styles.value}>{feat?.value}</span>
            </div>
          ))}
      </div>
      <Link href={detailHref} className={styles.ctaSection}>
        <button className={styles.ctaButton}>View Details</button>
      </Link>
    </div>
  );
};

export default ModelResponsiveCard;
