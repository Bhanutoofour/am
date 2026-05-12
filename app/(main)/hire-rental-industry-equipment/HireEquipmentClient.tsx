"use client";
import React, { useState } from "react";
import styles from "./hireStyles.module.scss";
import Image from "next/image";
import useWindowSize from "@/hooks/useWindowSize";
import { SCREENS } from "@/constants";
import {
  FormCheckbox,
  FormInput,
} from "@/component/molecules/quoteInputs/QuoteFormItem";
import { ICONS } from "@/constants/Images/images";
import Link from "next/link";
import useOutsideClick from "@/hooks/useOutsideClick";
import { submitContactForm } from "@/utils/zohoCRM";
import { modelNumberSlug, titleToSlug, modelSlug } from "@/utils/slug";

interface HireEquipmentClientProps {
  allRentalEquipment: RentalModelTypes[];
}

const StepTwo = () => {
  return (
    <div className={styles.stepTwoContainer}>
      <div className={styles.topPortion}>
        <div className={styles.yellowRound}>
          <Image
            src={ICONS.CHECK_ICON_BLACK}
            width={50}
            height={50}
            alt="check-mark"
          />
        </div>
        <div className={styles.topPortionContent}>
          <p className={styles.topPortionHeading}>Thank You!</p>
          <p className={styles.thankYouForSharing}>
            for choosing Autocracy Machinery! <br /> Our team will contact you
            within 24 hours. For urgent rentals,
          </p>
        </div>
      </div>
      <div className={styles.bottomPortion}>
        <a
          href="mailto:sales@autocracymachinery.com"
          className={styles.needAssistance}
        >
          sales@autocracymachinery.com
        </a>
        <a href="tel:8790473345" className={styles.callUs}>
          Call us at: +91 87904 73345
        </a>
      </div>
    </div>
  );
};

const HireEquipmentClient: React.FC<HireEquipmentClientProps> = ({
  allRentalEquipment,
}) => {
  const { width } = useWindowSize();
  const modelRef = React.useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<number>(1);
  const [equipmentData, setEquipmentData] = useState<RentalModelTypes | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    agreed: true,
  });

  useOutsideClick(modelRef as React.RefObject<HTMLElement>, () => {
    if (equipmentData && Object.keys(equipmentData).length > 0) {
      setEquipmentData(null);
      setStep(1);
      setFormData({
        name: "",
        email: "",
        mobileNumber: "",
        agreed: true,
      });
    }
  });

  const onFormSubmit = async () => {
    if (!formData.name || !formData.email || !formData.mobileNumber) return;
    try {
      await submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.mobileNumber,
        model: equipmentData?.modelNumber,
        webLeadType: "Hire on Rent",
      });
    } catch (error) {
      console.error("Error submitting hire on rent form:", error);
    } finally {
      setStep(2);
    }
  };

  return (
    <div className={styles.hireContainer}>
      <div className={styles.headingContent}>
        <h1 className={styles.contentHeading}>
          Hire Trenchers and Utility Equipment on Rent
        </h1>
        <p className={styles.contentPara}>
          Rent project-ready machinery directly from Autocracy Machinery for
          short-term and long-term work. Hire trenchers, pole erection machines,
          floating trash collectors, and other utility equipment for telecom,
          solar, water management, construction, and infrastructure projects.
        </p>
      </div>
      <div className={styles.itemLists}>
        {allRentalEquipment.map((item, idx) => (
          <div key={`listItemKeys----${idx}`} className={styles.itemCard}>
            <Image
              src={item.thumbnail}
              alt={item.thumbnailAltText}
              width={width && width > SCREENS.MOBILE_LANDSCAPE ? 496 : 375}
              height={335}
            />
            <div className={styles.eachCardContent}>
              <div className={styles.itemCardContent}>
                <div className={styles.itemCardHeading}>
                  <h3 className={styles.itemName}>{item?.modelNumber}</h3>
                  <p className={styles.itemSpecification}>
                    {item?.modelTitle} | {item?.machineType}
                  </p>
                </div>
                <p className={styles.itemCardDesc}>{item?.shortDescription}</p>
              </div>
              <div className={styles.itemCardBtns}>
                <button onClick={() => setEquipmentData(item)}>RENT NOW</button>
                <Link
                  href={(() => {
                    const p = titleToSlug(item.productName ?? "");
                    const m = modelNumberSlug(item.modelNumber ?? "");
                    if (p && m) return `/products/${p}/${m}`;
                    return `/product/${modelSlug(
                      item.productName ?? "",
                      item.modelTitle ?? "",
                      item.modelNumber ?? ""
                    )}`;
                  })()}
                >
                  KNOW MORE
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {equipmentData && Object.keys(equipmentData).length > 0 && (
        <div className={styles.hirePage}>
          <div
            className={styles.hireModal}
            ref={modelRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.closingState}>
              <div className={styles.hireHeader}>
                {step === 1 && (
                  <p className={styles.hireHeading}>Hire a Machine on Rent</p>
                )}
                {step === 1 && (
                  <p className={styles.hireDesc}>
                    Get project-ready machinery on rent directly from Autocracy
                    Machinery. Share your site requirement, duration, and
                    application so our team can guide machine availability and
                    next steps.
                  </p>
                )}
              </div>
              <Image
                width={24}
                height={24}
                className={styles.closeIcon}
                src={ICONS.CLOSE_ICON}
                alt={"close-icon"}
                onClick={() => {
                  setEquipmentData(null);
                  setStep(1);
                  setFormData({
                    name: "",
                    email: "",
                    mobileNumber: "",
                    agreed: true,
                  });
                }}
              />
            </div>
            {step === 1 ? (
              <div className={styles.hireForm}>
                <FormInput
                  label="Full Name"
                  required
                  placeholder="Enter your name"
                  selectedValue={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e })}
                />
                <FormInput
                  label="E-mail Address"
                  type="email"
                  required
                  placeholder="Enter your full address"
                  selectedValue={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e })}
                />
                <FormInput
                  label="Mobile Number"
                  required
                  isMobileNumber
                  type="number"
                  selectedValue={formData.mobileNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, mobileNumber: e })
                  }
                />
                <FormCheckbox
                  label="I agree to receive product updates, brochures, and promotional offers from Autocracy Machinery via SMS, Email, or WhatsApp."
                  required
                  selectedValue={formData.agreed}
                  onChange={(e) => setFormData({ ...formData, agreed: e })}
                />
              </div>
            ) : (
              <StepTwo />
            )}
            {step === 1 ? (
              <button
                className={styles.hireSubmitBtn}
                disabled={
                  !formData.name || !formData.email || !formData.mobileNumber
                }
                onClick={onFormSubmit}
              >
                SUBMIT
              </button>
            ) : (
              <Link
                href="/"
                className={styles.hireSubmitBtn}
                style={{ textDecoration: "none" }}
              >
                EXPLORE MORE
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HireEquipmentClient;
