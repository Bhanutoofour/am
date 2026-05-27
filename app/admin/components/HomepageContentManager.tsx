"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { HomepageCmsContent } from "@/types/homepage";
import styles from "../dashboard/dashboard.module.scss";

type ArrayKey =
  | "buildForIndia"
  | "awards"
  | "certificates"
  | "media"
  | "testimonials"
  | "clients";

const emptyContent: HomepageCmsContent = {
  srOnlyHeading: "",
  contentBuildTitle: "",
  buildForIndia: [],
  awardsTitle: "Awards",
  awards: [],
  certificates: [],
  media: [],
  testimonials: [],
  clients: [],
  faqCta: {
    faqEyebrow: "FAQs",
    faqTitle: "",
    faqIntro: "",
    faqs: [],
    ctaImage: "",
    ctaImageAltText: "",
    ctaEyebrow: "",
    ctaTitle: "",
    ctaIntro: "",
  },
};

const emptyRows = {
  buildForIndia: { title: "", desc: "" },
  awards: { title: "", imageSrc: "" },
  certificates: { title: "", imageSrc: "" },
  media: {
    publication: "",
    title: "",
    desc: "",
    imageSrc: "",
    link: "",
    width: 100,
    height: 40,
  },
  testimonials: { quote: "", author: "", location: "" },
  clients: "",
  faqs: { question: "", answer: "" },
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

async function uploadCmsImage(file: File, folder: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    body: formData,
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.details || payload?.error || "Upload failed");
  }

  return String(payload.url || "");
}

