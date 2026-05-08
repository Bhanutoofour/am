import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  ReferenceArrayInput,
  SelectArrayInput,
  ArrayInput,
  SimpleFormIterator,
  required,
  minLength,
  useNotify,
  useRedirect,
  SaveButton,
  Toolbar,
  useUpdate,
  DeleteButton,
} from "react-admin";
import { revalidateProductData } from "@/actions/productAction";

const CustomToolbar = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  return (
    <Toolbar>
      <SaveButton />
      <DeleteButton
        mutationOptions={{
          onSuccess: () => {
            notify("Product deleted successfully", { type: "success" });
            redirect("list", "products");
          },
          onError: (error: any) => {
            console.error("Error deleting product:", error);
            notify("Error deleting product", { type: "error" });
          },
        }}
        mutationMode="pessimistic"
      />
    </Toolbar>
  );
};

// Form-level validation to ensure at least one industry and one series is selected
const validate = (values: any) => {
  const errors: any = {};
  if (!values.title || values.title.trim() === "") {
    errors.title = "Title is required";
  }
  if (!values.description || values.description.trim() === "") {
    errors.description = "Description is required";
  }
  if (!values.thumbnail || values.thumbnail.trim() === "") {
    errors.thumbnail = "Thumbnail is required";
  }
  if (!values.thumbnailAltText || values.thumbnailAltText.trim() === "") {
    errors.thumbnailAltText = "Thumbnail Alt Text is required";
  }
  if (!values.industryIds || values.industryIds.length === 0) {
    errors.industryIds = "At least one industry must be selected";
  }
  if (!values.series || values.series.length === 0) {
    errors.series = "At least one series must be added";
  } else {
    const validSeries = values.series.filter((item: any) => {
      const seriesName = typeof item === "object" ? item.seriesName : item;
      return seriesName && seriesName.trim().length > 0;
    });
    if (validSeries.length === 0) {
      errors.series = "At least one series must have a valid name";
    }
  }
  if (!values.generalImage || values.generalImage.trim() === "") {
    errors.generalImage = "General Image is required";
  }
  if (!values.generalImageAltText || values.generalImageAltText.trim() === "") {
    errors.generalImageAltText = "General Image Alt Text is required";
  }

  // SEO validation
  if (!values.seoPageTitle || values.seoPageTitle.trim() === "") {
    errors.seoPageTitle = "SEO Page Title is required";
  }
  if (!values.seoPageDescription || values.seoPageDescription.trim() === "") {
    errors.seoPageDescription = "SEO Page Description is required";
  }
  if (!values.seoPageKeywords || values.seoPageKeywords.trim() === "") {
    errors.seoPageKeywords = "SEO Page Keywords is required";
  }
  if (!values.seoSocialTitle || values.seoSocialTitle.trim() === "") {
    errors.seoSocialTitle = "SEO Social Title is required";
  }
  if (
    !values.seoSocialDescription ||
    values.seoSocialDescription.trim() === ""
  ) {
    errors.seoSocialDescription = "SEO Social Description is required";
  }
  if (!values.seoSocialImage || values.seoSocialImage.trim() === "") {
    errors.seoSocialImage = "SEO Social Image is required";
  }

  return errors;
};

