import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  BooleanInput,
  ReferenceInput,
  ReferenceArrayInput,
  SelectArrayInput,
  ArrayInput,
  SimpleFormIterator,
  required,
  minLength,
  useNotify,
  useRedirect,
  useGetOne,
} from "react-admin";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import { revalidateModelData } from "@/actions/modelAction";
import { S3FileInput } from "./S3FileInput";

const machineTypeChoices = [
  { id: "Attachment", name: "Attachment" },
  { id: "Equipment", name: "Equipment" },
];

const validate = (values: any) => {
  const errors: any = {};
  if (!values.industryIds || values.industryIds.length === 0) {
    errors.industryIds = "At least one industry must be selected";
  }
  if (!values.series) {
    errors.series = "Series is required";
  }
  if (!values.modelNumber || values.modelNumber.trim() === "") {
    errors.modelNumber = "Model Number is required";
  }
  if (!values.modelTitle || values.modelTitle.trim() === "") {
    errors.modelTitle = "Model Title is required";
  }
  if (!values.machineType) {
    errors.machineType = "Machine Type is required";
  }
  if (!values.productId) {
    errors.productId = "Product is required";
  }
  if (!values.thumbnail || values.thumbnail.trim() === "") {
    errors.thumbnail = "Thumbnail is required";
  }
  if (!values.coverImage || values.coverImage.trim() === "") {
    errors.coverImage = "Cover Image is required";
  }
  if (!values.thumbnailAltText || values.thumbnailAltText.trim() === "") {
    errors.thumbnailAltText = "Thumbnail Alt Text is required";
  }
  if (!values.coverImageAltText || values.coverImageAltText.trim() === "") {
    errors.coverImageAltText = "Cover Image Alt Text is required";
  }
  if (!values.shortDescription || values.shortDescription.trim() === "") {
    errors.shortDescription = "Short Description is required";
  }

  // Essential SEO Validation
  if (!values.seoPageTitle || values.seoPageTitle.trim() === "") {
    errors.seoPageTitle = "Page Title is required";
  }
  if (!values.seoPageDescription || values.seoPageDescription.trim() === "") {
    errors.seoPageDescription = "Page Description is required";
  }
  if (!values.seoPageKeywords || values.seoPageKeywords.trim() === "") {
    errors.seoPageKeywords = "Page Keywords is required";
  }
  if (!values.seoSocialTitle || values.seoSocialTitle.trim() === "") {
    errors.seoSocialTitle = "Social Title is required";
  }
  if (
    !values.seoSocialDescription ||
    values.seoSocialDescription.trim() === ""
  ) {
    errors.seoSocialDescription = "Social Description is required";
  }
  if (!values.seoSocialImage || values.seoSocialImage.trim() === "") {
    errors.seoSocialImage = "Social Image URL is required";
  }

  // Key Features
  if (!values.keyFeatures || values.keyFeatures.length === 0) {
    errors.keyFeatures = "At least one key feature is required";
  } else {
    const keyFeatureErrors = values.keyFeatures.map((feature: any) => {
      if (!feature.name || !feature.value) {
        return "Both feature name and value are required";
      }
      return undefined;
    });
    if (keyFeatureErrors.some(Boolean)) {
      errors.keyFeatures = keyFeatureErrors;
    }
  }

  // Model Description
  if (!values.modelDescription || values.modelDescription.length === 0) {
    errors.modelDescription = "At least one model description is required";
  } else {
    const modelDescriptionErrors = values.modelDescription.map((desc: any) => {
      const descErrors: any = {};
      if (!desc.image || desc.image.trim() === "") {
        descErrors.image = "Image is required";
      }
      if (!desc.imageAltText || desc.imageAltText.trim() === "") {
        descErrors.imageAltText = "Image Alt Text is required";
      }
      if (!desc.title || desc.title.trim() === "") {
        descErrors.title = "Title is required";
      }
      if (
        !desc.description ||
        !Array.isArray(desc.description) ||
        desc.description.length === 0
      ) {
        descErrors.description = "At least one description line is required";
      } else {
        const descLineErrors = desc.description.map((line: any) =>
          !line || line.trim() === ""
            ? "Description line is required"
            : undefined
        );
        if (descLineErrors.some(Boolean)) {
          descErrors.description = descLineErrors;
        }
      }
      return Object.keys(descErrors).length > 0 ? descErrors : undefined;
    });
    if (modelDescriptionErrors.some(Boolean)) {
      errors.modelDescription = modelDescriptionErrors;
    }
  }

  return errors;
};