function Field({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className={styles.fieldControl}>
      <span>{label}</span>
      {textarea ? (
        <textarea value={String(value || "")} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input value={String(value || "")} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function ImageField({
  label,
  value,
  folder,
  onChange,
  onUploadState,
}: {
  label: string;
  value: string;
  folder: string;
  onChange: (value: string) => void;
  onUploadState: (message: string) => void;
}) {
  return (
    <div className={styles.uploadField}>
      <div className={styles.uploadFieldHeader}>
        <span className={styles.uploadLabel}>{label}</span>
        {value ? (
          <a className={styles.uploadPreviewLink} href={value} target="_blank" rel="noreferrer">
            Preview
          </a>
        ) : null}
      </div>
      <input className={styles.input} value={value || ""} onChange={(event) => onChange(event.target.value)} />
      <label className={styles.fileButton}>
        Upload / replace
        <input
          type="file"
          accept="image/*"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;

            try {
              onUploadState(`Uploading ${file.name}...`);
              const url = await uploadCmsImage(file, folder);
              onChange(url);
              onUploadState("Upload complete. Save changes to publish it.");
            } catch (error) {
              onUploadState(error instanceof Error ? error.message : "Upload failed");
            } finally {
              event.target.value = "";
            }
          }}
        />
      </label>
    </div>
  );
}

export default function HomepageContentManager() {
  const [content, setContent] = useState<HomepageCmsContent>(emptyContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetch("/api/homepage-content")
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.details || payload?.error || "Failed to load homepage content");
        if (isMounted) setContent(payload.content || emptyContent);
      })
      .catch((err) => {
        if (isMounted) setError(err instanceof Error ? err.message : "Failed to load homepage content");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const setTopField = (key: keyof HomepageCmsContent, value: unknown) => {
    setContent((current) => ({ ...current, [key]: value }));
  };

  const setFaqCtaField = (key: keyof HomepageCmsContent["faqCta"], value: unknown) => {
    setContent((current) => ({
      ...current,
      faqCta: { ...current.faqCta, [key]: value },
    }));
  };

  const updateArrayItem = <K extends ArrayKey>(
    key: K,
    index: number,
    field: string,
    value: string,
  ) => {
    setContent((current) => {
      const rows = [...(current[key] as any[])];
      rows[index] =
        typeof rows[index] === "string"
          ? value
          : { ...rows[index], [field]: field === "width" || field === "height" ? Number(value) || undefined : value };
      return { ...current, [key]: rows };
    });
  };

  const addArrayItem = (key: ArrayKey) => {
    setContent((current) => ({
      ...current,
      [key]: [...(current[key] as any[]), clone(emptyRows[key])],
    }));
  };

  const removeArrayItem = (key: ArrayKey, index: number) => {
    setContent((current) => ({
      ...current,
      [key]: (current[key] as any[]).filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    setContent((current) => {
      const faqs = [...current.faqCta.faqs];
      faqs[index] = { ...faqs[index], [field]: value };
      return { ...current, faqCta: { ...current.faqCta, faqs } };
    });
  };

  const addFaq = () => {
    setContent((current) => ({
      ...current,
      faqCta: {
        ...current.faqCta,
        faqs: [...current.faqCta.faqs, clone(emptyRows.faqs)],
      },
    }));
  };

  const removeFaq = (index: number) => {
    setContent((current) => ({
      ...current,
      faqCta: {
        ...current.faqCta,
        faqs: current.faqCta.faqs.filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus("");
    setError("");

    try {
      const response = await fetch("/api/homepage-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.details || payload?.error || "Save failed");
      setContent(payload.content);
      setStatus("Homepage content saved and revalidated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className={styles.notice}>Loading homepage content...</div>;
  }

  return (
    <article className={styles.panel} id="homepage-content-editor">
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Homepage Content</h2>
        <div className={styles.panelActions}>
          <button className={styles.buttonDark} type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Homepage"}
          </button>
        </div>
      </div>
      <div className={styles.panelBody}>
        {status ? <p className={styles.statusText}>{status}</p> : null}
        {error ? <p className={styles.errorText}>{error}</p> : null}
        <div className={styles.cmsForm}>
          <FormSection title="Intro and Built Section" text="Edit hidden SEO heading and the homepage Built for India cards.">
            <div className={styles.formGrid}>
              <Field label="Screen-reader H1" value={content.srOnlyHeading} onChange={(value) => setTopField("srOnlyHeading", value)} />
              <Field label="Built section title" value={content.contentBuildTitle} onChange={(value) => setTopField("contentBuildTitle", value)} textarea />
            </div>
            <RepeatHeader title="Built cards" onAdd={() => addArrayItem("buildForIndia")} />
            {content.buildForIndia.map((item, index) => (
              <div className={styles.repeatGroup} key={`build-${index}`}>
                <div className={styles.repeatRowTwo}>
                  <input value={item.title} onChange={(event) => updateArrayItem("buildForIndia", index, "title", event.target.value)} placeholder="Title" />
                  <input value={item.desc} onChange={(event) => updateArrayItem("buildForIndia", index, "desc", event.target.value)} placeholder="Description" />
                  <button className={styles.buttonGhost} type="button" onClick={() => removeArrayItem("buildForIndia", index)}>Remove</button>
                </div>
              </div>
            ))}
          </FormSection>

          <ImageListSection
            title="Awards"
            items={content.awards}
            folder="homepage/awards"
            onAdd={() => addArrayItem("awards")}
            onRemove={(index) => removeArrayItem("awards", index)}
            onText={(index, value) => updateArrayItem("awards", index, "title", value)}
            onImage={(index, value) => updateArrayItem("awards", index, "imageSrc", value)}
            setStatus={setStatus}
          />

          <ImageListSection
            title="Certifications"
            items={content.certificates}
            folder="homepage/certificates"
            onAdd={() => addArrayItem("certificates")}
            onRemove={(index) => removeArrayItem("certificates", index)}
            onText={(index, value) => updateArrayItem("certificates", index, "title", value)}
            onImage={(index, value) => updateArrayItem("certificates", index, "imageSrc", value)}
            setStatus={setStatus}
          />

          <FormSection title="Media Mentions" text="Edit publication cards, links, and logos shown in the homepage media marquee.">
            <RepeatHeader title="Media cards" onAdd={() => addArrayItem("media")} />
            {content.media.map((item, index) => (
              <div className={styles.detailEditor} key={`media-${index}`}>
                <div className={styles.formGrid}>
                  <Field label="Publication" value={item.publication} onChange={(value) => updateArrayItem("media", index, "publication", value)} />
                  <Field label="Title" value={item.title} onChange={(value) => updateArrayItem("media", index, "title", value)} />
                  <Field label="Description" value={item.desc} onChange={(value) => updateArrayItem("media", index, "desc", value)} textarea />
                  <Field label="Link" value={item.link} onChange={(value) => updateArrayItem("media", index, "link", value)} />
                  <Field label="Logo width" value={item.width || ""} onChange={(value) => updateArrayItem("media", index, "width", value)} />
                  <Field label="Logo height" value={item.height || ""} onChange={(value) => updateArrayItem("media", index, "height", value)} />
                </div>
                <ImageField label="Logo image URL" value={item.imageSrc || ""} folder="homepage/media" onChange={(value) => updateArrayItem("media", index, "imageSrc", value)} onUploadState={setStatus} />
                <button className={styles.buttonGhost} type="button" onClick={() => removeArrayItem("media", index)}>Remove media card</button>
              </div>
            ))}
          </FormSection>

          <FormSection title="Testimonials and Clients" text="Edit customer quotes and client logos.">
            <RepeatHeader title="Testimonials" onAdd={() => addArrayItem("testimonials")} />
            {content.testimonials.map((item, index) => (
              <div className={styles.repeatGroup} key={`testimonial-${index}`}>
                <div className={styles.formGrid}>
                  <Field label="Quote" value={item.quote} onChange={(value) => updateArrayItem("testimonials", index, "quote", value)} textarea />
                  <Field label="Author" value={item.author} onChange={(value) => updateArrayItem("testimonials", index, "author", value)} />
                  <Field label="Location" value={item.location} onChange={(value) => updateArrayItem("testimonials", index, "location", value)} />
                </div>
                <button className={styles.buttonGhost} type="button" onClick={() => removeArrayItem("testimonials", index)}>Remove testimonial</button>
              </div>
            ))}
            <RepeatHeader title="Client logos" onAdd={() => addArrayItem("clients")} />
            {content.clients.map((logo, index) => (
              <div className={styles.repeatGroup} key={`client-${index}`}>
                <ImageField label="Client logo URL" value={logo} folder="homepage/clients" onChange={(value) => updateArrayItem("clients", index, "", value)} onUploadState={setStatus} />
                <button className={styles.buttonGhost} type="button" onClick={() => removeArrayItem("clients", index)}>Remove client logo</button>
              </div>
            ))}
          </FormSection>

          <FormSection title="FAQ and CTA" text="Edit the homepage FAQs, CTA copy, and CTA image.">
            <div className={styles.formGrid}>
              <Field label="FAQ eyebrow" value={content.faqCta.faqEyebrow} onChange={(value) => setFaqCtaField("faqEyebrow", value)} />
              <Field label="FAQ title" value={content.faqCta.faqTitle} onChange={(value) => setFaqCtaField("faqTitle", value)} />
              <Field label="FAQ intro" value={content.faqCta.faqIntro} onChange={(value) => setFaqCtaField("faqIntro", value)} textarea />
              <Field label="CTA eyebrow" value={content.faqCta.ctaEyebrow} onChange={(value) => setFaqCtaField("ctaEyebrow", value)} />
              <Field label="CTA title" value={content.faqCta.ctaTitle} onChange={(value) => setFaqCtaField("ctaTitle", value)} />
              <Field label="CTA intro" value={content.faqCta.ctaIntro} onChange={(value) => setFaqCtaField("ctaIntro", value)} textarea />
              <Field label="CTA image alt text" value={content.faqCta.ctaImageAltText} onChange={(value) => setFaqCtaField("ctaImageAltText", value)} />
            </div>
            <ImageField label="CTA image URL" value={content.faqCta.ctaImage} folder="homepage/faq-cta" onChange={(value) => setFaqCtaField("ctaImage", value)} onUploadState={setStatus} />
            <RepeatHeader title="FAQs" onAdd={addFaq} />
            {content.faqCta.faqs.map((faq, index) => (
              <div className={styles.repeatGroup} key={`faq-${index}`}>
                <div className={styles.formGrid}>
                  <Field label="Question" value={faq.question} onChange={(value) => updateFaq(index, "question", value)} />
                  <Field label="Answer" value={faq.answer} onChange={(value) => updateFaq(index, "answer", value)} textarea />
                </div>
                <button className={styles.buttonGhost} type="button" onClick={() => removeFaq(index)}>Remove FAQ</button>
              </div>
            ))}
          </FormSection>
        </div>
      </div>
    </article>
  );
}

function FormSection({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.formSection}>
      <div className={styles.formSectionHeader}>
        <div>
          <h4>{title}</h4>
          <p>{text}</p>
        </div>
      </div>
      <div className={styles.formSectionBody}>{children}</div>
    </section>
  );
}

function RepeatHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className={styles.repeatHeader}>
      <p>{title}</p>
      <button className={styles.button} type="button" onClick={onAdd}>
        Add
      </button>
    </div>
  );
}

function ImageListSection({
  title,
  items,
  folder,
  onAdd,
  onRemove,
  onText,
  onImage,
  setStatus,
}: {
  title: string;
  items: RecognitionsDataType[];
  folder: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onText: (index: number, value: string) => void;
  onImage: (index: number, value: string) => void;
  setStatus: (message: string) => void;
}) {
  return (
    <FormSection title={title} text={`Edit ${title.toLowerCase()} titles and images shown on the homepage.`}>
      <RepeatHeader title={`${title} items`} onAdd={onAdd} />
      {items.map((item, index) => (
        <div className={styles.repeatGroup} key={`${title}-${index}`}>
          <div className={styles.formGrid}>
            <Field label="Title" value={item.title} onChange={(value) => onText(index, value)} />
            <ImageField label="Image URL" value={item.imageSrc} folder={folder} onChange={(value) => onImage(index, value)} onUploadState={setStatus} />
          </div>
          <button className={styles.buttonGhost} type="button" onClick={() => onRemove(index)}>
            Remove
          </button>
        </div>
      ))}
    </FormSection>
  );
}
