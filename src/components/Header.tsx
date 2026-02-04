
import type { FC, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const tabs = [
  "Generated Articles",
  "Published Articles",
  "Scheduled Articles",
  "Archived Articles",
];

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header: FC<HeaderProps> = ({
  search,
  onSearchChange,
  activeTab,
  onTabChange,
}) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <header className="w-full border-b bg-white rounded-t-xl">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 md:px-6 py-3 md:py-4">
        <h1 className="text-lg md:text-xl font-semibold">Articles</h1>

        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
          <Input
            type="text"
            placeholder="Search for Title & Keywords..."
            value={search}
            onChange={handleSearchChange}
            className="w-full md:w-72"
          />
          <Button variant="outline" className="whitespace-nowrap">
            Filter
          </Button>
        </div>
      </div>

      <div className="px-4 md:px-6 pb-3 overflow-x-auto">
        <div className="inline-flex rounded-full border bg-white p-1 text-sm min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`px-4 py-1.5 rounded-full whitespace-nowrap ${
                tab === activeTab
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;

