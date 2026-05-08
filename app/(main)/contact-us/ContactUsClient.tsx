"use client";
import React, { useState } from "react";
import styles from "./contactStyles.module.scss";
import Image from "next/image";
import { ICONS } from "@/constants/Images/images";
import {
  FormCheckbox,
  FormInput,
  FormSelect,
} from "@/component/molecules/quoteInputs/QuoteFormItem";
import { submitContactForm } from "@/utils/zohoCRM";

const ContactUsClient = () => {
  const [formData, setFormData] = useState<contactFormData>({
    name: "",
    email: "",
    mobileNumber: "",
    enquiry: "",
    comments: "",
    agreed: true,
  });
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    if (!formData.name || !formData.email || !formData.mobileNumber) return;
    setLoading(true);
    try {
      await submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.mobileNumber,
        webLeadType: "Contact Us Page",
        enquiryType: formData.enquiry,
        comments: formData.comments,
      });
      setFormSubmitted(true);
      // You can add a success state/thank you here
    } catch (e) {
      console.error("Error submitting contact-us form:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.contactUsContainer}>
      <h1>Contact us</h1>
      <div className={styles.contactForm}>
        <div className={styles.contactSect}>
          <FormInput
            label="Full Name"
            required
            selectedValue={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e })}
          />
          <FormInput
            label="E-mail Address"
            required
            selectedValue={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e })}
          />
        </div>
        <div className={styles.contactSect}>
          <FormInput
            label="Mobile Number"
            isMobileNumber
            required
            selectedValue={formData.mobileNumber}
            onChange={(e) => setFormData({ ...formData, mobileNumber: e })}
          />
          <FormSelect
            label="Enquiry Type"
            options={[
              "Sales Enquiry",
              "Spares / Parts Enquiry",
              "Rental / Hire Enquiry",
              "After-Sales Support",
              "General / Others",
            ]}
            selectedValue={formData.enquiry}
            onChange={(e) => setFormData({ ...formData, enquiry: e })}
          />
        </div>
        <div className={styles.commentSec}>
          <label htmlFor="comment">Comments</label>
          <textarea
            id="comment"
            rows={6}
            cols={50}
            className={styles.textArea}
            onChange={(e) =>
              setFormData({ ...formData, comments: e.target.value })
            }
          ></textarea>
        </div>
        <FormCheckbox
          label="I agree to receive product updates, brochures, and promotional offers from Autocracy Machinery via SMS, Email, or WhatsApp."
          selectedValue={formData.agreed}
          onChange={(value) => setFormData({ ...formData, agreed: value })}
        />
      </div>
      <button
        className={styles.contactSubmit}
        disabled={formSubmitted || loading}
        onClick={onSubmit}
      >
        {formSubmitted ? "SUBMITTED" : "SUBMIT"}
      </button>
      <div className={styles.addressBlock}>
        <div className={styles.companyAddress}>
          <h3>Autocracy Machinery Pvt. Ltd.</h3>
          <p>
            Plot No.72/A, I.D.A. Phase-1, Lane-3, B N Reddy Nagar, Cherlapalli,
            Hyderabad, Telangana – 500051, India
          </p>
        </div>
        <div className={styles.companyContact}>
          <div className={styles.contactInfo}>
            <Image
              src={ICONS.WHATSAPP}
              alt="Whatsapp Number"
              width={16}
              height={16}
            />
            <a href="tel:+918790473345">+91 87904 73345</a>
          </div>
          <div className={styles.contactInfo}>
            <Image src={ICONS.WHATSAPP} alt="email id" width={16} height={16} />
            <a href="mailto:sales@autocracymachinery.com">
              sales@autocracymachinery.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsClient;
