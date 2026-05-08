"use client";
import React, { useState } from "react";
import styles from "./dealerStyles.module.scss";
import {
  FormCheckbox,
  FormInput,
  FormRadio,
} from "@/component/molecules/quoteInputs/QuoteFormItem";
import { countryCodes } from "@/data/countryCodes";
import Image from "next/image";
import { ICONS } from "@/constants/Images/images";
import Link from "next/link";
import DealersDetailsCard from "@/component/molecules/dealersDetailsCard/DealersDetailsCard";
import useWindowSize from "@/hooks/useWindowSize";
import { SCREENS } from "@/constants";
import CustomDropdown from "@/component/molecules/customDropdown/CustomDropdown";
import { submitFindDealerForm } from "@/utils/zohoCRM";

interface DealerDetailsSubmittedModalProps {
  onHide: () => void;
  noDealersFound?: boolean;
}

interface FindADealerForm {
  role: "looking-for-dealer" | "become-dealer" | "";
  name: string;
  countryName: string;
  mobileNumber: string;
  agreed: boolean;
}

interface Dealer {
  id: number;
  name: string;
  country: string;
  state: string;
  contactNumber: string;
  email: string;
  fullAddress: string;
  availability: string;
}

const DealerDetailsSubmittedModal = ({
  onHide,
  noDealersFound,
}: DealerDetailsSubmittedModalProps) => {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalBox}>
        <Image
          width={24}
          height={24}
          className={styles.closeIcon}
          src={ICONS.CLOSE_ICON}
          alt={"close-icon"}
          onClick={onHide}
        />
        <div className={styles.stepTwoContainer}>
          <div className={styles.topPortion}>
            <div className={styles.yellowRound}>
              <Image
                src={
                  !noDealersFound
                    ? ICONS.ECLAMATORY_MARK
                    : ICONS.CHECK_ICON_BLACK
                }
                width={50}
                height={50}
                alt="check-mark"
              />
            </div>
            <div className={styles.topPortionContent}>
              <p className={styles.topPortionHeading}>
                {!noDealersFound ? "We're not in your area yet!" : "Thank You!"}
              </p>
              {!noDealersFound ? (
                <div className={styles.sharingContent}>
                  <p className={styles.thankYouForSharing}>
                    We don’t have a dealer in your selected location right now,
                    but our team can still assist you directly with product
                    details, pricing, and support.
                  </p>
                  <p className={styles.thankYouForSharing}>
                    We'll make it work! <br />
                    For quick help, feel free to contact us:
                  </p>
                </div>
              ) : (
                <p className={styles.thankYouForSharing}>
                  for choosing Autocracy Machinery! <br /> Our team will contact
                  you within 24 hours.
                </p>
              )}
            </div>
          </div>
          <div className={styles.bottomPortion}>
            <p className={styles.thankYouForSharing}>For quick help: </p>
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
          <Link href="/" className={styles.findBtn} style={{ width: "100%" }}>
            Explore More
          </Link>
        </div>
      </div>
    </div>
  );
};

