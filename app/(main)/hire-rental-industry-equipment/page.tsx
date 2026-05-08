// app/hire-equipment/page.tsx
import HireEquipmentClient from "./HireEquipmentClient";
import { Metadata } from "next";
import { getRentalModel } from "@/actions/modelAction";
import { Suspense } from "react";
import RentalPageLoading from "@/component/molecules/loading/RentalPageLoading";

export const metadata: Metadata = {
  title: "Hire Trencher & Utility Equipment on Rent – Autocracy Machinery",
  description:
    "Autocracy Machinery offers durable trenchers and utility machines on rent. Affordable plans with expert support for hassle-free project execution.",
  alternates: { canonical: "https://autocracymachinery.com/hire-rental-industry-equipment" },
  openGraph: {
    title: "Hire & Rental Equipment – Autocracy Machinery",
    description:
      "Autocracy Machinery offers durable trenchers and utility machines on rent. Affordable plans with expert support for hassle-free project execution.",
    url: "https://autocracymachinery.com/hire-rental-industry-equipment",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hire & Rental Equipment – Autocracy Machinery",
    description:
      "Autocracy Machinery offers durable trenchers and utility machines on rent. Affordable plans with expert support for hassle-free project execution.",
  },
};

export default async function HireEquipmentPage() {
  const allRentalEquipment = await getRentalModel();

  return (
    <Suspense fallback={<RentalPageLoading />}>
      <HireEquipmentClient allRentalEquipment={allRentalEquipment} />
    </Suspense>
  );
}