export const ProductsEdit = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const [update] = useUpdate();

  const onSuccess = async () => {
    // Revalidate the home page to show updated data
    await revalidateProductData();
    notify("Product updated successfully");
    redirect("list", "products");
  };

  const transform = (data: any) => {
    // Ensure series is an array of strings
    if (data.series) {
      data.series = data.series
        .map((item: any) =>
          typeof item === "object" ? item.seriesName || "" : item
        )
        .filter(Boolean);
    }

    // Transform SEO fields into seoMetadata object
    data.seoMetadata = {
      pageTitle: data.seoPageTitle,
      pageDescription: data.seoPageDescription,
      pageKeywords: data.seoPageKeywords,
      socialTitle: data.seoSocialTitle,
      socialDescription: data.seoSocialDescription,
      socialImage: data.seoSocialImage,
      structuredData: {
        type: data.seoStructuredDataType || "Product",
        title: data.seoStructuredDataTitle,
        description: data.seoStructuredDataDescription,
        brand: data.seoStructuredDataBrand || "Autocracy Machinery",
        category: data.seoStructuredDataCategory,
        hasOfferCatalog: {
          name: data.seoCatalogName || "Product Models",
          description: data.seoCatalogDescription,
          totalModels: data.seoCatalogTotalModels || 0,
          availableSeries: data.series || [], // Use main series automatically
          modelOverview: data.seoCatalogModelOverview || [],
        },
      },
    };

    // Ensure seoDescription is always a string
    data.seoDescription = data.seoDescription || "";

    // Remove individual SEO fields
    delete data.seoPageTitle;
    delete data.seoPageDescription;
    delete data.seoPageKeywords;
    delete data.seoSocialTitle;
    delete data.seoSocialDescription;
    delete data.seoSocialImage;
    delete data.seoStructuredDataType;
    delete data.seoStructuredDataTitle;
    delete data.seoStructuredDataDescription;
    delete data.seoStructuredDataBrand;
    delete data.seoStructuredDataCategory;
    delete data.seoCatalogName;
    delete data.seoCatalogDescription;
    delete data.seoCatalogTotalModels;
    delete data.seoCatalogAvailableSeries; // Remove this since we use main series
    delete data.seoCatalogModelOverview;

    return data;
  };

  const handleSubmit = async (values: any) => {
    try {
      const transformedData = transform(values);
      await update(
        "products",
        { id: values.id, data: transformedData },
        {
          onSuccess,
          onError: (error) => {
            console.error("Update error:", error);
            notify("Error updating product", { type: "error" });
          },
        }
      );
    } catch (error) {
      console.error("Submit error:", error);
      notify("Error updating product", { type: "error" });
    }
  };

  return (
    <Edit>
      <SimpleForm
        toolbar={<CustomToolbar />}
        onSubmit={handleSubmit}
        validate={validate}
      >
        {/* Basic Information */}
        <div>
          <h3 style={{ textDecoration: "underline" }}>Basic Information</h3>
          <TextInput source="title" validate={required()} fullWidth />
          <TextInput
            source="description"
            multiline
            rows={4}
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
          <TextInput source="thumbnail" validate={required()} fullWidth />
          <TextInput
            source="thumbnailAltText"
            validate={required()}
            fullWidth
            placeholder="Enter alt text for thumbnail image"
          />
          <ArrayInput source="series" validate={[required(), minLength(1)]}>
            <SimpleFormIterator>
              <TextInput
                source="."
                label="Series Name"
                validate={required()}
                sx={{ width: "200px" }}
                format={(value: any) =>
                  typeof value === "object" ? "" : value
                }
              />
            </SimpleFormIterator>
          </ArrayInput>
          <BooleanInput source="active" />
          <ReferenceArrayInput
            source="industryIds"
            reference="industries"
            validate={required()}
          >
            <SelectArrayInput optionText="title" fullWidth />
          </ReferenceArrayInput>
          <TextInput
            source="generalImage"
            label="General Image"
            validate={required()}
            fullWidth
          />
          <TextInput
            source="generalImageAltText"
            validate={required()}
            fullWidth
            placeholder="Enter alt text for general image"
          />
        </div>

        {/* SEO Settings */}
        <div>
          <h3 style={{ textDecoration: "underline" }}>SEO Settings</h3>

          {/* Basic SEO */}
          <div style={{ marginBottom: "20px" }}>
            <h4>Page SEO</h4>
            <TextInput
              source="seoPageTitle"
              validate={required()}
              fullWidth
              placeholder="Product Page Title"
            />
            <TextInput
              source="seoPageDescription"
              multiline
              rows={3}
              validate={required()}
              fullWidth
              placeholder="Product page description for search engines"
            />
            <TextInput
              source="seoPageKeywords"
              validate={required()}
              fullWidth
              placeholder="Keywords separated by commas"
            />
          </div>

          {/* Social Media SEO */}
          <div style={{ marginBottom: "20px" }}>
            <h4>Social Media</h4>
            <TextInput
              source="seoSocialTitle"
              validate={required()}
              fullWidth
              placeholder="Title for social media sharing"
            />
            <TextInput
              source="seoSocialDescription"
              multiline
              rows={3}
              validate={required()}
              fullWidth
              placeholder="Description for social media sharing"
            />
            <TextInput
              source="seoSocialImage"
              validate={required()}
              fullWidth
              placeholder="Image URL for social media sharing"
            />
          </div>

          {/* Structured Data */}
          <div style={{ marginBottom: "20px" }}>
            <h4>Structured Data</h4>
            <TextInput
              source="seoStructuredDataType"
              fullWidth
              placeholder="Type (e.g., Product, Service)"
              defaultValue="Product"
            />
            <TextInput
              source="seoStructuredDataTitle"
              fullWidth
              placeholder="Product title for structured data"
            />
            <TextInput
              source="seoStructuredDataDescription"
              multiline
              rows={3}
              fullWidth
              placeholder="Product description for structured data"
            />
            <TextInput
              source="seoStructuredDataCategory"
              fullWidth
              placeholder="Product category (e.g., Construction Equipment)"
            />
          </div>

          {/* Catalog Information */}
          <div style={{ marginBottom: "20px" }}>
            <h4>Catalog Information</h4>
            <TextInput
              source="seoCatalogName"
              fullWidth
              placeholder="Catalog name (e.g., Trenching Machine Models)"
            />
            <TextInput
              source="seoCatalogDescription"
              multiline
              rows={2}
              fullWidth
              placeholder="Catalog description"
            />
            <TextInput
              source="seoCatalogTotalModels"
              type="number"
              fullWidth
              placeholder="Total number of models"
            />
            <ArrayInput source="seoCatalogModelOverview">
              <SimpleFormIterator>
                <TextInput
                  source="name"
                  label="Model Name"
                  sx={{ width: "150px" }}
                />
                <TextInput
                  source="description"
                  label="Description"
                  multiline
                  rows={2}
                  sx={{ width: "200px" }}
                />
                <TextInput
                  source="series"
                  label="Series"
                  sx={{ width: "100px" }}
                />
              </SimpleFormIterator>
            </ArrayInput>
          </div>
        </div>
      </SimpleForm>
    </Edit>
  );
};
