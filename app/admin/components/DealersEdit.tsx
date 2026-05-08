import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  required,
  useNotify,
  useRedirect,
  SaveButton,
  Toolbar,
  DeleteButton,
  useUpdate,
} from "react-admin";
import { countryCodes } from "@/data/countryCodes";

const DealersToolbar = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  return (
    <Toolbar>
      <SaveButton />
      <DeleteButton
        mutationOptions={{
          onSuccess: () => {
            notify("Dealer deleted successfully", { type: "success" });
            redirect("list", "dealers");
          },
          onError: (error: any) => {
            console.error("Error deleting dealer:", error);
            notify("Error deleting dealer", { type: "error" });
          },
        }}
        mutationMode="pessimistic"
      />
    </Toolbar>
  );
};

export const DealersEdit = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const [update] = useUpdate();

  const onSuccess = () => {
    notify("Dealer updated successfully", { type: "success" });
    redirect("list", "dealers");
  };

  const onError = (error: any) => {
    console.error("Update error:", error);
    notify("Error updating dealer", { type: "error" });
  };

  const validate = (values: any) => {
    const errors: any = {};
    if (!values.name || values.name.trim() === "") errors.name = "Required";
    if (!values.country) errors.country = "Required";
    if (!values.state || values.state.trim() === "") errors.state = "Required";
    if (!values.dialCode) errors.dialCode = "Required";
    if (!values.phone || String(values.phone).trim() === "")
      errors.phone = "Required";
    if (!values.email || String(values.email).trim() === "")
      errors.email = "Required";
    if (!values.fullAddress || values.fullAddress.trim() === "")
      errors.fullAddress = "Required";
    if (!values.availability || values.availability.trim() === "")
      errors.availability = "Required";
    return errors;
  };

  const handleSubmit = async (values: any) => {
    // If separate dialCode/phone are present, recompose contactNumber
    const dataToSend = { ...values };
    if (values.dialCode || values.phone) {
      dataToSend.contactNumber = `${values.dialCode || ""} ${
        values.phone || ""
      }`.trim();
    }
    delete (dataToSend as any).dialCode;
    delete (dataToSend as any).phone;

    await update(
      "dealers",
      { id: values.id, data: dataToSend },
      { onSuccess, onError }
    );
  };

  const countryChoices = countryCodes
    .map((c) => ({ id: c.country, name: c.country }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const seenCodes = new Set<string>();
  const dialCodeChoices = countryCodes.reduce((acc, c) => {
    if (!seenCodes.has(c.code)) {
      acc.push({ id: c.code, name: `${c.flag} ${c.code}` });
      seenCodes.add(c.code);
    }
    return acc;
  }, [] as { id: string; name: string }[]);

  return (
    <Edit>
      <SimpleForm
        toolbar={<DealersToolbar />}
        onSubmit={handleSubmit}
        validate={validate}
      >
        <TextInput source="name" validate={required()} fullWidth />
        <SelectInput
          source="country"
          choices={countryChoices}
          validate={required()}
          fullWidth
        />
        <TextInput source="state" validate={required()} fullWidth />
        <div style={{ display: "flex", gap: 12 }}>
          <SelectInput
            source="dialCode"
            label="Dial Code"
            choices={dialCodeChoices}
            sx={{ flex: "0 0 120px", minWidth: 0 }}
          />
          <TextInput source="phone" label="Phone Number" />
        </div>
        <TextInput
          source="email"
          type="email"
          validate={required()}
          fullWidth
        />
        <TextInput
          source="fullAddress"
          label="Full Address"
          multiline
          rows={3}
          validate={required()}
          fullWidth
        />
        <TextInput
          source="availability"
          fullWidth
          placeholder="Mon–Sat, 9:30 AM – 6:30 PM"
          validate={required()}
        />
      </SimpleForm>
    </Edit>
  );
};
