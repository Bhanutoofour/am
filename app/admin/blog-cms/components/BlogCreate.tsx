import { useEffect } from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  useNotify,
  useRedirect,
  required,
  ReferenceArrayInput,
  SelectArrayInput,
} from "react-admin";
import { RichTextInput } from "./RichTextInput";
import { S3FileInput } from "../../components/S3FileInput";
import { revalidateBlogData } from "@/actions/blogAction";

export const BlogCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  // Force light mode for blog pages
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    const body = document.body;
    body.classList.remove("dark");
    const muiTheme = document.querySelector('[data-mui-color-scheme]');
    if (muiTheme) {
      muiTheme.setAttribute('data-mui-color-scheme', 'light');
    }
  }, []);

  const onSuccess = async () => {
    await revalidateBlogData();
    notify("Blog created successfully");
    redirect("list", "blogs");
  };

  const validate = (values: any) => {
    const errors: any = {};

    if (!values.title || values.title.trim() === "") {
      errors.title = "Title is required";
    }
    if (!values.slug || values.slug.trim() === "") {
      errors.slug = "Slug is required";
    }
    if (!values.description || values.description.trim() === "") {
      errors.description = "Description is required";
    }
    if (!values.banner || values.banner.trim() === "") {
      errors.banner = "Banner image is required";
    }
    if (!values.bannerAltText || values.bannerAltText.trim() === "") {
      errors.bannerAltText = "Banner Alt Text is required";
    }
    if (!values.content || values.content.trim() === "") {
      errors.content = "Content is required";
    }

    return errors;
  };

  const transform = (data: any) => {
    // Create SEO metadata object if provided
    if (
      data.seoPageTitle ||
      data.seoPageDescription ||
      data.seoPageKeywords ||
      data.seoSocialTitle ||
      data.seoSocialDescription ||
      data.seoSocialImage
    ) {
      const seoMetadata: any = {};
      if (data.seoPageTitle) seoMetadata.pageTitle = data.seoPageTitle;
      if (data.seoPageDescription)
        seoMetadata.pageDescription = data.seoPageDescription;
      if (data.seoPageKeywords) seoMetadata.pageKeywords = data.seoPageKeywords;
      if (data.seoSocialTitle) seoMetadata.socialTitle = data.seoSocialTitle;
      if (data.seoSocialDescription)
        seoMetadata.socialDescription = data.seoSocialDescription;
      if (data.seoSocialImage) seoMetadata.socialImage = data.seoSocialImage;

      data.seoMetadata = seoMetadata;

      // Remove individual SEO fields
      delete data.seoPageTitle;
      delete data.seoPageDescription;
      delete data.seoPageKeywords;
      delete data.seoSocialTitle;
      delete data.seoSocialDescription;
      delete data.seoSocialImage;
    }

    // Ensure slug is lowercase and formatted correctly
    if (data.slug) {
      data.slug = data.slug
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
    }

    return data;
  };

  return (
    <Create mutationOptions={{ onSuccess }} transform={transform}>
      <SimpleForm validate={validate}>
        {/* Basic Information Section */}
        <div>
          <h3 style={{ textDecoration: "underline" }}>Basic Information</h3>
          <TextInput source="title" validate={required()} fullWidth />
          <TextInput
            source="slug"
            validate={required()}
            fullWidth
            helperText="URL-friendly slug (e.g., my-blog-post)"
          />
          <TextInput
            source="description"
            multiline
            rows={3}
            validate={required()}
            fullWidth
            helperText="Short description/summary of the blog"
          />
          <S3FileInput
            source="banner"
            label="Banner"
            folder="blogs/banners"
            validate={required()}
          />
          <TextInput
            source="bannerAltText"
            label="Banner Alt Text"
            validate={required()}
            fullWidth
          />
          <BooleanInput source="published" defaultValue={false} />
        </div>

        {/* Relationships Section */}
        <div>
          <h3 style={{ textDecoration: "underline" }}>Relationships</h3>
          <ReferenceArrayInput
            source="industryIds"
            reference="industries"
            label="Industries"
          >
            <SelectArrayInput optionText="title" fullWidth />
          </ReferenceArrayInput>
          <ReferenceArrayInput
            source="productIds"
            reference="products"
            label="Products"
          >
            <SelectArrayInput optionText="title" fullWidth />
          </ReferenceArrayInput>
          <ReferenceArrayInput
            source="modelIds"
            reference="models"
            label="Models"
          >
            <SelectArrayInput optionText="modelTitle" fullWidth />
          </ReferenceArrayInput>
        </div>

        {/* Content Section */}
        <div>
          <h3 style={{ textDecoration: "underline" }}>Content</h3>
          <RichTextInput source="content" validate={required()} />
        </div>

        {/* SEO Settings Section */}
        <div>
          <h3 style={{ textDecoration: "underline" }}>SEO Settings (Optional)</h3>

          <div style={{ marginBottom: "20px" }}>
            <h4>Page SEO</h4>
            <TextInput
              source="seoPageTitle"
              label="Page Title"
              placeholder="Blog Title - Autocracy"
              fullWidth
            />
            <TextInput
              source="seoPageDescription"
              label="Page Description"
              multiline
              rows={3}
              placeholder="Enter SEO description for search engines"
              fullWidth
            />
            <TextInput
              source="seoPageKeywords"
              label="Keywords"
              placeholder="blog, machinery, equipment"
              fullWidth
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>Social Media</h4>
            <TextInput
              source="seoSocialTitle"
              label="Social Media Title"
              placeholder="Blog Title - Autocracy"
              fullWidth
            />
            <TextInput
              source="seoSocialDescription"
              label="Social Media Description"
              multiline
              rows={3}
              placeholder="Description for social media sharing"
              fullWidth
            />
            <TextInput
              source="seoSocialImage"
              label="Social Media Image URL"
              placeholder="URL for social media preview image"
              fullWidth
            />
          </div>
        </div>
      </SimpleForm>
    </Create>
  );
};
