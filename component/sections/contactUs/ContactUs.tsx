import React, { useState } from "react";
import Image from "next/image";
import styles from "./ContactUs.module.scss";
import { submitContactForm } from "@/utils/zohoCRM";

const ContactUs: React.FC<{
  image: string;
  altText: string;
  productName: string;
  industry?: string;
  model?: string;
}> = ({ image, altText, productName, industry, model }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.name || !formData.email || !formData.phone) {
        return;
      }

      setIsSubmitting(true);

      try {
        // Submit to Zoho CRM
        const success = await submitContactForm({
          ...formData,
          product: productName,
          industry: industry,
          model: model,
          webLeadType: "Need Assistance with Product",
        });

        if (success) {
          setIsSubmitted(true);
          setFormData({ name: "", email: "", phone: "" });
        } else {
          alert("Failed to submit form. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting contact form:", error);
        alert("Failed to submit form. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Unexpected error in handleSubmit:", error);
      setIsSubmitting(false);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isSubmitted) {
    return (
      <div className={styles.contactUsContainer}>
        <div className={styles.imageBox}>
          <Image
            src={image}
            alt={altText}
            width={800}
            height={600}
            className={styles.trencherImage}
          />
        </div>
        <div className={styles.needAssistance}>
          <h2 className={styles.assistanceHeader}>Thank You!</h2>
          <p
            style={{ marginBottom: "20px", color: "#666", textAlign: "center" }}
          >
            We've received your message and will get back to you shortly.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className={styles.submitButton}
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contactUsContainer}>
      <div className={styles.imageBox}>
        <Image
          src={image}
          alt={altText}
          width={800}
          height={600}
          className={styles.trencherImage}
        />
      </div>
      <div className={styles.needAssistance}>
        <h2 className={styles.assistanceHeader}>
          {`Need Assistance with ${productName}?`}
        </h2>
        <form className={styles.assistanceForm} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">First name and last name *</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Type here"
              required
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail address *</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Type here"
              required
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Phone *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Type here"
              required
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={
              isSubmitting ||
              !formData.name ||
              !formData.email ||
              !formData.phone
            }
          >
            {isSubmitting ? "SUBMITTING..." : "SUBMIT FORM"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
