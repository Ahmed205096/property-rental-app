import type { Metadata } from "next";
import { Suspense } from "react";
import AddPropertyForm from "../components/AddProperty/AddPropertyForm";

export const metadata: Metadata = {
  title: "Add/Edit Property - PropertyPulse",
  description: "Add or edit a rental property listing on PropertyPulse.",
};

export default function AddPropertyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center">
          <div className="text-sm font-semibold text-gray-500">Loading...</div>
        </div>
      }
    >
      <AddPropertyForm />
    </Suspense>
  );
}
