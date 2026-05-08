"use client";
import Image from "next/image";
import Button from "../molecules/button/Button";
import styles from "./styles.module.scss";
import { useState } from "react";
import GetQuoteModal from "../GetQuoteModal/GetQuoteModal";
import Link from "next/link";
import { HEADERS_ICON } from "@/constants/Images/images";

const Footer: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const footerLink: FooterLinkSection[] = [
    {
      section: "Company",
      links: [
        { value: "About us", type: "/about-us" },
        { value: "Careers", type: "/careers" },
        { value: "FAQs", type: "/faqs" },
        { value: "Contact us", type: "/contact-us" },
        { value: "Hire on rent", type: "/hire-rental-industry-equipment" },
        { value: "Find a dealer", type: "/find-a-dealer" },
      ],
    },
    {
      section: "Title1",
      links: [
        { value: "Products", type: "/products" },
        { value: "Brochure", type: "/brochure" },
        { value: "Blog", type: "/blog" },
        { value: "Videos", type: "/videos" },
      ],
    },
    // {
    //   section: "Title2",
    //   links: [
    //     { value: "Careers", type: "link" },
    //     { value: "Search", type: "link" },
    //     { value: "Help", type: "link" },
    //     { value: "Legal", type: "link" },
    //   ],
    // },
    {
      section: "Contact us",
      links: [
        { value: "sales@autocracymachinery.com", type: "email" },
        { value: "+91 87904 73345", type: "phone" },
      ],
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.yellowContainer}>
        <div className={styles.yellowContainerText}>
          <p className={styles.headText}>
            Built for Performance. Branded for You.
          </p>
          <p className={styles.subText}>
            From trenchers to multi-utility machines, Autocracy Machinery
            delivers rugged, customizable solutions—designed to power
            infrastructure, telecom, and agri projects.
          </p>
        </div>
        <Button
          title="GET A QUOTE"
          bgColor="#01060A"
          buttonFontColor="#F9C300"
          buttonBorder="1px solid #0A0A0B"
          handleClick={() => setShowModal(true)}
        />
      </div>
      <div className={styles.footerContent}>
        <div className={styles.aboutContainer}>
          <div className={styles.image}>
            <Image
              src="/icons/logoWhite.svg"
              alt="autocracy"
              width={170}
              height={40}
            />
          </div>
          <p className={styles.address}>
            Autocracy machinery is a trading style of Aceautocracy Machinery
            Pvt. Limited, a company incorporated in India.
          </p>
          <div className={styles.socialMedia}>
            <a
              href="https://www.linkedin.com/company/autocracy-machinery/"
              target="_blank"
            >
              <Image
                src={HEADERS_ICON.LinkedIn_YELLOW}
                alt="linkedin"
                width={20}
                height={20}
              />
            </a>
            <a
              href="https://www.youtube.com/@AutocracyMachinery"
              target="_blank"
            >
              <Image
                src={HEADERS_ICON.Youtube_YELLOW}
                alt="youtube"
                width={20}
                height={20}
              />
            </a>
            <a href="https://x.com/aceautocracy" target="_blank">
              <Image
                src={HEADERS_ICON.Twitter_YELLOW}
                alt="twitter"
                width={20}
                height={20}
              />
            </a>
            <a
              href="https://www.facebook.com/people/Autocracy-Machinery/61554797280328"
              target="_blank"
            >
              <Image
                src={HEADERS_ICON.FACEBOOK_YELLOW}
                alt="facebook"
                width={20}
                height={20}
              />
            </a>
          </div>
          <div className={styles.routeItems}>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-and-conditions">Terms & Conditions</Link>
          </div>
        </div>
        <div className={styles.linkContainer}>
          {footerLink.map((footPath, idx) => (
            <div key={idx} className={styles.footerLink}>
              {/* <p className={styles.footerLinkHeader}>{footPath.section}</p> */}
              <div className={styles.footerLinks}>
                {footPath.links?.map((link, i) => {
                  switch (link.type) {
                    case "email":
                      return (
                        <a
                          href={`mailto:${link.value}`}
                          key={i}
                          className={styles.contactLink}
                        >
                          {link.value}
                        </a>
                      );
                    case "phone":
                      return (
                        <a
                          href={`tel:${link.value}`}
                          key={i}
                          className={styles.contactLink}
                        >
                          {link.value}
                        </a>
                      );
                    case "link":
                    default:
                      return link.type ? (
                        <Link href={`${link.type ? link.type : ""}`} key={i}>
                          {link.value}
                        </Link>
                      ) : (
                        <p key={link.value}>{link.value}</p>
                      );
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className={styles.rights}>
        © 2026 All Rights Reserved to Autocracy Machinery
      </p>
      {showModal && (
        <GetQuoteModal showModal={showModal} setShowModal={setShowModal} />
      )}
    </footer>
  );
};
export default Footer;
