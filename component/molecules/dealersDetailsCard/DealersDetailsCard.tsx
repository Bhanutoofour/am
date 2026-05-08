import React from "react";
import styles from "./dealrDetailsStyles.module.scss";
import Image from "next/image";
import { ICONS } from "@/constants/Images/images";

interface Dealer {
  id: number;
  name: string;
  state: string;
  country: string;
  contactNumber: string;
  email: string;
  fullAddress: string;
  availability: string;
}

interface DealersDetailsCardProps {
  data: Dealer;
}

const DealersDetailsCard: React.FC<DealersDetailsCardProps> = ({ data }) => {
  const {
    name,
    state,
    country,
    contactNumber,
    email,
    fullAddress,
    availability,
  } = data;

  return (
    <div className={styles.dealersCard}>
      {/* Top corner ribbon */}
      <div className={styles.ribbon}>
        <Image
          src={ICONS.DEALER_CARD_RIBBON}
          alt="Dealer card corner ribbon"
          width={45}
          height={45}
        />
      </div>

      {/* Card Heading */}
      <h3 className={styles.companyName}>{name}</h3>
      <div className={styles.companydetails}>
        <p className={styles.stateCountry}>
          {state}, {country}
        </p>
        <p className={styles.availability}>{availability}</p>
      </div>

      {/* Contact Details */}
      <div className={styles.contactInfo}>
        <div className={styles.row}>
          <Image
            src={ICONS.DEALER_WHATSAPP}
            alt="dealr's whatsapp number"
            width={18}
            height={18}
          />
          <a href={`tel:${contactNumber}`} className={styles.link}>
            {contactNumber}
          </a>
        </div>
        <div className={styles.row}>
          <Image
            src={ICONS.DEALER_EMAIL}
            alt="dealr's email id"
            width={18}
            height={18}
          />
          <a href={`mailto:${email}`} className={styles.link}>
            {email}
          </a>
        </div>
        <div className={styles.row}>
          <Image
            src={ICONS.DEALER_LOCATION}
            alt="dealr's loation"
            width={18}
            height={18}
          />
          <p className={styles.location}>{fullAddress}</p>
        </div>
      </div>
    </div>
  );
};

export default DealersDetailsCard;
