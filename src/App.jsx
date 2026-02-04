import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/pages/Dashboard";
import GenericPage from "./components/pages/GenericPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/articles/generated" replace />}
        />

        
        <Route path="/articles/generated" element={<Dashboard />} />
        <Route
          path="/articles/create"
          element={<GenericPage title="Create Article" />}
        />
        <Route
          path="/articles/keyword-projects"
          element={<GenericPage title="Keyword Projects" />}
        />
        <Route
          path="/articles/ai-keyword-to-article"
          element={<GenericPage title="AI Keyword to Article" />}
        />
        <Route
          path="/articles/steal-competitor-keyword"
          element={<GenericPage title="Steal Competitor Keyword" />}
        />
        <Route
          path="/articles/import-from-gsc"
          element={<GenericPage title="Import Keyword from GSC" />}
        />
        <Route
          path="/articles/manual-keyword-to-article"
          element={<GenericPage title="Manual Keyword to Article" />}
        />
        <Route
          path="/articles/bulk-keyword-to-article"
          element={<GenericPage title="Bulk Keyword to Article" />}
        />
        <Route
          path="/articles/longtail-keyword-to-article"
          element={<GenericPage title="Longtail Keyword to Article" />}
        />
        <Route
          path="/articles/settings"
          element={<GenericPage title="Article Settings" />}
        />

        
        <Route
          path="/auto-blog"
          element={<GenericPage title="Auto Blog" />}
        />
        <Route
          path="/internal-links"
          element={<GenericPage title="Internal Links" />}
        />
        <Route
          path="/free-backlinks"
          element={<GenericPage title="Free Backlinks" />}
        />
        <Route
          path="/integrations"
          element={<GenericPage title="Integrations" />}
        />
        <Route
          path="/subscription"
          element={<GenericPage title="Subscription" />}
        />
        <Route
          path="/affiliate-program"
          element={<GenericPage title="Affiliate Program" />}
        />
        <Route
          path="/help-center"
          element={<GenericPage title="Help Center" />}
        />
        <Route
          path="/updates"
          element={<GenericPage title="Updates" />}
        />
        <Route
          path="/live-chat-support"
          element={<GenericPage title="Live Chat Support" />}
        />
        <Route
          path="/profile"
          element={<GenericPage title="Profile" />}
        />

      
        <Route
          path="*"
          element={<GenericPage title="Not Found" subtitle="This page does not exist yet." />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;