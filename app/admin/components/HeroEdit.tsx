import {
  Edit,
  SimpleForm,
  TextInput,
  useNotify,
  useRedirect,
  DeleteButton,
  Toolbar,
  SaveButton,
  useUpdate,
  required,
} from "react-admin";
import { revalidateHeroData } from "@/actions/heroAction";

const CustomToolbar = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  return (
    <Toolbar>
      <SaveButton />
      <DeleteButton
        mutationOptions={{
          onSuccess: () => {
            notify("Hero section deleted successfully");
            redirect("list", "hero-section");
          },
          onError: (error) => {
            console.error("Delete error:", error);
            notify("Error deleting hero section", { type: "error" });
          },
        }}
        mutationMode="pessimistic"
      />
    </Toolbar>
  );
};

export const HeroEdit = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const [update] = useUpdate();

  const onSuccess = async () => {
    // Revalidate the home page to show updated data
    await revalidateHeroData();
    notify("Hero section updated successfully");
    redirect("list", "hero-section");
  };

  const handleSubmit = async (values: any) => {
    try {
      await update(
        "hero-section",
        { id: values.id, data: values },
        {
          onSuccess,
          onError: (error) => {
            console.error("Update error:", error);
            notify("Error updating hero section", { type: "error" });
          },
        }
      );
    } catch (error) {
      console.error("Submit error:", error);
      notify("Error updating hero section", { type: "error" });
    }
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
    <Edit
      mutationOptions={{
        onSuccess,
        onError: (error) => {
          console.error("Update error:", error);
          notify("Error updating hero section", { type: "error" });
        },
      }}
    >
      <SimpleForm
        toolbar={<CustomToolbar />}
        onSubmit={handleSubmit}
        validate={validate}
      >
        <TextInput source="title" validate={required()} />
        <TextInput source="description" validate={required()} />
        <TextInput source="image" validate={required()} />
        <TextInput source="altText" validate={required()} />
      </SimpleForm>
    </Edit>
  );
};
