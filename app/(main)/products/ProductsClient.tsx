"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./products.module.scss";
import ProductCard from "@/component/molecules/productCard/ProductCard";
import CustomDropdown from "@/component/molecules/customDropdown/CustomDropdown";
import { productSlug } from "@/utils/slug";
import FaqAccordion from "@/component/sections/faqAccordion/FaqAccordion";

interface ProductsClientProps {
  products: ProductWithIndustries[];
  industries: ActiveIndustry[];
  basePath?: string;
  pageTitle?: string;
  pageSubtitle?: string;
}

const productFaqs = [
  {
    question: "Which Autocracy Machinery products can I explore here?",
    answer:
      "You can explore trenchers, tractor-mounted attachments, solar EPC equipment, aquatic weed harvesters, lake cleaning machines, forklifts, sand fillers, pole handling machines, sod harvesters, and other utility machinery for field projects.",
  },
  {
    question: "How do I choose the right machine for my project?",
    answer:
      "Start with your application, soil or site condition, required trench or cleaning output, available tractor or carrier, and project timeline. Our team can help match the right product family and model to your worksite.",
  },
  {
    question: "Can I filter products by industry?",
    answer:
      "Yes. Use the industry filter on this page to view products commonly used for telecom OFC, water management, solar, agriculture, construction, landscaping, environmental, and defence applications.",
  },
  {
    question: "Do product pages include individual models?",
    answer:
      "Yes. Each product family page lists the available models, their series, key specifications, media, brochures, and application details where available.",
  },
  {
    question: "Can I request a quote for a specific product?",
    answer:
      "Yes. Open the product or model that fits your requirement and use the enquiry or quote option, or contact Autocracy Machinery with your project details for guidance.",
  },
  {
    question: "Are these machines available for rental or only purchase?",
    answer:
      "Some products and models may support rental or project-based deployment depending on location and availability. Share your site requirement with the team to confirm the best option.",
  },
];

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

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: productFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className={styles.productsPage}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
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

      <section className={styles.productsFaqSection}>
        <div className={styles.productsFaqHeader}>
          <p className={styles.productsFaqEyebrow}>FAQs</p>
          <h2>Product FAQs</h2>
          <p>
            Quick answers about choosing Autocracy Machinery products, filtering
            by industry, checking model details, and requesting quotes.
          </p>
        </div>
        <div className={styles.productsFaqGrid}>
          {[productFaqs.slice(0, 3), productFaqs.slice(3)].map(
            (faqColumn, index) => (
              <FaqAccordion
                key={`product-faq-column-${index}`}
                items={faqColumn}
              />
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductsClient;
