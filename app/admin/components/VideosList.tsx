import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  DeleteButton,
  BulkDeleteButton,
  useNotify,
  useRedirect,
  DateField,
} from "react-admin";

export const VideosList = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSuccess = () => {
    notify("Video deleted successfully", { type: "success" });
    redirect("list", "videos");
  };

  const handleError = (error: any) => {
    console.error("Error deleting video:", error);
    notify("Error deleting video", { type: "error" });
  };

  const VideosBulkActionButtons = () => (
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
      <Datagrid bulkActionButtons={<VideosBulkActionButtons />} rowClick="edit">
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="embedLink" label="Embed Link" />
        <BooleanField source="active" />
        <DateField source="createdAt" showTime />
        <DateField source="updatedAt" showTime />
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

