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
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
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
