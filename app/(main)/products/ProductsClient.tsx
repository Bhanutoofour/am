"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./products.module.scss";
import ProductCard from "@/component/molecules/productCard/ProductCard";
import CustomDropdown from "@/component/molecules/customDropdown/CustomDropdown";
import { productSlug } from "@/utils/slug";

interface ProductsClientProps {
  products: ProductWithIndustries[];
  industries: ActiveIndustry[];
  basePath?: string;
  pageTitle?: string;
  pageSubtitle?: string;
}

const ProductsClient: React.FC<ProductsClientProps> = ({
  products,
  industries,
  basePath = "",
  pageTitle = "All Our Products",
  pageSubtitle = "Autocracy Machinery designs and manufactures heavy-duty machines for industrial, infrastructure, and environmental applications. Our products include trenchers, self-propelled machines, forklifts, dredgers, aquatic weed harvesters, and more. Built for high performance, durability, and ease of operation, they serve industries like telecommunications, water management, agriculture, construction, energy, and defence. With in-house R&D and reliable after-sales support, we deliver complete machinery solutions. Autocracy Machinery is your trusted partner for efficient and versatile project execution.",
}) => {
  const [selectedIndustrie, setSelectedIndustrie] = useState<string>("");

  // Filter products based on selected industries
  const filteredProducts = useMemo(() => {
    if (!selectedIndustrie) {
      return products;
    }

    return products.filter((product) =>
      product.industries.includes(selectedIndustrie)
    );
  }, [products, selectedIndustrie]);

  const clearAllFilters = () => {
    setSelectedIndustrie("");
  };

  return (
    <div className={styles.productsPage}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.pageTitle}>{pageTitle}</h1>
            <p className={styles.pageSubtitle}>{pageSubtitle}</p>
          </div>

          {/* Industry Filter Dropdown */}
          <div className={styles.filterDropdown}>
            <CustomDropdown
              options={[
                { value: "", label: "All Industries" },
                ...industries.map((industry) => ({
                  value: industry.title,
                  label: industry.title,
                })),
              ]}
              value={selectedIndustrie}
              onChange={(value) => {
                if (value === "") {
                  clearAllFilters();
                } else {
                  setSelectedIndustrie(value);
                }
              }}
              placeholder="All Industries"
              className={styles.customDropdown}
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className={styles.container}>
        <div className={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`${basePath}/products/${productSlug(product?.title ?? "")}`}
            >
              <ProductCard
                title={product.title}
                imageSrc={product?.thumbnail}
                altText={product?.thumbnailAltText}
                isProductPage
              />
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className={styles.noResults}>
            <h3>No products found</h3>
            <p>Try adjusting your industry filters to see more products.</p>
            <button onClick={clearAllFilters} className={styles.clearAllButton}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsClient;
