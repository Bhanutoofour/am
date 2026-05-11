"use client";
import styles from "./industryStyles.module.scss";
import { ICONS } from "@/constants/Images/images";
import Image from "next/image";
import { useState } from "react";
import { titleToSlug } from "@/utils/slug";
import LocalizedLink from "@/component/LocalizedLink";
interface IndustryProps {
  industryItems: ActiveIndustry[];
  onHide: () => void;
}

const IndustryMenu: React.FC<IndustryProps> = ({ industryItems, onHide }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<ActiveIndustry>(
    industryItems[0] ?? { title: "", products: [] }
  );
  const [selectedProductId, setSelectedProductId] = useState<
    number | string | null
  >(null);
  return (
    <div className={styles.titleMenu}>
      <div className={styles.industryMenu}>
        {industryItems.map((industryType, idx) => (
          <div
            className={styles.eachIndustry}
            key={`industryType ---- ${idx}`}
            onClick={() => setSelectedIndustry(industryType)}
            style={{
              borderLeft: `${
                industryType?.title === selectedIndustry?.title
                  ? "3px solid #f9c300"
                  : ""
              }`,
            }}
          >
            <p
              style={{
                fontWeight: `${
                  industryType?.title === selectedIndustry?.title
                    ? "700"
                    : "400"
                }`,
              }}
            >
              {industryType.title}
            </p>
            <Image
              src={ICONS.BLACK_DROPDOWN}
              alt="DropDownArrow"
              width={18}
              height={18}
              className={styles.image}
            />
          </div>
        ))}
      </div>
      <div
        className={`${styles.productMenu} ${
          !(selectedIndustry && selectedIndustry?.products?.length > 0)
            ? `${styles.emptyStateMenu}`
            : ""
        }`}
      >
        {selectedIndustry && selectedIndustry?.products?.length > 0 ? (
          selectedIndustry?.products.map((product) => (
            <LocalizedLink
              key={product.id}
              href={`/industries/${titleToSlug(selectedIndustry.title ?? "")}/${titleToSlug(product.title ?? "")}`}
            >
              <div
                className={`${styles.eachProduct} ${
                  selectedProductId === product?.id ? `${styles.active}` : ""
                }`}
                onClick={onHide}
                onMouseEnter={() => setSelectedProductId(product?.id)}
                onMouseLeave={() => setSelectedProductId(null)}
              >
                <div className={styles.eachProductList}>
                  <Image
                    src={product.thumbnail}
                    alt={product.thumbnailAltText || "product"}
                    width={70}
                    height={60}
                    className={styles.image}
                  />
                  <p>{product.title || "-"}</p>
                </div>
                <Image
                  src={
                    selectedProductId === product.id
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
            <p style={{ fontWeight: "600", textAlign: "center" }}>
              No product attached to this Industry
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustryMenu;