const SeriesSelectInput = (props: any) => {
  const productId = useWatch({ name: "productId" });
  const { data: product } = useGetOne("products", { id: productId });

  const choices = useMemo(() => {
    if (!product?.series) return [];
    return product.series.map((series: string) => ({
      id: series,
      name: series,
    }));
  }, [product?.series]);

  return <SelectInput {...props} choices={choices} disabled={!productId} />;
};

export const ModelsCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = async () => {
    // Revalidate the home page to show updated data
    await revalidateModelData();
    notify("Model created successfully");
    redirect("list", "models");
  };

  const transform = (data: any) => {
    const { specsIntroHeading, specsIntroParagraph, ...rest } = data;

    const h =
      typeof specsIntroHeading === "string" ? specsIntroHeading.trim() : "";
    const p =
      typeof specsIntroParagraph === "string" ? specsIntroParagraph.trim() : "";
    const specsTableIntro = {
      ...(h ? { heading: h } : {}),
      ...(p ? { paragraph: p } : {}),
    };

    // Transform SEO metadata
    const seoMetadata: any = {};

    // Page SEO
    if (rest.seoPageTitle) seoMetadata.pageTitle = rest.seoPageTitle;
    if (rest.seoPageDescription)
      seoMetadata.pageDescription = rest.seoPageDescription;
    if (rest.seoPageKeywords) seoMetadata.pageKeywords = rest.seoPageKeywords;

    // Social SEO
    if (rest.seoSocialTitle) seoMetadata.socialTitle = rest.seoSocialTitle;
    if (rest.seoSocialDescription)
      seoMetadata.socialDescription = rest.seoSocialDescription;
    if (rest.seoSocialImage) seoMetadata.socialImage = rest.seoSocialImage;

    // Structured Data
    if (
      rest.seoStructuredDataType ||
      rest.seoStructuredDataName ||
      rest.seoStructuredDataDescription ||
      rest.seoStructuredDataBrand ||
      rest.seoStructuredDataSku ||
      rest.seoStructuredDataMaterial ||
      rest.seoStructuredDataCondition ||
      rest.seoStructuredDataCategory ||
      rest.seoStructuredDataAvailability ||
      rest.seoStructuredDataRatingValue ||
      rest.seoStructuredDataReviewCount ||
      rest.seoCertifications ||
      rest.seoWarrantyDuration
    ) {
      seoMetadata.structuredData = {};

      if (rest.seoStructuredDataType)
        seoMetadata.structuredData.type = rest.seoStructuredDataType;
      if (rest.seoStructuredDataName)
        seoMetadata.structuredData.name = rest.seoStructuredDataName;
      if (rest.seoStructuredDataDescription)
        seoMetadata.structuredData.description =
          rest.seoStructuredDataDescription;
      if (rest.seoStructuredDataBrand)
        seoMetadata.structuredData.brand = rest.seoStructuredDataBrand;
      if (rest.seoStructuredDataSku)
        seoMetadata.structuredData.sku = rest.seoStructuredDataSku;
      if (rest.seoStructuredDataMaterial)
        seoMetadata.structuredData.material = rest.seoStructuredDataMaterial;
      if (rest.seoStructuredDataCondition)
        seoMetadata.structuredData.condition = rest.seoStructuredDataCondition;
      if (rest.seoStructuredDataCategory)
        seoMetadata.structuredData.category = rest.seoStructuredDataCategory;

      if (rest.seoStructuredDataAvailability) {
        seoMetadata.structuredData.offers = {
          availability: rest.seoStructuredDataAvailability,
        };
      }

      if (
        rest.seoStructuredDataRatingValue ||
        rest.seoStructuredDataReviewCount
      ) {
        seoMetadata.structuredData.aggregateRating = {};
        if (rest.seoStructuredDataRatingValue)
          seoMetadata.structuredData.aggregateRating.ratingValue = parseFloat(
            rest.seoStructuredDataRatingValue
          );
        if (rest.seoStructuredDataReviewCount)
          seoMetadata.structuredData.aggregateRating.reviewCount = parseInt(
            rest.seoStructuredDataReviewCount
          );
      }

      if (rest.seoCertifications)
        seoMetadata.structuredData.certifications = rest.seoCertifications
          .split(",")
          .map((cert: string) => cert.trim());
      if (rest.seoWarrantyDuration)
        seoMetadata.structuredData.warrantyDuration = rest.seoWarrantyDuration;
    }

    return {
      ...rest,
      specsTableIntro,
      seoDescription: rest.seoDescription || "",
      seoMetadata:
        Object.keys(seoMetadata).length > 0 ? seoMetadata : undefined,
    };
  };

  return (
    <Create mutationOptions={{ onSuccess }} transform={transform}>
      <SimpleForm validate={validate}>
        {/* Basic Info Tab */}
        <div style={{ marginBottom: "20px" }}>
          <h3
            style={{
              borderBottom: "2px solid #1976d2",
              paddingBottom: "5px",
            }}
          >
            Basic Info
          </h3>

          <TextInput
            source="modelNumber"
            label="Model Name"
            validate={required()}
            fullWidth
          />
          <TextInput
            source="modelTitle"
            label="Model Title"
            validate={required()}
            fullWidth
          />
          <TextInput
            source="seoDescription"
            label="SEO Description"
            multiline
            rows={3}
            fullWidth
            placeholder="Short description for search engines (150–160 characters recommended)"
          />
          <SelectInput
            source="machineType"
            label="Machine Type"
            choices={machineTypeChoices}
            validate={required()}
            fullWidth
          />
          <ReferenceInput
            source="productId"
            reference="products"
            label="Product"
            fullWidth
          >
            <SelectInput optionText="title" validate={required()} />
          </ReferenceInput>
          <SeriesSelectInput
            source="series"
            label="Series"
            validate={required()}
            fullWidth
          />
          <ReferenceArrayInput
            source="industryIds"
            reference="industries"
            label="Industries"
            fullWidth
          >
            <SelectArrayInput optionText="title" validate={required()} />
          </ReferenceArrayInput>
        </div>

        {/* Images Tab */}
        <div style={{ marginBottom: "20px" }}>
          <h3
            style={{
              borderBottom: "2px solid #1976d2",
              paddingBottom: "5px",
            }}
          >
            Images
          </h3>

          <S3FileInput
            source="thumbnail"
            label="Thumbnail"
            folder="models/thumbnails"
            validate={required()}
          />
          <TextInput
            source="thumbnailAltText"
            label="Thumbnail Alt Text"
            validate={required()}
            fullWidth
            placeholder="Describe the thumbnail image for accessibility"
          />
          <S3FileInput
            source="coverImage"
            label="Cover Image"
            folder="models/covers"
            validate={required()}
          />
          <TextInput
            source="coverImageAltText"
            label="Cover Image Alt Text"
            validate={required()}
            fullWidth
            placeholder="Describe the cover image for accessibility"
          />
        </div>

        {/* Content Tab */}
        <div style={{ marginBottom: "20px" }}>
          <h3
            style={{
              borderBottom: "2px solid #1976d2",
              paddingBottom: "5px",
            }}
          >
            Content
          </h3>

          <ArrayInput
            source="keyFeatures"
            label="Key Features"
            validate={[required(), minLength(1)]}
          >
            <SimpleFormIterator>
              <TextInput
                source="name"
                label="Feature Name"
                validate={required()}
              />
              <TextInput
                source="value"
                label="Feature Value"
                validate={required()}
              />
            </SimpleFormIterator>
          </ArrayInput>

          <TextInput
            source="specsIntroHeading"
            label="Specs table intro heading (optional)"
            fullWidth
            helperText="Shown above the full specs table when the model has more than 7 key features. Leave empty for default site copy."
          />
          <TextInput
            source="specsIntroParagraph"
            label="Specs table intro paragraph (optional)"
            multiline
            rows={3}
            fullWidth
            helperText="Leave empty for default site copy."
          />

          <S3FileInput
            source="brochure"
            label="Brochure (Optional)"
            folder="models/brochures"
            accept="application/pdf,image/*"
          />

          <ArrayInput
            source="modelDescription"
            label="Model Description"
            validate={[required(), minLength(1)]}
          >
            <SimpleFormIterator>
              <S3FileInput
                source="image"
                label="Image"
                folder="models/details"
                validate={required()}
              />
              <TextInput
                source="imageAltText"
                label="Image Alt Text"
                validate={required()}
                placeholder="Describe the image for accessibility"
              />
              <TextInput source="title" label="Title" validate={required()} />
              <TextInput
                source="youtubeLink"
                label="YouTube Link (Optional)"
                fullWidth
                placeholder="https://youtube.com/watch?v=example"
              />
              <ArrayInput
                source="description"
                label="Description"
                validate={required()}
              >
                <SimpleFormIterator>
                  <TextInput
                    source=""
                    label="Description Line"
                    validate={required()}
                  />
                </SimpleFormIterator>
              </ArrayInput>
            </SimpleFormIterator>
          </ArrayInput>
        </div>

        <TextInput
          source="shortDescription"
          label="Short Description"
          multiline
          rows={2}
          validate={required()}
          fullWidth
        />
        <BooleanInput
          source="rentalAvailability"
          label="Rental Available"
          defaultValue={false}
        />
        <BooleanInput source="active" label="Active" defaultValue={true} />

        {/* SEO Settings Tab */}
        <div style={{ marginBottom: "20px" }}>
          <h3
            style={{
              borderBottom: "2px solid #1976d2",
              paddingBottom: "5px",
            }}
          >
            SEO Settings
          </h3>

          <h4>Page SEO</h4>
          <TextInput
            source="seoPageTitle"
            label="Page Title"
            fullWidth
            placeholder="Model Name - Autocracy Machinery"
            validate={required()}
          />
          <TextInput
            source="seoPageDescription"
            label="Page Description"
            fullWidth
            multiline
            rows={3}
            placeholder="Brief description of the model for search engines"
            validate={required()}
          />
          <TextInput
            source="seoPageKeywords"
            label="Page Keywords"
            fullWidth
            placeholder="trencher, construction, equipment, autocracy"
            validate={required()}
          />

          <h4>Social Media SEO</h4>
          <TextInput
            source="seoSocialTitle"
            label="Social Title"
            fullWidth
            placeholder="Model Name - Features and Benefits"
            validate={required()}
          />
          <TextInput
            source="seoSocialDescription"
            label="Social Description"
            fullWidth
            multiline
            rows={3}
            placeholder="Description for social media sharing"
            validate={required()}
          />
          <TextInput
            source="seoSocialImage"
            label="Social Image URL"
            fullWidth
            placeholder="URL for social media image"
            validate={required()}
          />

          <h4>Structured Data</h4>
          <TextInput
            source="seoStructuredDataType"
            label="Product Type"
            fullWidth
            placeholder="Product"
            defaultValue="Product"
          />
          <TextInput
            source="seoStructuredDataName"
            label="Product Name"
            fullWidth
            placeholder="Model Name"
          />
          <TextInput
            source="seoStructuredDataDescription"
            label="Product Description"
            fullWidth
            multiline
            rows={3}
            placeholder="Detailed description for structured data"
          />
          <TextInput
            source="seoStructuredDataBrand"
            label="Brand"
            fullWidth
            placeholder="Autocracy Machinery"
            defaultValue="Autocracy Machinery"
          />
          <TextInput
            source="seoStructuredDataSku"
            label="SKU"
            fullWidth
            placeholder="RUD100"
          />
          <TextInput
            source="seoStructuredDataMaterial"
            label="Material"
            fullWidth
            placeholder="High tensile steel"
            defaultValue="High tensile steel"
          />
          <TextInput
            source="seoStructuredDataCondition"
            label="Condition"
            fullWidth
            placeholder="New"
            defaultValue="New"
          />
          <TextInput
            source="seoStructuredDataCategory"
            label="Category"
            fullWidth
            placeholder="Trenching Machines"
            defaultValue="Trenching Machines"
          />
          <TextInput
            source="seoStructuredDataAvailability"
            label="Availability"
            fullWidth
            placeholder="In Stock"
            defaultValue="In Stock"
          />
          <TextInput
            source="seoStructuredDataRatingValue"
            label="Average Rating"
            fullWidth
            placeholder="4.9"
            defaultValue="4.9"
          />
          <TextInput
            source="seoStructuredDataReviewCount"
            label="Total Reviews"
            fullWidth
            placeholder="15"
            defaultValue="15"
          />
          <TextInput
            source="seoCertifications"
            label="Certifications"
            fullWidth
            placeholder="ISO 9001, CE Certified"
            defaultValue="ISO 9001"
          />
          <TextInput
            source="seoWarrantyDuration"
            label="Warranty Duration"
            fullWidth
            placeholder="2 years"
            defaultValue="2 years"
          />
        </div>
      </SimpleForm>
    </Create>
  );
};
