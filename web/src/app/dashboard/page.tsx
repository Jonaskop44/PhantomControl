"use client";

import KPIStat from "@/components/Dashboard/KPIStat";
import RegisteredClientsSpline from "@/components/Dashboard/RegisteredClientsSpline";
import UsedDevices from "@/components/Dashboard/UsedDevices";
import { userStore } from "@/data/userStore";
import { useKpiData, useRegisteredClients } from "@/hooks/analytics";
import { useUsedDevices } from "@/hooks/analytics";
import { Spinner } from "@heroui/react";

const Dashboard = () => {
  const { user } = userStore();
  const { kpi, isLoading: isKpiData } = useKpiData(user.role);
  const { usedDevices, isLoading: isUsedDevicesLoading } = useUsedDevices();
  const { registeredClients, isLoading: isRegisteredClientsLoading } =
    useRegisteredClients();

  return (
    <div className="flex flex-col gap-3">
      {isKpiData && isUsedDevicesLoading && isRegisteredClientsLoading ? (
        <Spinner label="Loading..." />
      ) : (
        <>
          <div>
            <h1 className="text-medium font-semibold">
              Stats of the last 30 Days
            </h1>
            <KPIStat data={kpi} />
          </div>
          <div className="">
            <RegisteredClientsSpline data={registeredClients} />
            <UsedDevices data={usedDevices} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
