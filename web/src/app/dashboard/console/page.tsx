"use client";

import { Tabs, Tab } from "@heroui/tabs";
import ApiClient from "@/api";
import { Consoles } from "@/types/consoles";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Chip, Input, Spinner } from "@heroui/react";
import { toast } from "sonner";
import { Messages } from "@/types/message";

const apiClient = new ApiClient();

const ConsolePage = () => {
  const [consoles, setConsoles] = useState<Consoles[]>([]);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHwid, setSelectedHwid] = useState<string | null>(null);
  const [commandInput, setCommandInput] = useState<string>("");
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

  useEffect(() => {
    if (selectedHwid) {
      apiClient.clients.helper
        .getConsoleByHwid(selectedHwid)
        .then((response) => {
          if (response.status && response.data?.messages) {
            setMessages(response.data.messages);
          } else {
            setMessages([]);
          }
        });
    }
  }, [selectedHwid]);

  useEffect(() => {
    apiClient.clients.helper.initSocket((data) => {
      setConsoles((prevConsoles) => {
        return prevConsoles.map((console) =>
          console.hwid === data.hwid
            ? { ...console, client: { ...console.client, online: data.online } }
            : console
        );
      });
    });

    return () => {
      apiClient.clients.helper.disconnectSocket();
    };
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

        const newMessage: Messages = {
          content: command,
          response: response.data.output,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newMessage]);
      } else {
        toast.error("Failed to send command");
      }
    });
  };

  const renderTabTitle = (title: string, hwid: string) => {
    const isOnline = consoles.find((console) => console.hwid === hwid)?.client
      ?.online;

    return (
      <div className="flex items-center capitalize">
        {title}
        <Chip
          className="border-none"
          color={isOnline ? "success" : "danger"}
          size="sm"
          variant="dot"
        />
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
          <Tabs
            className="flex justify-center items-center"
            onSelectionChange={(hwid) => setSelectedHwid(hwid.toString())}
          >
            {consoles.map((console) => (
              <Tab
                key={console.hwid}
                title={renderTabTitle(console.name, console.hwid)}
                value={console.hwid}
              />
            ))}
          </Tabs>
          <div className="mt-12 overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div key={index} className="mb-2 flex flex-col">
                  <div className="flex justify-end">
                    <p className="text-sm bg-blue-500 text-white p-2 rounded-lg">
                      <strong>Command:</strong> {message.content}
                    </p>
                  </div>
                  <div className="flex justify-start mt-1">
                    <p className="text-sm bg-gray-200 p-2 rounded-lg">
                      <strong>Response:</strong> {message.response}
                    </p>
                  </div>
                  {message.timestamp && (
                    <p className="text-xs text-gray-500 mt-1">
                      <strong>Timestamp:</strong>{" "}
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p>No messages available</p>
            )}
          </div>
          <div className="flex-grow" />

          <div className="flex justify-start mb-4">
            <Input
              placeholder="Enter your command"
              className="w-1/3"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendCommand(selectedHwid!, commandInput);
                  setCommandInput("");
                }
              }}
            />
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
