/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ApiClient from "@/api";
import KPIStat from "@/components/Dashboard/KPIStat";
import { userStore } from "@/data/userStore";
import type { KPIStatProps } from "@/types/kpiStat";
import { Role } from "@/types/user";
import { Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const apiClient = new ApiClient();

const Dashboard = () => {
  const [kpi, setKpi] = useState<KPIStatProps[]>([]);
  const [isloading, setisLoading] = useState(true);
  const { user } = userStore();

  useEffect(() => {
    const endpoint =
      user.role === Role.ADMIN ? "/analytics/admin-kpi" : "/analytics/user-kpi";

    apiClient.analytics.helper
      .getKpi(endpoint)
      .then((response) => {
        if (response.status) {
          setKpi([
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
      })
      .finally(() => {
        setisLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {isloading ? (
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
