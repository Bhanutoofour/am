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

export const ProductsList = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSuccess = () => {
    notify("Product deleted successfully", { type: "success" });
    redirect("list", "products");
  };

  const handleError = (error: any) => {
    console.error("Error deleting product:", error);
    notify("Error deleting product", { type: "error" });
  };

  const ProductsBulkActionButtons = () => (
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
      <Datagrid bulkActionButtons={<ProductsBulkActionButtons />}>
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="description" />
        <ImageField source="thumbnail" />
        <ImageField source="generalImage" label="General Image" />
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
