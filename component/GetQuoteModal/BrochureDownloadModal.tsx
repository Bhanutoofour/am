"use client";

import React, { useState } from "react";
import styles from "./brochureDownloadStyles.module.scss";
import { FormInput } from "../molecules/quoteInputs/QuoteFormItem";
import Image from "next/image";
import { ICONS } from "@/constants/Images/images";
import { submitBrochureForm } from "@/utils/zohoCRM";

interface BrochureDownloadModalProps {
  setShowModal: (value: boolean) => void;
  modelTitle?: string;
  productName?: string;
  downloadUrl: string;
  industry?: string;
}

interface BrochureFormData {
  name: string;
  email: string;
  phone: string;
}

const StepOne = ({
  formData,
  setFormData,
}: {
  formData: BrochureFormData;
  setFormData: (value: BrochureFormData) => void;
}) => {
  return (
    <div className={styles.stepContainer}>
      <FormInput
        label="Full Name"
        required
        selectedValue={formData.name}
        onChange={(val) => {
          setFormData({
            ...formData,
            name: val,
          });
        }}
      />
      <FormInput
        label="E-mail Address"
        required
        selectedValue={formData.email}
        onChange={(val) => {
          setFormData({
            ...formData,
            email: val,
          });
        }}
        type="email"
      />
      <FormInput
        label="Phone"
        required
        selectedValue={formData.phone}
        onChange={(val) => {
          setFormData({
            ...formData,
            phone: val,
          });
        }}
      />
    </div>
  );
};

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
          <p className={styles.topPortionHeading}>Brochure Downloaded!</p>
          <p className={styles.downloadConfirmation}>
            Your download has started, and a copy has also been sent to your
            email.
          </p>
        </div>
      </div>
      <div className={styles.bottomPortion}>
        <p className={styles.needAssistance}>Need immediate assistance?</p>
        <p className={styles.callUs}>Call us at: +91-87904 73345</p>
      </div>
    </div>
  );
};

const BrochureDownloadModal: React.FC<BrochureDownloadModalProps> = ({
  setShowModal,
  modelTitle = "",
  productName = "",
  downloadUrl,
  industry = "",
}) => {
  const [step, setStep] = useState<number>(1);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [formData, setFormData] = useState<BrochureFormData>({
    name: "",
    email: "",
    phone: "",
  });

  // Check if current step is valid
  const isStepValid = () => {
    if (step === 1) {
      return formData.name && formData.email && formData.phone;
    }
    return true;
  };

  // Update disabled state based on current step
  React.useEffect(() => {
    setDisabled(!isStepValid());
  }, [formData, step]);

  const onBtnClick = async () => {
    try {
      if (step === 1) {
        if (formData.name && formData.email && formData.phone) {
          setDisabled(true);

          try {
            // Submit to Zoho CRM
            await submitBrochureForm({
              ...formData,
              product: productName,
              model: modelTitle,
              industry: industry,
              webLeadType: "Brochure Download",
            });

            // Open download in new tab
            window.open(downloadUrl, "_blank");

            setStep(2);
          } catch (error) {
            console.error("Error submitting brochure form:", error);
            // Still proceed with download even if CRM fails
            window.open(downloadUrl, "_blank");
            setStep(2);
          } finally {
            setDisabled(false);
          }
        }
      } else if (step === 2) {
        setShowModal(false);
        setStep(1);
        setFormData({
          name: "",
          email: "",
          phone: "",
        });
      }
    } catch (error) {
      console.error("Unexpected error in onBtnClick:", error);
      setDisabled(false);
    }
  };

  return (
    <div className={styles.brochurePage} onClick={() => setShowModal(false)}>
      <div
        className={styles.brochureModal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.closingState}>
          <div />
          <Image
            src={ICONS.CLOSE_ICON}
            alt="close-icon"
            width={24}
            height={24}
            onClick={() => setShowModal(false)}
            className={styles.closeIcon}
          />
        </div>
        {step === 1 && (
          <div className={styles.brochureContent}>
            <p className={styles.brochureHeading}>
              {`Get the brochure for ${industry ? industry : modelTitle}`}
            </p>
            <p className={styles.brochureDesc}>
              Fill in your details to download the brochure instantly.
            </p>
          </div>
        )}
        <div
          className={styles.brochureStepItems}
          style={{ height: `calc(100% - ${step === 2 ? "71px" : "210px"})` }}
        >
          {step === 1 ? (
            <StepOne formData={formData} setFormData={setFormData} />
          ) : (
            <StepTwo />
          )}
        </div>

        <button
          disabled={disabled}
          onClick={onBtnClick}
          className={styles.brochureButton}
        >
          {step === 1 ? "NEXT" : "THANK YOU"}
        </button>
      </div>
    </div>
  );
};

export default BrochureDownloadModal;
