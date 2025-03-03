"use client";

import KPIStat from "@/components/Dashboard/KPIStat";
import UsedDevices from "@/components/Dashboard/UsedDevices";
import { userStore } from "@/data/userStore";
import { useKpiData } from "@/hooks/useKpiData";
import { useUsedDevices } from "@/hooks/useUsedDevices";
import { Spinner } from "@heroui/react";

const Dashboard = () => {
  const { user } = userStore();
  const { kpi, isLoading: isKpiData } = useKpiData(user.role);
  const { usedDevices, isLoading: isUsedDevicesLoading } = useUsedDevices();

  return (
    <div className="flex flex-col gap-3">
      {isKpiData && isUsedDevicesLoading ? (
        <Spinner label="Loading..." />
      ) : (
        <>
          <div>
            <h1 className="text-medium font-semibold">
              Stats of the last 30 Days
            </h1>
            <KPIStat data={kpi} />
          </div>
          <div>
            <UsedDevices data={usedDevices} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
