"use client";

import ApiClient from "@/api";
import { Consoles } from "@/types/consoles";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Avatar, Chip, Input, Button, Spinner } from "@heroui/react";
import { toast } from "sonner";
import { Messages } from "@/types/message";
import clsx from "clsx";

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
            console.log(response.data.messages);
          } else {
            setMessages([]);
          }
        });
    }
  }, [selectedHwid]);

  // useEffect(() => {
  //   apiClient.clients.helper.initSocket((data) => {
  //     setConsoles((prevConsoles) => {
  //       return prevConsoles.map((console) =>
  //         console.hwid === data.hwid
  //           ? { ...console, client: { ...console.client, online: data.online } }
  //           : console
  //       );
  //     });
  //   });

  //   return () => {
  //     apiClient.clients.helper.disconnectSocket();
  //   };
  // }, []);

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

  return (
    <div className="flex bg-white rounded-xl shadow-md h-full max-h-[650px]">
      {isLoading ? (
        <div className="flex justify-center items-center h-full w-full">
          <Spinner label="Loading..." />
        </div>
      ) : consoles.length > 0 ? (
        <>
          {/* Tabs */}
          <div className="flex flex-col justify-start bg-white rounded-tl-xl rounded-bl-xl max-w-[250px] h-full p-4 border-r overflow-y-auto custom-scrollbar">
            {consoles.map((console) => (
              <div
                key={console.hwid}
                className={clsx(
                  "mb-2 bg-slate-100 p-4 rounded-xl flex items-center cursor-pointer",
                  {
                    "bg-slate-200 shadow-md": selectedHwid === console.hwid,
                  }
                )}
                onClick={() => setSelectedHwid(console.hwid)}
              >
                <Avatar
                  size="md"
                  className="flex justify-start"
                  classNames={{
                    base: "bg-gradient-to-br from-[#006bff] to-[#00aaff]",
                    icon: "text-black/80",
                  }}
                  icon={
                    <Icon
                      icon="mdi:account"
                      className="text-black"
                      fontSize={25}
                    />
                  }
                />
                <div className="ml-2">
                  <p className="ml-2 text-ellipsis overflow-hidden whitespace-nowrap">
                    {console.name}
                  </p>
                  <Chip
                    className="capitalize border-none"
                    color={console.client?.online ? "success" : "danger"}
                    size="md"
                    variant="dot"
                  >
                    {console.client?.online ? "online" : "offline"}
                  </Chip>
                </div>
              </div>
            ))}
          </div>

          {/* Console */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col">
            {selectedHwid ? (
              <div className="flex-1">
                {messages.length > 0 ? (
                  messages.map((message, index) => (
                    <div key={index} className="mb-2 flex flex-col">
                      {/* Sended Command */}
                      <div className="flex justify-end">
                        <p className="text-sm bg-blue-500 text-white py-2 px-6 rounded-lg max-w-[50%]">
                          {message.content}
                        </p>
                      </div>
                      {/* Response */}
                      <div className="flex justify-start mt-1">
                        <p className="text-sm bg-gray-200 p-2 rounded-lg max-w-[50%]">
                          {message.response}
                        </p>
                      </div>
                      {/* Timestamp */}
                      {message.timestamp && (
                        <p className="text-xs text-gray-500 mt-1">
                          <strong>Timestamp:</strong>{" "}
                          {new Date(message.timestamp).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <h1 className="font-semibold text-2xl">
                      Right now there are no commands in the history for this
                      console
                    </h1>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center h-full">
                <h1 className="font-semibold text-2xl">Select a console</h1>
              </div>
            )}

            {/* Input and Button Container */}
            <div className="flex justify-center items-center p-4 border-t">
              <Input
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="Enter command"
                className="mr-2"
              />
              <Button
                onPress={() => {
                  if (selectedHwid && commandInput) {
                    sendCommand(selectedHwid, commandInput);
                    setCommandInput("");
                  }
                }}
              >
                Send
              </Button>
            </div>
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
