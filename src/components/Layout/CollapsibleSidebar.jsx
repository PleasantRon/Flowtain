import { useCallback } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSidebarLayout } from "../../context/SidebarLayoutContext.jsx";
import { BRAND_NAME } from "../../constants/brand.js";
import { MAIN_NAV_ITEMS } from "../../navigation/mainNav.js";
import { SidebarDrawerView } from "./SidebarDrawerView.jsx";

export function CollapsibleSidebar() {
  const { isOpen, close } = useSidebarLayout();
  const { logout } = useAuth();

  const onLogout = useCallback(() => {
    close();
    logout();
  }, [close, logout]);

  const backdropActive = isOpen;
  const translate = isOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <SidebarDrawerView
      brandName={BRAND_NAME}
      tagline="Attain flow state"
      navItems={MAIN_NAV_ITEMS}
      onLogout={onLogout}
      navAriaLabel="Main navigation"
      showBackdrop={backdropActive}
      onBackdropClick={close}
      backdropClassName="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden"
      asideClassName={[
        "fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-slate-200 bg-white/95 shadow-xl backdrop-blur-md transition-transform duration-300 ease-out dark:border-slate-800 dark:bg-slate-950/95",
        translate,
      ].join(" ")}
    />
  );
}
