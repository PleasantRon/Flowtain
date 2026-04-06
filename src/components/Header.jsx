import { useCallback, useRef } from "react";
import { BRAND_NAME } from "../constants/brand.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useSidebarLayout } from "../context/SidebarLayoutContext.jsx";
import { useDisclosure } from "../hooks/useDisclosure.js";
import { useOnClickOutside } from "../hooks/useOnClickOutside.js";
import { HeaderBar } from "./header/HeaderBar.jsx";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { isOpen: sidebarOpen, toggle: toggleSidebar } = useSidebarLayout();
  const { isOpen: profileOpen, close: closeProfile, toggle: toggleProfile } = useDisclosure(false);
  const profileRef = useRef(null);

  useOnClickOutside(profileRef, profileOpen, closeProfile);

  const onLogout = useCallback(() => {
    closeProfile();
    logout();
  }, [closeProfile, logout]);

  const themeToggleLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <HeaderBar
      brandName={BRAND_NAME}
      tagline="Lock in. Level up."
      sidebarOpen={sidebarOpen}
      onMenuClick={toggleSidebar}
      menuLabel="Open navigation menu"
      theme={theme}
      onThemeToggle={toggleTheme}
      themeToggleLabel={themeToggleLabel}
      user={user}
      profileOpen={profileOpen}
      profileRef={profileRef}
      onProfileButtonClick={toggleProfile}
      onLogout={onLogout}
    />
  );
}
