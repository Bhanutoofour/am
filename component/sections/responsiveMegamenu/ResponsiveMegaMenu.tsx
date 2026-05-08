"use client";
import React, { useState } from "react";
import styles from "./responsiveStyles.module.scss";
import { ICONS } from "@/constants/Images/images";
import Image from "next/image";
import Link from "next/link";
import GetQuoteModal from "@/component/GetQuoteModal/GetQuoteModal";
import { titleToSlug, productSlug } from "@/utils/slug";

type MegaMenuType = "industry" | "product" | "company" | "";

const MENU_LINKS = [
  { href: "/about-us", label: "About us" },
  { href: "/contact-us", label: "Contact us" },
  { href: "/blog", label: "Blogs" },
];

interface megaMenuMobileProps {
  industries?: ActiveIndustry[];
  products?: ActiveProduct[];
  setMobileMenu?: React.Dispatch<
    React.SetStateAction<{ type: MegaMenuType; show: boolean }>
  >;
  isVisible?: boolean;
  setSelected?: React.Dispatch<React.SetStateAction<MegaMenuType>>;
}

const IndustryItems: React.FC<megaMenuMobileProps> = ({
  industries,
  setMobileMenu,
  setSelected,
}) => {
  return (
    <div className={styles.productWrapper}>
      {industries?.map((item, i) => (
        <Link
          key={i}
          href={`/industries/${titleToSlug(item.title)}`}
          style={{ width: "100%" }}
          onClick={() => {
            setMobileMenu?.((prev) => ({ ...prev, show: false }));
            setSelected?.("");
          }}
        >
          <div className={styles.menuItem}>
            <p style={{ fontWeight: "500", textTransform: "capitalize" }}>
              {item.title}
            </p>
            <Image
              src={ICONS.BLACK_DROPDOWN}
              alt={`arrow for ${item}`}
              width={13}
              height={13}
              style={{ transform: "rotate(-90deg)" }}
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

const ProductItems: React.FC<megaMenuMobileProps> = ({
  products,
  setMobileMenu,
  setSelected,
}) => {
  return (
    <div className={styles.productWrapper}>
      {products?.map((product) => (
        <Link
          key={product.id}
          href={`/products/${productSlug(product?.title ?? "")}`}
          onClick={() => {
            setMobileMenu?.((prev) => ({ ...prev, show: false }));
            setSelected?.("");
          }}
          style={{ width: "100%" }}
        >
          <div className={styles.eachProduct}>
            <div className={styles.eachProductList}>
              <Image
                src={product?.thumbnail}
                alt={product?.thumbnailAltText || "product"}
                width={60}
                height={50}
                className={styles.image}
              />
              <p>{product?.title || "-"}</p>
            </div>
            <Image
              src={ICONS.BLACK_DROPDOWN}
              alt="DropDownArrow"
              width={18}
              height={18}
              className={styles.dropdown}
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

const CompanyItems: React.FC<megaMenuMobileProps> = () => {
  return <div></div>;
};

const ResponsiveMegaMenu: React.FC<megaMenuMobileProps> = ({
  industries,
  products,
  setMobileMenu,
  isVisible = false,
}) => {
  const [selected, setSelected] = useState<MegaMenuType>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <div
      className={`${styles.mobileMenuContainer} ${
        isVisible ? styles.slideIn : ""
      }`}
    >
      <div className={styles.menuContent}>
        {selected !== "" && (
          <div className={styles.menuHeading} onClick={() => setSelected("")}>
            <Image
              src={ICONS.BLACK_DROPDOWN}
              alt="dropdown"
              width={18}
              height={18}
              style={{ transform: "rotate(90deg)" }}
            />
            <p>{selected}</p>
          </div>
        )}
        {selected === "industry" ? (
          <IndustryItems
            industries={industries}
            setMobileMenu={setMobileMenu}
            setSelected={setSelected}
          />
        ) : selected === "product" ? (
          <ProductItems
            products={products}
            setMobileMenu={setMobileMenu}
            setSelected={setSelected}
          />
        ) : selected === "company" ? (
          <CompanyItems setMobileMenu={setMobileMenu} />
        ) : (
          <>
            {(["industry", "product"] as MegaMenuType[]).map(
              (item: MegaMenuType, i: number) => (
                <div
                  className={styles.menuItem}
                  key={i}
                  onClick={() => setSelected(item)}
                >
                  <p>{item}</p>
                  <Image
                    src={ICONS.BLACK_DROPDOWN}
                    alt={`arrow for ${item}`}
                    width={13}
                    height={13}
                    style={{ transform: "rotate(-90deg)" }}
                  />
                </div>
              )
            )}
            {MENU_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.menuItem}
                onClick={() =>
                  setMobileMenu?.((prev) => ({ ...prev, show: false }))
                }
              >
                <p>{item.label}</p>
              </Link>
            ))}
          </>
        )}
      </div>
      <div className={styles.contactDetails}>
        <div className={styles.contactHolder}>
          <div className={styles.call}>
            <Image src={ICONS.CALL} alt="Phone number" width={18} height={18} />
            <a href={`tel:+91 87904 73345`} className={styles.callNumber}>
              +91 87904 73345
            </a>
          </div>
          {/* <div className={styles.call}>
            <Image
              src={ICONS.SEARCH}
              alt="search for dealers"
              width={18}
              height={18}
            />
            <p className={styles.callNumber}>FIND A DEALER</p>
          </div> */}
        </div>
        <div className={styles.btnHolder}>
          <button
            className={styles.quoteBtn}
            onClick={() => setShowModal(true)}
          >
            GET A QUOTE
          </button>
          <Link
            href={`/brochure`}
            onClick={() =>
              setMobileMenu?.((prev) => ({ ...prev, show: false }))
            }
          >
            <button className={styles.brochureBtn}>
              <Image
                src={ICONS.DOWNLOAD_ICON_BLACK}
                alt="download brochure"
                width={11}
                height={14}
              />
              BROCHURE
            </button>
          </Link>
        </div>
      </div>
      {showModal && (
        <GetQuoteModal showModal={showModal} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default ResponsiveMegaMenu;
