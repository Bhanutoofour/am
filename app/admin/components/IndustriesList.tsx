import {
  List,
  Datagrid,
  TextField,
  ImageField,
  BooleanField,
  DeleteButton,
  BulkDeleteButton,
  useNotify,
  useRedirect,
} from "react-admin";
import { BannerImagesField } from "./BannerImagesField";

export const IndustriesList = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSuccess = () => {
    notify("Industry deleted successfully", { type: "success" });
    redirect("list", "industries");
  };

  const handleError = (error: any) => {
    console.error("Error deleting industry:", error);
    notify("Error deleting industry", { type: "error" });
  };

  const IndustriesBulkActionButtons = () => (
    <BulkDeleteButton
      mutationOptions={{
        onSuccess: handleSuccess,
        onError: handleError,
      }}
      mutationMode="pessimistic"
    />
  );

  return (
    <List>
      <Datagrid bulkActionButtons={<IndustriesBulkActionButtons />}>
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="description" />
        <ImageField source="thumbnail" />
        <BannerImagesField source="bannerImages" label="Banner Images" />
        <BooleanField source="active" />
        <DeleteButton
          mutationOptions={{
            onSuccess: handleSuccess,
            onError: handleError,
          }}
          mutationMode="pessimistic"
        />
      </Datagrid>
    </List>
  );
};
