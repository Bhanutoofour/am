"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Megamenu from "../sections/megaMenu/Megamenu";
import styles from "./styles.module.scss";
import { HEADERS_ICON, ICONS } from "@/constants/Images/images";
import useOutsideClick from "@/hooks/useOutsideClick"; // adjust path as needed
import ResponsiveMegaMenu from "../sections/responsiveMegamenu/ResponsiveMegaMenu";
import Link from "next/link";

interface HeaderClientProps {
  menuOnly?: boolean;
  industries: ActiveIndustry[];
  products: ActiveProduct[];
}

type MegaMenuType = "industry" | "product" | "company" | "";

const MENU_LINKS = [
  { href: "/about-us", label: "About us" },
  { href: "/contact-us", label: "Contact us" },
  { href: "/blog", label: "Blogs" },
];

const HeaderClient: React.FC<HeaderClientProps> = ({
  menuOnly,
  industries,
  products,
}) => {
  const [megaMenu, setMegaMenu] = useState<{
    type: MegaMenuType;
    show: boolean;
  }>({
    type: "",
    show: false,
  });
  const [mobileMenu, setMobileMenu] = useState<{
    type: MegaMenuType;
    show: boolean;
  }>({
    type: "",
    show: false,
  });

  const megaMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mobileMenu.show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenu.show]);

  useOutsideClick(megaMenuRef, () => {
    if (megaMenu.show) {
      setMegaMenu({ type: "", show: false });
    }
  });

  if (menuOnly) {
    return (
      <div ref={megaMenuRef} className={styles.headerOptionsWrapper}>
        <div
          className={styles.headerItem}
          onClick={() =>
            setMegaMenu((prev) => ({
              type: "industry",
              show: prev.type !== "industry" ? true : !prev.show,
            }))
          }
        >
          <p
            style={{
              color:
                megaMenu.show && megaMenu.type === "industry"
                  ? "#F9C300"
                  : "#0a0a0b",
            }}
          >
            Industries
          </p>
          <Image
            src={
              megaMenu.show && megaMenu.type === "industry"
                ? ICONS.YELLOW_DROPDOWN
                : ICONS.BLACK_DROPDOWN
            }
            alt="DropDownArrow"
            width={18}
            height={18}
            style={{
              transform:
                megaMenu.show && megaMenu.type === "industry"
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </div>

        <div
          className={styles.headerItem}
          onClick={() =>
            setMegaMenu((prev) => ({
              type: "product",
              show: prev.type !== "product" ? true : !prev.show,
            }))
          }
        >
          <p
            style={{
              color:
                megaMenu.show && megaMenu.type === "product"
                  ? "#F9C300"
                  : "#0a0a0b",
            }}
          >
            Products
          </p>
          <Image
            src={
              megaMenu.show && megaMenu.type === "product"
                ? ICONS.YELLOW_DROPDOWN
                : ICONS.BLACK_DROPDOWN
            }
            alt="DropDownArrow"
            width={18}
            height={18}
            style={{
              transform:
                megaMenu.show && megaMenu.type === "product"
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </div>

        {MENU_LINKS.map((item) => (
          <Link key={item.href} href={item.href} className={styles.headerLink}>
            {item.label}
          </Link>
        ))}

        {megaMenu.show && (
          <Megamenu
            menuFrom={megaMenu.type}
            industries={industries}
            products={products}
            onHide={() => setMegaMenu({ type: "", show: false })}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        className={styles.hamburger}
        aria-label={mobileMenu.show ? "Close menu" : "Open menu"}
        aria-expanded={mobileMenu.show}
        onClick={() =>
          setMobileMenu((current) => ({ ...current, show: !current.show }))
        }
      >
        {mobileMenu.show ? (
          <Image
            src={ICONS.CROSS}
            alt="cancel megamenu"
            width={18}
            height={18}
          />
        ) : (
          <Image
            src={"/icons/hamburgerIcon.svg"}
            alt="hamburger"
            width={18}
            height={18}
          />
        )}
      </button>
      <div className={styles.yellowBarContent}>
        <a href="tel:8790473345" className={styles.barContent}>
          <Image
            src={HEADERS_ICON.CALL}
            alt="whatsapp"
            width={18}
            height={18}
          />
          <p className={styles.caller}>+91 87904 73345</p>
        </a>
        <Link href="/find-a-dealer" className={styles.barContent}>
          <Image src={ICONS.SEARCH} alt="Search" width={18} height={18} />
          <p className={styles.dealer}>FIND A DEALER</p>
        </Link>
      </div>
      <ResponsiveMegaMenu
        industries={industries}
        products={products}
        setMobileMenu={setMobileMenu}
        isVisible={mobileMenu.show}
      />
    </>
  );
};

export default HeaderClient;
