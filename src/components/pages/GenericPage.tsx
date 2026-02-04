// src/components/pages/GenericPage.tsx
import type { FC } from "react";
import DashboardLayout from "../DashboardLayout";

interface GenericPageProps {
  title: string;
  subtitle?: string;
}

const GenericPage: FC<GenericPageProps> = ({ title, subtitle }) => {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm border px-6 py-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">
            {subtitle ??
              "This is a placeholder view for this section. You can plug in the actual layout here later."}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GenericPage;

