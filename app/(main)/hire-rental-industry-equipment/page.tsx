// app/hire-equipment/page.tsx
import HireEquipmentClient from "./HireEquipmentClient";
import { Metadata } from "next";
import { getRentalModel } from "@/actions/modelAction";
import { Suspense } from "react";
import RentalPageLoading from "@/component/molecules/loading/RentalPageLoading";

export const metadata: Metadata = {
  title:
    "Hire Trencher Machines & Utility Equipment on Rent | Autocracy Machinery",
  description:
    "Hire trenchers, pole erection machines, floating trash collectors, and utility equipment on rent for telecom, solar, water management, construction, and infrastructure projects.",
  alternates: {
    canonical: "https://autocracymachinery.com/hire-rental-industry-equipment",
  },
  openGraph: {
    title: "Hire Trencher Machines & Utility Equipment",
    description:
      "Rent Autocracy Machinery equipment for short-term and long-term trenching, water management, solar EPC, and utility projects.",
    url: "https://autocracymachinery.com/hire-rental-industry-equipment",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hire Trencher Machines & Utility Equipment",
    description:
      "Rent project-ready trenchers and utility equipment from Autocracy Machinery.",
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
