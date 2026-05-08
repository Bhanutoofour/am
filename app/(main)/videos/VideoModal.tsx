"use client";

import React from "react";
import Image from "next/image";
import styles from "./videoModal.module.scss";
import { ICONS } from "@/constants/Images/images";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedLink: string;
  title: string;
}

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  embedLink,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <Image
              src={ICONS.CLOSE_ICON}
              alt="Close"
              width={24}
              height={24}
            />
          </button>
        </div>
        <div className={styles.videoContainer}>
          <iframe
            src={embedLink}
            title={title}
            className={styles.videoIframe}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;

