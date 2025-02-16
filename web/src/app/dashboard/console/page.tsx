"use client";

import { Tabs, Tab } from "@heroui/tabs";
import ApiClient from "@/api";
import { Consoles } from "@/types/consoles";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Input, Spinner } from "@heroui/react";
import { toast } from "sonner";
import { Messages } from "@/types/message";

const apiClient = new ApiClient();

const ConsolePage = () => {
  const [consoles, setConsoles] = useState<Consoles[]>([]);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmClose, setConfirmClose] = useState<{
    [hwid: string]: NodeJS.Timeout | null;
  }>({});

  useEffect(() => {
    apiClient.clients.helper
      .getConsolesByUserId()
      .then((response) => {
        if (response.status) {
          setConsoles(response.data);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const closeConsole = (hwid: string) => {
    if (!confirmClose[hwid]) {
      toast.info("Press again to confirm close");

      const timeout = setTimeout(() => {
        setConfirmClose((prev) => {
          const updated = { ...prev };
          delete updated[hwid];
          return updated;
        });
      }, 5000);

      setConfirmClose((prev) => ({ ...prev, [hwid]: timeout }));
    } else {
      clearTimeout(confirmClose[hwid]!);
      apiClient.clients.helper.deleteConsole(hwid).then((response) => {
        if (response.status) {
          setConsoles(consoles.filter((console) => console.hwid !== hwid));
          toast.success("Console closed successfully");
          setConfirmClose((prev) => {
            const updated = { ...prev };
            delete updated[hwid];
            return updated;
          });
        } else {
          toast.error("Failed to close console");
        }
      });
    }
  };

  const sendCommand = (hwid: string, command: string) => {
    apiClient.clients.helper.sendCommand(hwid, command).then((response) => {
      if (response.status) {
        toast.success("Command sent successfully");
      } else {
        toast.error("Failed to send command");
      }
    });
  };

  const renderTabTitle = (title: string, hwid: string) => {
    return (
      <div className="flex items-center gap-2">
        {title}
        <Icon
          icon="mdi:close"
          width={16}
          height={16}
          style={{
            cursor: "pointer",
            color: confirmClose[hwid] ? "red" : "black",
          }}
          onClick={(e) => {
            e.stopPropagation();
            closeConsole(hwid);
          }}
        />
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md h-full max-h-[565px] flex flex-col">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner label="Loading..." />
        </div>
      ) : consoles.length > 0 ? (
        <>
          <Tabs className="flex justify-center items-center">
            {consoles.map((console) => (
              <Tab
                key={console.hwid}
                title={renderTabTitle(console.name, console.hwid)}
              />
            ))}
          </Tabs>
          <div className="flex-grow" />
          <div className="flex justify-start">
            <Input placeholder="Enter your command" className="w-1/3" />
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <h1 className="font-semibold text-2xl">No consoles found</h1>
        </div>
      )}
    </div>
  );
};

export default ConsolePage;
