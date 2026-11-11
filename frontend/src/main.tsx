import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import { SiteLayout } from "./components/site/SiteLayout";
import { AdminPage } from "./pages/AdminPage";
import { AtelierPage } from "./pages/AtelierPage";
import { CollectionPage } from "./pages/CollectionPage";
import { ContactPage } from "./pages/ContactPage";
import { ErrorPage } from "./pages/ErrorPage";
import { JournalPage } from "./pages/JournalPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route element={<SiteLayout />}>
          <Route path="/" element={<App />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/atelier" element={<AtelierPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
