import { useEffect } from "react";
import {
  List,
  Datagrid,
  TextField,
  ImageField,
  BooleanField,
  DateField,
  DeleteButton,
  BulkDeleteButton,
  EditButton,
  useNotify,
  useRedirect,
} from "react-admin";

export const BlogList = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  // Force light mode for blog pages
  useEffect(() => {
    // Remove dark mode class if present
    const root = document.documentElement;
    root.classList.remove("dark");
    
    // Force light mode on MUI theme
    const body = document.body;
    body.classList.remove("dark");
    
    // Also check for MUI theme attribute
    const muiTheme = document.querySelector('[data-mui-color-scheme]');
    if (muiTheme) {
      muiTheme.setAttribute('data-mui-color-scheme', 'light');
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleSuccess = () => {
    notify("Blog deleted successfully", { type: "success" });
    redirect("list", "blogs");
  };

  const handleError = (error: any) => {
    console.error("Error deleting blog:", error);
    notify("Error deleting blog", { type: "error" });
  };

  const BlogBulkActionButtons = () => (
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
      <Datagrid bulkActionButtons={<BlogBulkActionButtons />}>
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="slug" />
        <ImageField source="banner" />
        <BooleanField source="published" />
        <DateField source="createdAt" />
        <DateField source="updatedAt" />
        <EditButton />
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

