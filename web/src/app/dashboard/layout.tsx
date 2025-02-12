import Navbar from "@/components/layout/navbar/Navbar";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import SidebarProvider from "@/context/SidebarProvider";
import { FC } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const Dashboardlayout: FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex-1 flex flex-col w-full bg-gray-2">
            <Navbar />

            <main className="flex-1 isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Dashboardlayout;
