
import { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout";
import Header from "../Header";
import DataTable from "../DataTable";

const DEFAULT_TAB = "Generated Articles";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>(DEFAULT_TAB);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <Header
          search={search}
          onSearchChange={setSearch}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <DataTable search={search} activeTab={activeTab} loading={loading} />
      </div>
    </DashboardLayout>
  );
}
