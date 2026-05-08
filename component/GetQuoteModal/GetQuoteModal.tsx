import React, { useState, useEffect } from "react";
import styles from "./quoteStyles.module.scss";
import { FormInput, FormSelect } from "../molecules/quoteInputs/QuoteFormItem";
import Button from "../molecules/button/Button";
import { IndustryWithProducts } from "@/types/api";
import { ICONS } from "@/constants/Images/images";
import Image from "next/image";
import { submitQuoteForm } from "@/utils/zohoCRM";

interface GetQuoteProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

interface selectedQuoteValue {
  industry: string;
  product: string;
  name: string;
  email: string;
  phone: string;
}

const StepOne = ({
  industriesWithProducts,
  selectedValue,
  setSelectedValue,
}: {
  industriesWithProducts: IndustryWithProducts[];
  selectedValue: selectedQuoteValue;
  setSelectedValue: (value: selectedQuoteValue) => void;
}) => {
  const [availableProducts, setAvailableProducts] = useState<
    { productId: number; productName: string }[]
  >([]);

  // Update available products when industry changes
  useEffect(() => {
    if (selectedValue.industry) {
      const selectedIndustry = industriesWithProducts.find(
        (industry) => industry.industryName === selectedValue.industry
      );
      setAvailableProducts(selectedIndustry?.productsList || []);
    } else {
      setAvailableProducts([]);
    }
  }, [selectedValue.industry, industriesWithProducts]);

  return (
    <div className={styles.stepContainer}>
      <FormSelect
        label="Choose Industry"
        required
        options={industriesWithProducts.map(
          (industry) => industry.industryName
        )}
        selectedValue={selectedValue.industry}
        onChange={(val) => {
          setSelectedValue({
            ...selectedValue,
            industry: val,
            product: "", // Reset product when industry changes
          });
        }}
      />
      <FormSelect
        label="Choose Product"
        required
        options={availableProducts.map((product) => product.productName)}
        selectedValue={selectedValue.product}
        onChange={(val) => {
          setSelectedValue({
            ...selectedValue,
            product: val,
          });
        }}
        disabled={!selectedValue.industry}
      />
    </div>
  );
};

const StepTwo = ({
  selectedValue,
  setSelectedValue,
}: {
  selectedValue: selectedQuoteValue;
  setSelectedValue: (value: selectedQuoteValue) => void;
}) => {
  return (
    <div className={styles.stepContainer}>
      <FormInput
        label="Full Name"
        required
        selectedValue={selectedValue.name}
        onChange={(val) => {
          setSelectedValue({
            ...selectedValue,
            name: val,
          });
        }}
      />
      <FormInput
        label="E-mail Address"
        required
        selectedValue={selectedValue.email}
        onChange={(val) => {
          setSelectedValue({
            ...selectedValue,
            email: val,
          });
        }}
        type="email"
      />
      <FormInput
        label="Phone Number"
        required
        selectedValue={selectedValue.phone}
        onChange={(val) => {
          setSelectedValue({
            ...selectedValue,
            phone: val,
          });
        }}
      />
    </div>
  );
};

const StepThree = () => {
  return (
    <div className={styles.stepThreeContainer}>
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
          <p className={styles.topPortionHeading}>We've Got Your Request!</p>
          <p className={styles.thankYouForSharing}>
            Thank you for sharing your details. Our team will review your
            requirements and get back to you shortly with the best quote.
          </p>
        </div>
      </div>
      <div className={styles.bottomPortion}>
        <p className={styles.needAssistance}>Need immediate assistance?</p>
        <p className={styles.callUs}>Call us at: +91 87904 73345</p>
      </div>
    </div>
  );
};

const GetQuoteModal: React.FC<GetQuoteProps> = ({
  showModal,
  setShowModal,
}) => {
  const [step, setStep] = useState<number>(1);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [industriesWithProducts, setIndustriesWithProducts] = useState<
    IndustryWithProducts[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedValue, setSelectedValue] = useState<selectedQuoteValue>({
    industry: "",
    product: "",
    name: "",
    email: "",
    phone: "",
  });

  // Fetch industries with products when modal opens
  useEffect(() => {
    if (showModal) {
      fetchIndustriesWithProducts();
    }
  }, [showModal]);

  const fetchIndustriesWithProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/industries-with-products");
      const data = await response.json();

      if (data.success) {
        setIndustriesWithProducts(data.data);
      } else {
        console.error("Failed to fetch industries with products:", data.error);
      }
    } catch (error) {
      console.error("Error fetching industries with products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check if current step is valid
  const isStepValid = () => {
    if (step === 1) {
      return selectedValue.industry && selectedValue.product;
    } else if (step === 2) {
      return selectedValue.name && selectedValue.email && selectedValue.phone;
    }
    return true;
  };

  // Update disabled state based on current step
  useEffect(() => {
    setDisabled(!isStepValid());
  }, [selectedValue, step]);

  const onBtnClick = async () => {
    try {
      if (step === 1) {
        if (selectedValue.industry && selectedValue.product) {
          setStep(2);
        }
      } else if (step === 2) {
        if (selectedValue.name && selectedValue.email && selectedValue.phone) {
          setDisabled(true); // Disable button during submission

          try {
            // Submit to Zoho CRM
            const zohoSuccess = await submitQuoteForm({
              ...selectedValue,
              webLeadType: "Get Quote",
            });

            if (zohoSuccess) {
              // Success - data submitted to Zoho CRM
            } else {
              // Failed - but continue with local submission
            }

            setStep(3);
          } catch (error) {
            console.error("Error submitting quote form:", error);
            setStep(3);
          } finally {
            setDisabled(false);
          }
        }
      } else if (step === 3) {
        setShowModal(false);
        setStep(1);
        setSelectedValue({
          industry: "",
          product: "",
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

  if (loading) {
    return (
      <div className={styles.quotePage} onClick={() => setShowModal(false)}>
        <div className={styles.quoteModal} onClick={(e) => e.stopPropagation()}>
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
          <div className={styles.quoteContent}>
            <p className={styles.quoteHeading}>Loading...</p>
            <p className={styles.quoteDesc}>
              Please wait while we load the available options.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.quotePage} onClick={() => setShowModal(false)}>
      <div className={styles.quoteModal} onClick={(e) => e.stopPropagation()}>
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
        {step !== 3 && (
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar}>
              <div
                className={styles.showProgress}
                style={{ width: `${step === 1 ? "50%" : "100%"}` }}
              ></div>
            </div>
          </div>
        )}
        <div className={styles.quoteContent}>
          <p className={styles.quoteHeading}>
            {step === 1
              ? "What You're Looking For"
              : step == 2
              ? "Your Contact Details"
              : ""}
          </p>
          <p className={styles.quoteDesc}>
            {step === 1
              ? "Select the industry and product you're interested in. This helps us connect you with the right solution."
              : step === 2
              ? "Just a few details so our team can get in touch with your quote."
              : ""}
          </p>
        </div>
        <div
          className={styles.quoteStepItems}
          style={{ height: `calc(100% - ${step === 3 ? "71px" : "190px"})` }}
        >
          {step === 1 ? (
            <StepOne
              industriesWithProducts={industriesWithProducts}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
            />
          ) : step === 2 ? (
            <StepTwo
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
            />
          ) : (
            <StepThree />
          )}
        </div>

        <button
          disabled={disabled}
          onClick={onBtnClick}
          className={styles.quoteButton}
        >
          {step === 1
            ? "NEXT"
            : step === 2
            ? "GET QUOTE"
            : "EXPLORE MORE PRODUCTS"}
        </button>
      </div>
    </div>
  );
};

export default GetQuoteModal;
