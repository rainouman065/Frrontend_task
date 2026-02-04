
import type { FC } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const articleItemRoutes: Record<string, string> = {
  "Create Article": "/articles/create",
  "Generated Articles": "/articles/generated",
  "Keyword Projects": "/articles/keyword-projects",
  "AI Keyword to Article": "/articles/ai-keyword-to-article",
  "Steal Competitor Keyword": "/articles/steal-competitor-keyword",
  "Import Keyword from GSC": "/articles/import-from-gsc",
  "Manual Keyword to Article": "/articles/manual-keyword-to-article",
  "Bulk Keyword to Article": "/articles/bulk-keyword-to-article",
  "Longtail Keyword to Article": "/articles/longtail-keyword-to-article",
  "Article Settings": "/articles/settings",
};

const sectionRoutes: Record<string, string> = {
  "Auto Blog": "/auto-blog",
  "Internal Links": "/internal-links",
  "Free Backlinks": "/free-backlinks",
  Integrations: "/integrations",
  Subscription: "/subscription",
  "Affiliate Program": "/affiliate-program",
  "Help Center": "/help-center",
  Updates: "/updates",
  "Live Chat Support": "/live-chat-support",
  Profile: "/profile",
};

const menuSections = [
  {
    label: "Articles",
    items: [
      "Create Article",
      "Generated Articles",
      "Keyword Projects",
      "AI Keyword to Article",
      "Steal Competitor Keyword",
      "Import Keyword from GSC",
      "Manual Keyword to Article",
      "Bulk Keyword to Article",
      "Longtail Keyword to Article",
      "Article Settings",
    ],
  },
  {
    label: "Auto Blog",
    items: [],
  },
  {
    label: "Internal Links",
    items: [],
  },
  {
    label: "Free Backlinks",
    items: [],
  },
  {
    label: "Integrations",
    items: [],
  },
  {
    label: "Subscription",
    items: [],
  },
  {
    label: "Affiliate Program",
    items: [],
  },
  {
    label: "Help Center",
    items: [],
  },
  {
    label: "Updates",
    items: [],
  },
  {
    label: "Live Chat Support",
    items: [],
  },
  {
    label: "Profile",
    items: [],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // First parent tab (section with children) is open by default
  const [openSection, setOpenSection] = useState<string | null>("Articles");

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 border-r bg-white flex flex-col transform transition-transform duration-200
          md:static md:inset-auto md:z-auto md:w-64 md:h-screen md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="h-14 md:h-16 flex items-center px-4 md:px-6 border-b justify-between">
          <span className="text-xl md:text-2xl font-extrabold tracking-tight">
            Agile Tech
          </span>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 md:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <div className="px-4 md:px-6 py-3 md:py-4 border-b">
          <div className="text-xs font-semibold text-gray-500 mb-1">SITE</div>
          <div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
            <span className="truncate">Agile Group</span>
            <span className="text-xs text-gray-400">▼</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3 text-sm">
          {menuSections.map((section) => {
            const hasItems = section.items.length > 0;
            const isSectionOpen = hasItems ? openSection === section.label : true;
            const sectionRoute = sectionRoutes[section.label];
            const sectionIsActive =
              !!sectionRoute && location.pathname === sectionRoute;

            return (
              <div key={section.label} className="mb-4">
                <button
                  type="button"
                  className={`flex w-full items-center justify-between px-4 py-1 text-xs font-semibold uppercase tracking-wide ${
                    sectionIsActive ? "text-gray-900" : "text-gray-400"
                  }`}
                  onClick={() => {
                    if (hasItems) {
                      // Accordion behavior: only one parent tab open at a time
                      setOpenSection((current) =>
                        current === section.label ? null : section.label
                      );
                    } else if (sectionRoute) {
                      navigate(sectionRoute);
                      onClose();
                    }
                  }}
                >
                  <span>{section.label}</span>
                  {hasItems && (
                    <span
                      className={`text-[10px] transition-transform ${
                        isSectionOpen ? "rotate-0" : "-rotate-90"
                      }`}
                    >
                      ▾
                    </span>
                  )}
                </button>

                {section.items.length > 0 && isSectionOpen && (
                  <ul className="mt-1 space-y-1">
                    {section.items.map((item) => (
                      <li key={item}>
                        <button
                          type="button"
                          onClick={() => {
                            const route = articleItemRoutes[item];
                            if (route) {
                              navigate(route);
                              onClose();
                            }
                          }}
                          className={`w-full text-left px-4 py-1.5 rounded-md hover:bg-gray-100 ${
                            location.pathname === articleItemRoutes[item]
                              ? "bg-gray-100 font-medium text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

