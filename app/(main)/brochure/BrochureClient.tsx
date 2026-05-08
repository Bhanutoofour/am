"use client";

import React, { useState, useEffect } from "react";
import styles from "./brochureStyle.module.scss";
import BrochureCard from "@/component/molecules/brochureCard/BrochureCard";
import BrochureDownloadModal from "@/component/GetQuoteModal/BrochureDownloadModal";
import Image from "next/image";
import { ProductWithModels, ProductsWithModelsResponse } from "@/types/api";
import { ICONS } from "@/constants/Images/images";
import useWindowSize from "@/hooks/useWindowSize";
import { SCREENS } from "@/constants";
import BrochureLoading from "./BrochureLoading";

const BrochureClient: React.FC = () => {
  const [products, setProducts] = useState<ProductWithModels[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithModels | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBrochure, setSelectedBrochure] = useState<{
    title: string;
    downloadUrl: string;
    productName: string;
  } | null>(null);
  const { width } = useWindowSize();
  const isMobile = width && width < 768;
  const [showProductDetails, setShowProductDetails] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products-with-models");
        const data: ProductsWithModelsResponse = await response.json();

        if (data.success) {
          setProducts(data.data);
          // Only select first product if not on mobile (width >= 768)
          if (
            data.data.length > 0 &&
            width &&
            width >= SCREENS.MOBILE_LANDSCAPE
          ) {
            setSelectedProduct(data.data[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (width && width > 0 && products.length > 0 && !selectedProduct) {
      if (width >= SCREENS.MOBILE_LANDSCAPE) {
        setSelectedProduct(products[0]);
      }
    }
  }, [width, products, selectedProduct]);

  const handleDownloadClick = (
    title: string,
    downloadUrl: string,
    productName: string
  ) => {
    setSelectedBrochure({ title, downloadUrl, productName });
    setShowModal(true);
  };

  if (loading) {
    return <BrochureLoading />;
  }

  return (
    <div className={styles.container}>
      {/* Desktop Layout */}
      {!isMobile && (
        <>
          <h1 className={styles.navTitle}>Product Brochures</h1>
          <div className={styles.innerContainer}>
            {/* Left Navigation */}
            <div className={styles.leftNav}>
              <div className={styles.productList}>
                {products.map((product) => (
                  <div
                    key={product.productId}
                    className={`${styles.productItem} ${
                      selectedProduct?.productId === product.productId
                        ? styles.active
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedProduct(product);
                      if (isMobile) {
                        setShowProductDetails(true);
                      }
                    }}
                  >
                    <div className={styles.productIcon}>
                      <Image
                        src={product.productThumbnail}
                        alt={product.productThumbnailAltText}
                        width={78}
                        height={41}
                        className={styles.productThumbnail}
                      />
                    </div>
                    <span className={styles.productName}>
                      {product.productName}
                    </span>
                    <div className={styles.arrow}>
                      <Image
                        src={ICONS.BLACK_DROPDOWN}
                        alt="Arrow"
                        width={12}
                        height={7}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className={styles.mainContent}>
              {!selectedProduct ? (
                // Initial state - no product selected
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>
                    <Image
                      src={ICONS.EMPTY_FOLDER}
                      alt="Download"
                      width={82}
                      height={82}
                    />
                  </div>
                  <p className={styles.placeholderText}>
                    Please select a product from the list to view its brochures.
                  </p>
                </div>
              ) : (
                // Product selected - show brochures
                <div className={styles.brochureContent}>
                  {/* Equipments Section */}
                  {selectedProduct.modelsList.equipments.length > 0 && (
                    <section className={styles.section}>
                      <h3 className={styles.sectionTitle}>Equipments</h3>
                      <div className={styles.brochureGrid}>
                        {selectedProduct.modelsList.equipments.map(
                          (model, index) => (
                            <BrochureCard
                              key={`equipment-${index}`}
                              title={model.modelName}
                              subtitle={`${model.modelTitle} | Equipment`}
                              onDownloadClick={() =>
                                handleDownloadClick(
                                  model.modelName,
                                  model.brochure || "",
                                  selectedProduct.productName
                                )
                              }
                            />
                          )
                        )}
                      </div>
                    </section>
                  )}

                  {/* Attachments Section */}
                  {selectedProduct.modelsList.attachments.length > 0 && (
                    <section className={styles.section}>
                      <h3 className={styles.sectionTitle}>Attachments</h3>
                      <div className={styles.brochureGrid}>
                        {selectedProduct.modelsList.attachments.map(
                          (model, index) => (
                            <BrochureCard
                              key={`attachment-${index}`}
                              title={model.modelName}
                              subtitle={`${model.modelTitle} | Attachment`}
                              onDownloadClick={() =>
                                handleDownloadClick(
                                  model.modelName,
                                  model.brochure || "",
                                  selectedProduct.productName
                                )
                              }
                            />
                          )
                        )}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Mobile Layout */}
      {isMobile && (
        <>
          {!showProductDetails ? (
            // Mobile: Initial State - Page title + Product list
            <>
              <h1 className={styles.navTitle}>Product Brochures</h1>
              <div className={styles.leftNav}>
                <div className={styles.productList}>
                  {products.map((product) => (
                    <div
                      key={product.productId}
                      className={`${styles.productItem} ${
                        selectedProduct?.productId === product.productId
                          ? styles.active
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedProduct(product);
                        if (isMobile) {
                          setShowProductDetails(true);
                        }
                      }}
                    >
                      <div className={styles.productIcon}>
                        <Image
                          src={product.productThumbnail}
                          alt={product.productThumbnailAltText}
                          width={78}
                          height={41}
                          className={styles.productThumbnail}
                        />
                      </div>
                      <span className={styles.productName}>
                        {product.productName}
                      </span>
                      <div className={styles.arrow}>
                        <Image
                          src={ICONS.BLACK_DROPDOWN}
                          alt="Arrow"
                          width={12}
                          height={7}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // Mobile: Product Details - Attachments/Equipments
            <>
              {selectedProduct && (
                <>
                  <h2
                    className={styles.navTitle}
                    onClick={() => {
                      setSelectedProduct(null);
                      setShowProductDetails(false);
                    }}
                  >
                    <Image
                      src={ICONS.BLACK_DROPDOWN}
                      alt="Arrow"
                      width={20}
                      height={12}
                    />
                    {selectedProduct.productName}
                  </h2>
                  <div className={styles.brochureContent}>
                    {/* Equipments Section */}
                    {selectedProduct.modelsList.equipments.length > 0 && (
                      <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>Equipments</h3>
                        <div className={styles.brochureGrid}>
                          {selectedProduct.modelsList.equipments.map(
                            (model, index) => (
                              <BrochureCard
                                key={`equipment-${index}`}
                                title={model.modelName}
                                subtitle={`${model.modelTitle} | Equipment`}
                                onDownloadClick={() =>
                                  handleDownloadClick(
                                    model.modelTitle,
                                    model.brochure || "",
                                    selectedProduct.productName
                                  )
                                }
                              />
                            )
                          )}
                        </div>
                      </section>
                    )}

                    {/* Attachments Section */}
                    {selectedProduct.modelsList.attachments.length > 0 && (
                      <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>Attachments</h3>
                        <div className={styles.brochureGrid}>
                          {selectedProduct.modelsList.attachments.map(
                            (model, index) => (
                              <BrochureCard
                                key={`attachment-${index}`}
                                title={model.modelName}
                                subtitle={`${model.modelTitle} | Attachment`}
                                onDownloadClick={() =>
                                  handleDownloadClick(
                                    model.modelTitle,
                                    model.brochure || "",
                                    selectedProduct.productName
                                  )
                                }
                              />
                            )
                          )}
                        </div>
                      </section>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}

      {/* Brochure Download Modal */}
      {showModal && selectedBrochure && (
        <BrochureDownloadModal
          setShowModal={setShowModal}
          modelTitle={selectedBrochure.title}
          productName={selectedBrochure.productName}
          downloadUrl={selectedBrochure.downloadUrl}
        />
      )}
    </div>
  );
};

export default BrochureClient;
