import styles from "./styles.module.scss";
import Image from "next/image";
import HeaderClient from "./HeaderClient";
import { IMAGES } from "@/constants/Images/images";
import { getActiveIndustries } from "@/actions/industryAction";
import { getActiveProducts } from "@/actions/productAction";
import GetQuoteHandler from "./GetQuoteHandeler";
import LocalizedLink from "@/component/LocalizedLink";

export default async function Header() {
  const industries = await getActiveIndustries();
  const products = await getActiveProducts();
  return (
    <header className={styles.navbar}>
      <div className={styles.yellowBarContainer}>
        <div className={styles.yellowBar}>
          {/* <div className={styles.hamburger}>
            <Image
              src={"/icons/hamburgerIcon.svg"}
              alt="hamburger"
              width={18}
              height={18}
            />
          </div>
          <div className={styles.yellowBarContent}>
            {/* WhatsApp and Dealer links will be interactive in HeaderClient */}
          <HeaderClient industries={industries} products={products} />
          {/*  </div> */}
        </div>
      </div>
      <nav className={styles.bottomBar}>
        <div className={styles.bottomBarContent}>
          <div className={styles.leftSide}>
            <div className={styles.image}>
              <LocalizedLink href="/" passHref>
                <Image src={IMAGES.LOGO} alt="logo" width={162} height={32} />
              </LocalizedLink>
            </div>
            {/* Industries and Products dropdowns will be interactive in HeaderClient */}
            <HeaderClient
              menuOnly
              industries={industries}
              products={products}
            />
          </div>
          <GetQuoteHandler />
        </div>
      </nav>
    </header>
  );
}
