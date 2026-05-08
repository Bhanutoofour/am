import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  ReferenceArrayInput,
  SelectArrayInput,
  required,
  useNotify,
  useRedirect,
} from "react-admin";
import { revalidateVideoData } from "@/actions/videoAction";

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

export const VideosCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = async () => {
    // Revalidate data if needed
    await revalidateVideoData();
    notify("Video created successfully");
    redirect("list", "videos");
  };

  return (
    <Create mutationOptions={{ onSuccess }}>
      <SimpleForm validate={validate}>
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
        <BooleanInput source="active" defaultValue={true} />
      </SimpleForm>
    </Create>
  );
};

