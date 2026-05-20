"use client";

import { useRef, useState } from "react";
import { Button, LinearProgress, TextField } from "@mui/material";
import { useInput, useNotify } from "react-admin";
import { useFormContext } from "react-hook-form";

type S3FileInputProps = {
  source: string;
  label: string;
  folder?: string;
  accept?: string;
  helperText?: string;
  placeholder?: string;
  defaultValue?: string;
  validate?: any;
  fullWidth?: boolean;
  uploadSuccessMessage?: string;
  replacementSuccessMessage?: string;
};

export const S3FileInput = ({
  source,
  label,
  folder = "admin",
  accept = "image/*,application/pdf",
  helperText,
  placeholder,
  defaultValue,
  validate,
  fullWidth = true,
  uploadSuccessMessage = "File uploaded successfully",
  replacementSuccessMessage,
}: S3FileInputProps) => {
  const notify = useNotify();
  const { setValue } = useFormContext();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const {
    field,
    fieldState: { error },
  } = useInput({ source, validate, defaultValue });
  const currentValue = field.value || "";
  const isImage =
    typeof currentValue === "string" &&
    /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i.test(currentValue);

  const handleUpload = async (file?: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    setIsUploading(true);
    try {
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.details || payload?.error || "Upload failed");
      }

      const wasReplacing = Boolean(currentValue);
      setValue(source, payload.url, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      field.onChange(payload.url);
      field.onBlur();
      notify(
        wasReplacing && replacementSuccessMessage
          ? replacementSuccessMessage
          : uploadSuccessMessage,
        { type: "success" }
      );
    } catch (error) {
      notify(error instanceof Error ? error.message : "Upload failed", {
        type: "error",
      });
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div style={{ width: fullWidth ? "100%" : undefined, marginBottom: 16 }}>
      <TextField
        label={label}
        value={currentValue}
        onChange={field.onChange}
        onBlur={field.onBlur}
        name={field.name}
        fullWidth={fullWidth}
        error={Boolean(error)}
        helperText={error?.message || helperText}
        placeholder={placeholder}
        margin="dense"
      />
      {isImage && (
        <img
          src={currentValue}
          alt=""
          style={{
            width: 220,
            maxWidth: "100%",
            height: 124,
            objectFit: "cover",
            border: "1px solid #d7d7d7",
            display: "block",
            marginBottom: 12,
          }}
        />
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(event) => handleUpload(event.target.files?.[0])}
      />
      <Button
        variant="outlined"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? "Uploading..." : "Upload file"}
      </Button>
      {isUploading && <LinearProgress sx={{ marginTop: 1, maxWidth: 360 }} />}
    </div>
  );
};