const DealerClient = () => {
  const [formData, setFormData] = useState<FindADealerForm>({
    role: "looking-for-dealer",
    name: "",
    countryName: "",
    mobileNumber: "",
    agreed: true,
  });
  const [showSubmitDealerDetails, setShowSubmitDealerDetails] =
    useState<boolean>(false);
  const [showAvailableDealers, setShowAvailableDealers] =
    useState<boolean>(false);
  const [dealersData, setDealersData] = useState<Dealer[]>([]);
  const { width } = useWindowSize();
  const [loading, setLoading] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const findDealer = async () => {
    if (
      !formData.role ||
      !formData.countryName ||
      !formData.mobileNumber ||
      !formData.name
    ) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/dealers?country=${formData.countryName}`);
      const data = await res.json();

      if (
        data &&
        data.data &&
        Array.isArray(data.data) &&
        data.data.length > 0
      ) {
        setDealersData(data.data as Dealer[]);
        setShowAvailableDealers(true);
      } else {
        setDealersData([]);
        setShowSubmitDealerDetails(true);
        try {
          await submitFindDealerForm({
            name: formData.name,
            phone: formData.mobileNumber,
            country: formData.countryName,
            role: formData.role as "looking-for-dealer" | "become-dealer",
            webLeadType: "Find a Dealer",
          });
        } catch (e) {
          console.error("Error submitting Find a Dealer lead:", e);
        }
      }
    } catch (err) {
      console.log(err);
      setDealersData([]);
      setShowSubmitDealerDetails(true);
      try {
        await submitFindDealerForm({
          name: formData.name,
          phone: formData.mobileNumber,
          country: formData.countryName,
          role: formData.role as "looking-for-dealer" | "become-dealer",
          webLeadType: "Find a Dealer",
        });
      } catch (e) {
        console.error("Error submitting Find a Dealer lead:", e);
      }
    } finally {
      setLoading(false);
    }
  };

  const becomeDealer = () => {
    if (
      !formData.role ||
      !formData.countryName ||
      !formData.mobileNumber ||
      !formData.name
    )
      return;
    // Submit directly without showing popup
    (async () => {
      setLoading(true);
      try {
        await submitFindDealerForm({
          name: formData.name,
          phone: formData.mobileNumber,
          country: formData.countryName,
          role: formData.role as "looking-for-dealer" | "become-dealer",
          webLeadType: "Find a Dealer",
        });
        setFormSubmitted(true);
      } catch (e) {
        console.error("Error submitting Become Dealer lead:", e);
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <div className={styles.dealerContainer}>
      <h1 className={styles.dealerHeading}>
        {showAvailableDealers ? "Available Dealers" : "Find A Dealer"}{" "}
      </h1>
      {!showAvailableDealers ? (
        <div className={styles.formArea}>
          <div className={styles.radioBtnCont}>
            <FormRadio
              id="looking-dealer"
              name="user-intent"
              value="looking-for-dealer"
              label="I am looking for a dealer"
              checked={formData.role === "looking-for-dealer"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  role: e.target.value as FindADealerForm["role"],
                }))
              }
            />
            <FormRadio
              id="become-dealer"
              name="user-intent"
              value="become-dealer"
              label="I want to become a dealer"
              checked={formData.role === "become-dealer"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  role: e.target.value as FindADealerForm["role"],
                }))
              }
            />
          </div>

          <div className={styles.inputCont}>
            <div className={styles.nameNcountry}>
              <FormInput
                label="Full Name"
                required
                selectedValue={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e })}
                placeholder="Enter your full name"
              />
              <div className={styles.countryDropdownContainer}>
                <label className={styles.countryLabel}>
                  Select Country <span className={styles.required}>*</span>
                </label>
                <CustomDropdown
                  options={countryCodes.map((c) => ({
                    value: c.country,
                    label: c.country,
                  }))}
                  value={formData.countryName}
                  onChange={(value) =>
                    setFormData({ ...formData, countryName: value })
                  }
                  placeholder="Select your country"
                  className={styles.countryDropdown}
                />
              </div>
            </div>
            <FormInput
              label="Mobile Number"
              required
              selectedValue={formData.mobileNumber}
              onChange={(e) => setFormData({ ...formData, mobileNumber: e })}
              stylesheet={{
                width:
                  width && width >= SCREENS.MOBILE_LANDSCAPE ? "50%" : "100%",
              }}
              isMobileNumber
              placeholder="Enter your mobile number"
            />
            <FormCheckbox
              label="I agree to receive product updates, brochures, and promotional offers from Autocracy Machinery via SMS, Email, or WhatsApp."
              selectedValue={formData.agreed}
              onChange={(e) => setFormData({ ...formData, agreed: e })}
            />
          </div>
          <button
            className={styles.findBtn}
            style={{
              width:
                width && width >= SCREENS.MOBILE_LANDSCAPE
                  ? "11.875rem"
                  : "100%",
            }}
            disabled={
              !formData.role ||
              !formData.countryName ||
              !formData.mobileNumber ||
              !formData.name ||
              loading ||
              formSubmitted
            }
            onClick={() =>
              formData.role === "become-dealer" ? becomeDealer() : findDealer()
            }
          >
            {formData.role === "become-dealer"
              ? formSubmitted
                ? "SUBMITTED"
                : "SUBMIT"
              : "FIND NOW"}
          </button>
        </div>
      ) : (
        <div className={styles.dealerList}>
          {dealersData &&
            dealersData.map((dealer: Dealer, idx: number) => (
              <DealersDetailsCard key={idx} data={dealer} />
            ))}
        </div>
      )}
      {showSubmitDealerDetails && (
        <DealerDetailsSubmittedModal
          onHide={() => {
            setShowSubmitDealerDetails(false);
            setFormData({
              role: "",
              name: "",
              countryName: "",
              mobileNumber: "",
              agreed: true,
            });
          }}
        />
      )}
      {showAvailableDealers && dealersData.length === 0 && (
        <DealerDetailsSubmittedModal
          noDealersFound
          onHide={() => {
            setShowAvailableDealers(false);
            setFormSubmitted(false);
            setFormData({
              role: "",
              name: "",
              countryName: "",
              mobileNumber: "",
              agreed: true,
            });
          }}
        />
      )}
    </div>
  );
};

export default DealerClient;
