"use client";

import ApiClient from "@/api";
import KPIStat from "@/components/Dashboard/KPIStat";
import type { KPIStatProps } from "@/types/kpiStat";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const apiClient = new ApiClient();

const Dashboard = () => {
  const [userKpi, setUserKpi] = useState<KPIStatProps[]>([]);

  useEffect(() => {
    apiClient.analytics.helper.getUserKpi().then((response) => {
      if (response.status) {
        setUserKpi([
          {
            title: "Clients",
            value: response.data.clientsCount.value,
            change: response.data.clientsCount.change,
            changeType: response.data.clientsCount.changeType,
            trendChipPosition: "top",
            iconName: "solar:users-group-rounded-linear",
          },
          {
            title: "Consoles",
            value: response.data.consolesCount.value,
            change: response.data.consolesCount.change,
            changeType: response.data.consolesCount.changeType,
            trendChipPosition: "top",
            iconName: "teenyicons:terminal-outline",
          },
          {
            title: "File Explorers",
            value: response.data.fileExplorersCount.value,
            change: response.data.fileExplorersCount.change,
            changeType: response.data.fileExplorersCount.changeType,
            trendChipPosition: "top",
            iconName: "solar:folder-outline",
          },
        ]);
      } else {
        toast.error("Failed to fetch user KPI");
      }
    });
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-medium font-semibold">Stats of the last 30 Days</h1>
      <KPIStat data={userKpi} />
    </div>
  );
};

export default Dashboard;
