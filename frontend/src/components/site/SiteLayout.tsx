import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { useLenis } from "@/hooks/useLenis";
import { useCmsRuntime } from "@/cms/useCmsRuntime";

export function SiteLayout() {
  const { pathname } = useLocation();
  useLenis();
  useCmsRuntime(pathname);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-background text-foreground">
      <Nav />
      <Outlet />
      <Footer />
    </div>
  );
}
