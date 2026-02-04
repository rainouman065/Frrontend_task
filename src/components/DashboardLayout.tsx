
import type { FC, ReactNode } from "react";
import { useState } from "react";
import Sidebar from "./Sidebar";

interface Props {
  children: ReactNode;
}

const DashboardLayout: FC<Props> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col md:flex-row">
      {/* Mobile top bar with menu button */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-white md:hidden">
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={() => setSidebarOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        >
          <span className="sr-only">Open navigation</span>
          <span className="space-y-1.5">
            <span className="block h-0.5 w-5 rounded bg-gray-700" />
            <span className="block h-0.5 w-5 rounded bg-gray-700" />
            <span className="block h-0.5 w-5 rounded bg-gray-700" />
          </span>
        </button>
        <span className="text-sm font-semibold text-gray-800">
          Agile Tech Dashboard
        </span>
        <span className="w-9" />
      </header>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 overflow-auto bg-gray-100 p-4 md:p-6 w-full">
        <div className="w-full max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;


