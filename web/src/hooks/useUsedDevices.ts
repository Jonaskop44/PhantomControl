import { useEffect, useState } from "react";
import ApiClient from "@/api";
import { toast } from "sonner";
import { UsedDevicesProps } from "@/types/usedDevices";

const apiClient = new ApiClient();

export const useUsedDevices = () => {
  const [usedDevices, setUsedDevices] = useState<UsedDevicesProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.analytics.helper
      .getUsedDevices()
      .then((response) => {
        if (response.status) {
          const data = response.data;

          setUsedDevices(data);
        } else {
          toast.error("Failed to fetch user KPI");
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { usedDevices, isLoading };
};
