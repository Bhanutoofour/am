import {
  List,
  Datagrid,
  TextField,
  DeleteButton,
  BulkDeleteButton,
  useNotify,
  useRedirect,
} from "react-admin";

export const DealersList = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = () => {
    notify("Dealer deleted successfully", { type: "success" });
    redirect("list", "dealers");
  };

  const onError = (error: any) => {
    console.error("Error deleting dealer:", error);
    notify("Error deleting dealer", { type: "error" });
  };

  const DealersBulkActions = () => (
    <BulkDeleteButton
      mutationOptions={{ onSuccess, onError }}
      mutationMode="pessimistic"
    />
  );

  return (
    <List>
      <Datagrid bulkActionButtons={<DealersBulkActions />}>
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="country" />
        <TextField source="state" />
        <TextField source="contactNumber" label="Contact" />
        <TextField source="email" />
        <TextField source="fullAddress" label="Address" />
        <TextField source="availability" />
        <DeleteButton
          mutationOptions={{ onSuccess, onError }}
          mutationMode="pessimistic"
        />
      </Datagrid>
    </List>
  );
};
