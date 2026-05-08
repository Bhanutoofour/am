"use client";
import React, { useRef, useState } from "react";
import styles from "./selectStyles.module.scss";
import { countryCodes } from "@/data/countryCodes";
import useOutsideClick from "@/hooks/useOutsideClick";

interface FormSelectProps {
  label: string;
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}
interface FormInputProps {
  label: string;
  required?: boolean;
  selectedValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  type?: string;
  isMobileNumber?: boolean;
  stylesheet?: object;
}
interface FormCheckboxProps {
  label: string;
  required?: boolean;
  selectedValue: boolean;
  onChange: (value: boolean) => void;
}
interface FormRadioProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  required = false,
  options,
  selectedValue,
  onChange,
  disabled = false,
}) => {
  return (
    <div className={styles.selectWrapper}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <select
        className={styles.select}
        value={selectedValue}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
      >
        <option value="" disabled hidden>
          -- Select {label.toLowerCase()} --
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export const FormInput: React.FC<FormInputProps> = ({
  label,
  required = false,
  selectedValue,
  onChange,
  placeholder = "Type here",
  name,
  type = "text",
  isMobileNumber,
  stylesheet,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>({
    country: "India",
    code: "+91",
    flag: "🇮🇳",
  });
  const countryCodeRef = useRef<HTMLDivElement>(null);

  useOutsideClick(countryCodeRef as React.RefObject<HTMLElement>, () => {
    if (open) {
      setOpen((prev) => !prev);
    }
  });

  const handleSelect = (country: Country) => {
    setSelectedCountry(country);
    setOpen(false);
  };

  return (
    <div className={styles.formInputWrapper} style={{ ...stylesheet }}>
      <label className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>

      {isMobileNumber ? (
        <div className={styles.mobileWrapper}>
          {/* Custom dropdown trigger */}
          <div
            className={styles.dropdownTrigger}
            onClick={() => setOpen((prev: boolean) => !prev)}
          >
            {selectedCountry ? (
              <>
                <span>{selectedCountry.flag}</span>{" "}
                <span>{selectedCountry.code}</span>
              </>
            ) : (
              <span>🇮🇳 +91</span>
            )}
          </div>

          {/* Scrollable dropdown */}
          {open && (
            <div className={styles.dropdownMenu} ref={countryCodeRef}>
              {countryCodes.map((opt: Country) => (
                <div
                  key={opt.country}
                  className={styles.dropdownOption}
                  onClick={() => handleSelect(opt)}
                >
                  {opt.flag} {opt.code}
                </div>
              ))}
            </div>
          )}

          {/* Number input */}
          <input
            className={styles.mobileInput}
            type="number"
            value={parseInt(selectedValue.split(" ")?.[1] || "") || ""}
            onChange={(e) =>
              onChange(`${selectedCountry?.code} ${e.target.value}`)
            }
            placeholder={placeholder}
            name={name}
            required={required}
          />
        </div>
      ) : (
        <input
          className={styles.input}
          type={type}
          value={selectedValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          name={name}
          required={required}
        />
      )}
    </div>
  );
};

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  required = false,
  selectedValue,
  onChange,
}) => {
  return (
    <div className={styles.formCheckboxWrapper}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={selectedValue}
          onChange={(e) => onChange(e.target.checked)}
          required={required}
          className={styles.checkboxInput}
        />
        <span className={styles.checkboxCustom}></span>
        <span className={styles.labelText}>{label}</span>
      </label>
    </div>
  );
};

export const FormRadio: React.FC<FormRadioProps> = ({
  id,
  name,
  value,
  label,
  checked = false,
  onChange,
  disabled = false,
}) => {
  return (
    <label htmlFor={id} className={styles.radioWrapper}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={styles.radioInput}
      />
      <span className={styles.radioCustom}></span>
      <span className={styles.radioLabel}>{label}</span>
    </label>
  );
};
