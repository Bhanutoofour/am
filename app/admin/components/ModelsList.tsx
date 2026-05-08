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

export const ModelsList = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSuccess = () => {
    notify("Model deleted successfully", { type: "success" });
    redirect("list", "models");
  };

  const handleError = (error: any) => {
    console.error("Error deleting model:", error);
    notify("Error deleting model", { type: "error" });
  };

  const ModelsBulkActionButtons = () => (
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
      <Datagrid bulkActionButtons={<ModelsBulkActionButtons />} rowClick="edit">
        <TextField source="id" />
        <TextField source="modelNumber" label="Model Name" />
        <TextField source="modelTitle" label="Model Title" />
        <TextField source="machineType" label="Machine Type" />
        <TextField source="series" label="Series" />
        <ImageField source="thumbnail" label="Thumbnail" />
        <ImageField source="coverImage" label="Cover Image" />
        <BooleanField source="rentalAvailability" label="Rental" />
        <BooleanField source="active" label="Active" />
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
