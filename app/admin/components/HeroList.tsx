import {
  List,
  Datagrid,
  TextField,
  ImageField,
  EditButton,
  DeleteButton,
  BulkDeleteButton,
  useNotify,
} from "react-admin";

const HeroBulkActionButtons = () => {
  const notify = useNotify();

  return (
    <>
      <BulkDeleteButton
        mutationOptions={{
          onSuccess: () => {
            notify("Hero sections deleted successfully");
          },
          onError: (error) => {
            console.error("Delete error:", error);
            notify("Error deleting hero sections", { type: "error" });
          },
        }}
        mutationMode="pessimistic"
      />
    </>
  );
};

export const HeroList = () => {
  const notify = useNotify();

  return (
    <List>
      <Datagrid rowClick="edit" bulkActionButtons={<HeroBulkActionButtons />}>
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="description" />
        <ImageField source="image" />
        <EditButton />
        <DeleteButton
          mutationOptions={{
            onSuccess: () => {
              notify("Hero section deleted successfully");
            },
            onError: (error) => {
              console.error("Delete error:", error);
              notify("Error deleting hero section", { type: "error" });
            },
          }}
          mutationMode="pessimistic"
        />
      </Datagrid>
    </List>
  );
};
