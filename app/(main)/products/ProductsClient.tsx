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
  pageTitle = "Trencher Machines, Attachments and Utility Equipment",
  pageSubtitle = "Explore Autocracy Machinery products for telecom OFC trenching, solar EPC cable laying, irrigation pipelines, water management, agriculture, landscaping, construction, and defence projects. Our range includes chain trenchers, rock wheel trenchers, tractor-mounted attachments, forklifts, sand fillers, pole handling machines, aquatic weed harvesters, lake cleaning equipment, sod harvesters, and other project-ready machinery built for dependable field performance.",
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
