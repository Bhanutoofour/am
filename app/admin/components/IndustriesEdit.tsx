import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  useNotify,
  useRedirect,
  ArrayInput,
  SimpleFormIterator,
  required,
  minLength,
  SaveButton,
  Toolbar,
  useUpdate,
  DeleteButton,
} from "react-admin";
import { revalidateIndustryData } from "@/actions/industryAction";

const CustomToolbar = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  return (
    <Toolbar>
      <SaveButton />
      <DeleteButton
        mutationOptions={{
          onSuccess: () => {
            notify("Industry deleted successfully", { type: "success" });
            redirect("list", "industries");
          },
          onError: (error: any) => {
            console.error("Error deleting industry:", error);
            notify("Error deleting industry", { type: "error" });
          },
        }}
        mutationMode="pessimistic"
      />
    </Toolbar>
  );
};

export const IndustriesEdit = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const [update] = useUpdate();

  const onSuccess = async () => {
    // Revalidate the home page to show updated data
    await revalidateIndustryData();
    notify("Industry updated successfully");
    redirect("list", "industries");
  };

  const handleSubmit = async (values: any) => {
    try {
      // Transform the data first
      const transformedData = transform(values);

      await update(
        "industries",
        { id: values.id, data: transformedData },
        {
          onSuccess,
          onError: (error) => {
            console.error("Update error:", error);
            notify("Error updating industry", { type: "error" });
          },
        }
      );
    } catch (error) {
      console.error("Submit error:", error);
      notify("Error updating industry", { type: "error" });
    }
  };

  const validate = (values: any) => {
    const errors: any = {};

    // Basic Information Validation
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

    // Banner Images Validation
    if (!values.bannerImages || values.bannerImages.length === 0) {
      errors.bannerImages = "At least one banner image is required";
    } else {
      const validBannerImages = values.bannerImages.filter((item: any) => {
        const imageUrl = typeof item === "object" ? item.imageUrl : item;
        const altText = typeof item === "object" ? item.altText : "";
        return (
          imageUrl &&
          imageUrl.trim().length > 0 &&
          altText &&
          altText.trim().length > 0
        );
      });
      if (validBannerImages.length === 0) {
        errors.bannerImages =
          "At least one banner image must have a valid URL and Alt Text";
      }
    }

    // SEO Validation
    if (!values.seoPageTitle || values.seoPageTitle.trim() === "") {
      errors.seoPageTitle = "Page title is required";
    }
    if (!values.seoPageDescription || values.seoPageDescription.trim() === "") {
      errors.seoPageDescription = "Page description is required";
    }
    if (!values.seoSocialTitle || values.seoSocialTitle.trim() === "") {
      errors.seoSocialTitle = "Social title is required";
    }
    if (
      !values.seoSocialDescription ||
      values.seoSocialDescription.trim() === ""
    ) {
      errors.seoSocialDescription = "Social description is required";
    }

    return errors;
  };

  const transform = (data: any) => {
    // Transform banner images to array of objects
    if (data.bannerImages) {
      data.bannerImages = data.bannerImages
        .map((item: any) => {
          if (typeof item === "object" && item.imageUrl) {
            return {
              imageUrl: item.imageUrl,
              altText: item.altText || "",
            };
          }
          return null;
        })
        .filter(Boolean);
    }

    // Create SEO metadata object
    const seoMetadata = {
      pageTitle: data.seoPageTitle || `${data.title} Solutions - Autocracy`,
      pageDescription: data.seoPageDescription || data.description,
      pageKeywords:
        data.seoPageKeywords ||
        `${data.title}, ${data.title} equipment, construction equipment, industrial machinery`,
      socialTitle: data.seoSocialTitle || `${data.title} Solutions - Autocracy`,
      socialDescription: data.seoSocialDescription || data.description,
      socialImage: data.seoSocialImage || data.thumbnail,
      structuredData: {
        type: data.seoStructuredDataType || "organization",
        title: data.seoStructuredDataTitle || `${data.title} Solutions`,
        description: data.seoStructuredDataDescription || data.description,
      },
    };

    // Ensure seoDescription is always a string
    data.seoDescription = data.seoDescription || "";

    // Remove individual SEO fields and add seoMetadata
    delete data.seoPageTitle;
    delete data.seoPageDescription;
    delete data.seoPageKeywords;
    delete data.seoSocialTitle;
    delete data.seoSocialDescription;
    delete data.seoSocialImage;
    delete data.seoStructuredDataType;
    delete data.seoStructuredDataTitle;
    delete data.seoStructuredDataDescription;

    data.seoMetadata = seoMetadata;
    return data;
  };

  return (
    <Edit
      mutationOptions={{
        onSuccess,
        onError: (error) => {
          console.error("Update error:", error);
          notify("Error updating industry", { type: "error" });
        },
      }}
    >
      <SimpleForm
        toolbar={<CustomToolbar />}
        onSubmit={handleSubmit}
        validate={validate}
      >
        {/* Basic Information Section */}
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
            label="Thumbnail Alt Text"
            validate={required()}
            fullWidth
          />
          <TextInput
            source="brochure"
            label="Brochure URL (optional)"
            defaultValue=""
            fullWidth
          />
          <BooleanInput source="active" defaultValue={true} />
        </div>

        {/* Banner Images Section */}
        <div>
          <h3 style={{ textDecoration: "underline" }}>Banner Images</h3>
          <ArrayInput
            source="bannerImages"
            validate={[required(), minLength(1)]}
          >
            <SimpleFormIterator>
              <TextInput
                source="imageUrl"
                label="Banner Image URL"
                validate={required()}
                fullWidth
              />
              <TextInput
                source="altText"
                label="Alt Text"
                validate={required()}
                fullWidth
              />
            </SimpleFormIterator>
          </ArrayInput>
        </div>

        {/* SEO Settings Section */}
        <div>
          <h3 style={{ textDecoration: "underline" }}>SEO Settings</h3>

          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ marginBottom: "10px", color: "#666" }}>Page SEO</h4>
            <TextInput
              source="seoPageTitle"
              label="Page Title"
              validate={required()}
              placeholder="Industry Solutions - Autocracy"
              fullWidth
            />
            <TextInput
              source="seoPageDescription"
              label="Page Description"
              validate={required()}
              multiline
              rows={3}
              placeholder="Enter SEO description for search engines"
              fullWidth
            />
            <TextInput
              source="seoPageKeywords"
              label="Keywords"
              placeholder="construction equipment, industrial machinery, autocracy"
              fullWidth
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ marginBottom: "10px", color: "#666" }}>
              Social Media
            </h4>
            <TextInput
              source="seoSocialTitle"
              label="Social Media Title"
              validate={required()}
              placeholder="Industry Solutions - Autocracy"
              fullWidth
            />
            <TextInput
              source="seoSocialDescription"
              label="Social Media Description"
              validate={required()}
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

          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ marginBottom: "10px", color: "#666" }}>
              Structured Data
            </h4>
            <TextInput
              source="seoStructuredDataType"
              label="Schema Type"
              defaultValue="organization"
              placeholder="organization, service, or product_catalog"
              fullWidth
            />
            <TextInput
              source="seoStructuredDataTitle"
              label="Schema Title"
              placeholder="Industry Solutions"
              fullWidth
            />
            <TextInput
              source="seoStructuredDataDescription"
              label="Schema Description"
              multiline
              rows={3}
              placeholder="Description for search engine structured data"
              fullWidth
            />
          </div>
        </div>
      </SimpleForm>
    </Edit>
  );
};
