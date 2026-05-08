import {
  Create,
  required,
  SimpleForm,
  TextInput,
  useNotify,
  useRedirect,
} from "react-admin";
import { revalidateHeroData } from "@/actions/heroAction";

export const HeroCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = async () => {
    // Revalidate the home page to show updated data
    await revalidateHeroData();
    notify("Hero section created successfully");
    redirect("list", "hero-section");
  };

  const validate = (values: any) => {
    const errors: any = {};
    if (!values.title || values.title.trim() === "") {
      errors.title = "Title is required";
    }
    if (!values.description || values.description.trim() === "") {
      errors.description = "Description is required";
    }
    if (!values.image || values.image.trim() === "") {
      errors.image = "Image is required";
    }
    if (!values.altText || values.altText.trim() === "") {
      errors.altText = "Alt text is required";
    }
    return errors;
  };

  return (
    <Create mutationOptions={{ onSuccess }}>
      <SimpleForm validate={validate}>
        <TextInput source="title" validate={required()} />
        <TextInput source="description" validate={required()} />
        <TextInput source="image" validate={required()} />
        <TextInput source="altText" validate={required()} />
      </SimpleForm>
    </Create>
  );
};
