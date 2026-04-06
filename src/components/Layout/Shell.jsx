import { Outlet } from "react-router-dom";
import { SidebarLayoutProvider, useSidebarLayout } from "../../context/SidebarLayoutContext.jsx";
import { FeedbackBanner } from "../FeedbackBanner.jsx";
import { Header } from "../Header.jsx";
import { CollapsibleSidebar } from "./CollapsibleSidebar.jsx";

function ShellLayout() {
  const { isOpen } = useSidebarLayout();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="relative flex flex-1">
        <CollapsibleSidebar />
        <div
          className={`relative flex min-w-0 flex-1 flex-col transition-[margin] duration-300 ease-out ${
            isOpen ? "lg:ml-64" : "lg:ml-0"
          }`}
        >
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
          <FeedbackBanner />
        </div>
      </div>
    </div>
  );
}

export function Shell() {
  return (
    <SidebarLayoutProvider>
      <ShellLayout />
    </SidebarLayoutProvider>
  );
}
