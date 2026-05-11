"use client";
import styles from "./productStyles.module.scss";
import { ICONS } from "@/constants/Images/images";
import Image from "next/image";
import { useState } from "react";
import { productSlug } from "@/utils/slug";
import LocalizedLink from "@/component/LocalizedLink";

interface ProductProps {
  ProductItems: ActiveProduct[];
  onHide: () => void;
}

const ProductMenu: React.FC<ProductProps> = ({ ProductItems, onHide }) => {
  const [eachProductId, setEachProductId] = useState<number | string | null>(
    null
  );

  return (
    <div className={`${styles.productMenu}`}>
      {ProductItems.length > 0 ? (
        ProductItems.map((product) => (
          <LocalizedLink
            key={product.id}
            href={`/products/${productSlug(product?.title ?? "")}`}
          >
            <div
              className={`${styles.eachProduct} ${
                eachProductId === product?.id ? `${styles.active}` : ""
              }`}
              onClick={onHide}
              onMouseEnter={() => setEachProductId(product?.id)}
              onMouseLeave={() => setEachProductId(null)}
            >
              <div className={styles.eachProductList}>
                <Image
                  src={product?.thumbnail}
                  alt={product?.thumbnailAltText || "product"}
                  width={70}
                  height={60}
                  className={styles.image}
                />
                <p>{product?.title || "-"}</p>
              </div>
              <Image
                src={
                  eachProductId === product.id
                    ? ICONS.YELLOW_DROPDOWN
                    : ICONS.BLACK_DROPDOWN
                }
                alt="DropDownArrow"
                width={18}
                height={18}
                className={styles.dropdown}
              />
            </div>
          </LocalizedLink>
        ))
      ) : (
        <div className={styles.emptyState}>
          <p style={{ fontWeight: "600" }}>No product attached</p>
        </div>
      )}
    </div>
  );
};

export default ProductMenu;
