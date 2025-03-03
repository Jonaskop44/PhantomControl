"use client";

import KPIStat from "@/components/Dashboard/KPIStat";
import { userStore } from "@/data/userStore";
import { useKpiData } from "@/hooks/useKpiData";
import { Spinner } from "@heroui/react";

const Dashboard = () => {
  const { user } = userStore();
  const { kpi, isLoading } = useKpiData(user.role);

  return (
    <div className="flex flex-col gap-3">
      {isLoading ? (
        <Spinner label="Loading..." />
      ) : (
        <>
          <h1 className="text-medium font-semibold">
            Stats of the last 30 Days
          </h1>
          <KPIStat data={kpi} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
