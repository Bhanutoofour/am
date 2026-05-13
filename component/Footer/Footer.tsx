"use client";
import Image from "next/image";
import Button from "../molecules/button/Button";
import styles from "./styles.module.scss";
import { useState } from "react";
import GetQuoteModal from "../GetQuoteModal/GetQuoteModal";
import { HEADERS_ICON } from "@/constants/Images/images";
import LocalizedLink from "@/component/LocalizedLink";

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
        { value: "Email sales team", type: "/contact-us" },
        { value: "+91 87904 73345", type: "phone" },
      ],
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.yellowContainer}>
        <div className={styles.yellowContainerText}>
          <p className={styles.headText}>
            Built for Tough Sites. Ready for Your Project.
          </p>
          <p className={styles.subText}>
            From trencher machines and solar EPC attachments to aquatic weed
            harvesters and utility equipment, Autocracy Machinery delivers
            rugged solutions for infrastructure, telecom, water, and
            agriculture projects.
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
            Autocracy Machinery Private Limited manufactures trenchers,
            attachments, aquatic cleaning machines, forklifts, and utility
            equipment for India and global project sites.
          </p>
          <p className={styles.businessAddress}>
            Plot No.72/A, I.D.A. Phase-1, Lane-3, B N Reddy Nagar,
            Cherlapalli, Hyderabad, Telangana - 500051, India
          </p>
          <a href="tel:+918790473345" className={styles.businessPhone}>
            +91 87904 73345
          </a>
          <div className={styles.socialMedia}>
            <a
              href="https://www.linkedin.com/company/autocracy-machinery/"
              target="_blank"
              rel="noopener noreferrer"
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
              rel="noopener noreferrer"
            >
              <Image
                src={HEADERS_ICON.Youtube_YELLOW}
                alt="youtube"
                width={20}
                height={20}
              />
            </a>
            <a
              href="https://www.instagram.com/autocracymachinery/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={styles.instagramLink}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
              </svg>
            </a>
            <a
              href="https://x.com/aceautocracy"
              target="_blank"
              rel="noopener noreferrer"
            >
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
              rel="noopener noreferrer"
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
            <LocalizedLink href="/privacy-policy">Privacy Policy</LocalizedLink>
            <LocalizedLink href="/sitemap">Sitemap</LocalizedLink>
            <LocalizedLink href="/terms-and-conditions">Terms & Conditions</LocalizedLink>
          </div>
        </div>
        <div className={styles.linkContainer}>
          {footerLink.map((footPath, idx) => (
            <div key={idx} className={styles.footerLink}>
              {/* <p className={styles.footerLinkHeader}>{footPath.section}</p> */}
              <div className={styles.footerLinks}>
                {footPath.links?.map((link, i) => {
                  switch (link.type) {
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
                        <LocalizedLink href={`${link.type ? link.type : ""}`} key={i}>
                          {link.value}
                        </LocalizedLink>
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
        Copyright 2026 Autocracy Machinery. All rights reserved.
      </p>
      {showModal && (
        <GetQuoteModal showModal={showModal} setShowModal={setShowModal} />
      )}
    </footer>
  );
};
export default Footer;
