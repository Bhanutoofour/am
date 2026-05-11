"use client";
import React, { useState } from "react";
import Button from "../molecules/button/Button";
import styles from "./styles.module.scss";
import GetQuoteModal from "../GetQuoteModal/GetQuoteModal";
import { ICONS } from "@/constants/Images/images";
import LocalizedLink from "@/component/LocalizedLink";

const GetQuoteHandler: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div className={styles.buttonSide}>
      <LocalizedLink href="/brochure">
        <Button
          title="BROCHURE"
          icon={ICONS.DOWNLOAD_ICON_BLACK}
          bgColor="#FFFFFF"
          buttonFontColor="#0A0A0B"
          buttonBorder="1px solid #0A0A0B"
          responsiveClass={styles.headerButton}
        />
      </LocalizedLink>
      <Button
        title="GET A QUOTE"
        bgColor="#01060A"
        buttonFontColor="#F9C300"
        buttonBorder="1px solid #0A0A0B"
        responsiveClass={`${styles.headerButton} ${styles.quote}`}
        handleClick={() => setShowModal(true)}
      />
      {showModal && (
        <GetQuoteModal showModal={showModal} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default GetQuoteHandler;
