import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  ReferenceArrayInput,
  SelectArrayInput,
  required,
  useNotify,
  useRedirect,
  SaveButton,
  Toolbar,
  useUpdate,
  DeleteButton,
} from "react-admin";
import { revalidateVideoData } from "@/actions/videoAction";

const CustomToolbar = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  return (
    <Toolbar>
      <SaveButton />
      <DeleteButton
        mutationOptions={{
          onSuccess: () => {
            notify("Video deleted successfully", { type: "success" });
            redirect("list", "videos");
          },
          onError: (error: any) => {
            console.error("Error deleting video:", error);
            notify("Error deleting video", { type: "error" });
          },
        }}
        mutationMode="pessimistic"
      />
    </Toolbar>
  );
};

const validate = (values: any) => {
  const errors: any = {};

  if (!values.title || values.title.trim() === "") {
    errors.title = "Title is required";
  }

  if (!values.embedLink || values.embedLink.trim() === "") {
    errors.embedLink = "Embed link is required";
  }

  return errors;
};

export const VideosEdit = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const [update] = useUpdate();

  const onSuccess = async () => {
    // Revalidate data if needed
    await revalidateVideoData();
    notify("Video updated successfully");
    redirect("list", "videos");
  };

  const handleSubmit = async (values: any) => {
    try {
      await update(
        "videos",
        { id: values.id, data: values },
        {
          onSuccess,
          onError: (error) => {
            console.error("Update error:", error);
            notify("Error updating video", { type: "error" });
          },
        }
      );
    } catch (error) {
      console.error("Submit error:", error);
      notify("Error updating video", { type: "error" });
    }
  };

  return (
    <Edit
      mutationOptions={{
        onSuccess,
        onError: (error) => {
          console.error("Update error:", error);
          notify("Error updating video", { type: "error" });
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
            source="embedLink"
            label="Embed Link"
            validate={required()}
            fullWidth
            helperText="YouTube embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID)"
          />
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
        <BooleanInput source="active" />
      </SimpleForm>
    </Edit>
  );
};

