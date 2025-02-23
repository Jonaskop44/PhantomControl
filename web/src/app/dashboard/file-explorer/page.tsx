"use client";

import ApiClient from "@/api";
import { FileExplorers, FileTree } from "@/types/fileExplorers";
import {
  Avatar,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Chip,
  Input,
  Spinner,
} from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import useIsMobile from "@/hooks/use-mobile";
import clsx from "clsx";

const apiClient = new ApiClient();

const FileExplorerPage = () => {
  const [fileExplorers, setFileExplorers] = useState<FileExplorers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fileTree, setFileTree] = useState<FileTree[]>([]);
  const [selectedHwid, setSelectedHwid] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [path, setPath] = useState<string>("");
  const [confirmClose, setConfirmClose] = useState<{
    [hwid: string]: NodeJS.Timeout | null;
  }>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const actionTopList = [
    {
      icon: "charm:refresh",
      color: "primary" as const,
      onPress: () => {
        if (!selectedHwid) return;
        apiClient.clients.fileExplorer
          .getFileTree(selectedHwid, path)
          .then((response) => {
            if (response.status) {
              setFileTree(response.data);
            } else {
              toast.error("Failed to get file tree");
            }
          });
      },
    },
  ];

  const actionList = [
    {
      icon: "mdi:delete",
      color: "danger" as const,
      onPress: (name: string) => {
        if (!selectedHwid) return;
        apiClient.clients.fileExplorer
          .deleteFile(selectedHwid, path + "/" + name)
          .then((response) => {
            if (response.status) {
              toast.success("File deleted successfully");
              //Delete file from fileTree
              setFileTree((prevFileTree) =>
                prevFileTree.filter((file) => file.name !== name)
              );
            } else {
              toast.error("Failed to delete file");
            }
          });
      },
    },
  ];

  useEffect(() => {
    apiClient.clients.fileExplorer
      .getFileExplorersByUserId()
      .then((response) => {
        if (response.status) {
          setFileExplorers(
            response.data.sort((a: { client: { online: string } }) =>
              a.client.online ? -1 : 1
            )
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedHwid) {
      const username = fileExplorers.find(
        (fileExplorer) => fileExplorer.hwid === selectedHwid
      )?.name;

      setPath(username ? `C:/Users/${username}/Desktop` : "C:/");

      apiClient.clients.fileExplorer
        .getFileTree(
          selectedHwid,
          username ? `C:/Users/${username}/Desktop` : "C:/"
        )
        .then((response) => {
          if (response.status) {
            setFileTree(response.data);
          } else {
            toast.error("Failed to get file tree");
          }
        });
    }
  }, [fileExplorers, selectedHwid]);

  useEffect(() => {
    apiClient.clients.helper.initSocket((data) => {
      setFileExplorers((prevFileExplorer) => {
        return prevFileExplorer.map((fileExplorer) =>
          fileExplorer.hwid === data.hwid
            ? {
                ...fileExplorer,
                client: { ...fileExplorer.client, online: data.online },
              }
            : fileExplorer
        );
      });
    });

    return () => {
      apiClient.clients.helper.disconnectSocket();
    };
  }, []);

  const closeFileExplorer = (hwid: string) => {
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
      apiClient.clients.fileExplorer
        .deleteFileExplorer(hwid)
        .then((response) => {
          if (response.status) {
            setFileExplorers(
              fileExplorers.filter((fileExplorer) => fileExplorer.hwid !== hwid)
            );
            setSelectedHwid(null);
            toast.success("File Explorer closed successfully");
            setConfirmClose((prev) => {
              const updated = { ...prev };
              delete updated[hwid];
              return updated;
            });
          } else {
            toast.error("Failed to close File Explorer");
          }
        });
    }
  };

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const isOnline = (hwid: string) => {
    return fileExplorers.find((fileExplorer) => fileExplorer.hwid === hwid)
      ?.client?.online;
  };

  const filteredFileExplorers = fileExplorers.filter((fileExplorer) =>
    fileExplorer.name.toLowerCase().includes(filterValue.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 mb-4">
        <Input
          isClearable
          className="w-full sm:max-w-[30%]"
          placeholder="Search by name..."
          startContent={<Icon icon="mdi:magnify" />}
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={onSearchChange}
        />
        <span className="text-default-400 text-small">
          Total {fileExplorers.length} File Explorer
        </span>
        {/* Sidebar Toggle Button for Mobile */}
        {isMobile && (
          <Button
            onPress={() => setIsSidebarOpen((prev) => !prev)}
            color="primary"
            className="self-start"
          >
            {isSidebarOpen ? (
              <Icon icon="mdi:close" fontSize={20} />
            ) : (
              <Icon icon="mdi:menu" fontSize={20} />
            )}
          </Button>
        )}
      </div>

      <div className="flex bg-white rounded-xl shadow-md h-full max-h-[70vh]">
        {isLoading ? (
          <div className="flex justify-center items-center h-full w-full">
            <Spinner label="Loading..." />
          </div>
        ) : fileExplorers.length > 0 ? (
          <>
            {/* Tabs */}
            <div
              className={clsx(
                "flex flex-col justify-start bg-white rounded-tl-xl rounded-bl-xl max-w-[250px] h-full p-4 border-r overflow-y-auto custom-scrollbar",
                {
                  hidden: isMobile && !isSidebarOpen,
                }
              )}
            >
              {filteredFileExplorers.length > 0 ? (
                filteredFileExplorers.map((fileExplorer) => (
                  <div
                    key={fileExplorer.hwid}
                    className={clsx(
                      "mb-2 bg-slate-100 p-4 rounded-xl flex items-center group",
                      {
                        "bg-slate-200 shadow-md":
                          selectedHwid === fileExplorer.hwid,
                        "cursor-not-allowed opacity-70": !isOnline(
                          fileExplorer.hwid
                        ),
                        "cursor-pointer": isOnline(fileExplorer.hwid),
                      }
                    )}
                    onClick={() => {
                      if (isOnline(fileExplorer.hwid)) {
                        setSelectedHwid(fileExplorer.hwid);
                        setIsSidebarOpen(false);
                      } else {
                        toast.error(
                          "The client is offline so you can't access the file explorer"
                        );
                      }
                    }}
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
                    <div className="ml-2 flex-1 min-w-0">
                      <p className="text-ellipsis overflow-hidden whitespace-nowrap capitalize">
                        {fileExplorer.name}
                      </p>
                      <Chip
                        className="capitalize border-none"
                        color={
                          fileExplorer.client?.online ? "success" : "danger"
                        }
                        size="md"
                        variant="dot"
                      >
                        {fileExplorer.client?.online ? "online" : "offline"}
                      </Chip>
                    </div>
                    {/* Close Icon */}
                    <div
                      className="ml-2 p-1 rounded-full hover:bg-gray-500/20 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeFileExplorer(fileExplorer.hwid);
                      }}
                    >
                      <Icon
                        icon="mdi:close"
                        className={clsx({
                          "text-red-500 hover:text-red-700":
                            confirmClose[fileExplorer.hwid],
                          "text-gray-500 hover:text-gray-700":
                            !confirmClose[fileExplorer.hwid],
                        })}
                        fontSize={20}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center h-full">
                  <h1 className="font-semibold text-2xl">
                    There is no file explorer named{" "}
                    <span className="text-primary">{filterValue}</span>
                  </h1>
                </div>
              )}
            </div>

            {/* File Explorer */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col">
              {/* Options Container */}
              {!isSidebarOpen && selectedHwid && (
                <div className="flex justify-between border-b pb-4 items-center">
                  <div>
                    <Breadcrumbs
                      itemsAfterCollapse={2}
                      itemsBeforeCollapse={1}
                      maxItems={3}
                    >
                      {path.split("/").map((item, index) => (
                        <BreadcrumbItem
                          key={index}
                          onPress={() => {
                            const newPath = path
                              .split("/")
                              .slice(0, index + 1)
                              .join("/");
                            setPath(newPath);
                            apiClient.clients.fileExplorer
                              .getFileTree(selectedHwid, newPath)
                              .then((response) => {
                                if (response.status) {
                                  setFileTree(response.data);
                                } else {
                                  toast.error("Failed to get file tree");
                                }
                              });
                          }}
                        >
                          {item}
                        </BreadcrumbItem>
                      ))}
                    </Breadcrumbs>
                  </div>
                  <div>
                    {actionTopList.map((action, index) => (
                      <Button
                        key={index}
                        color={action.color}
                        className="ml-4"
                        isIconOnly
                        onPress={action.onPress}
                      >
                        <Icon icon={action.icon} fontSize={17} />
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {selectedHwid && !isSidebarOpen ? (
                <div className="flex-1">
                  {fileTree.length > 0 ? (
                    fileTree
                      .sort((a, b) => {
                        if (a.type === "folder" && b.type !== "folder")
                          return -1;
                        if (a.type !== "folder" && b.type === "folder")
                          return 1;
                        return 0;
                      })
                      .map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                        >
                          {/* Files */}
                          <div
                            className="flex items-center gap-2 flex-1"
                            onClick={() => {
                              if (file.type === "folder") {
                                setPath(
                                  (prevPath) => `${prevPath}/${file.name}`
                                );
                                apiClient.clients.fileExplorer
                                  .getFileTree(
                                    selectedHwid,
                                    `${path}/${file.name}`
                                  )
                                  .then((response) => {
                                    if (response.status) {
                                      setFileTree(response.data);
                                    } else {
                                      toast.error("Failed to get file tree");
                                    }
                                  });
                              }
                            }}
                          >
                            <Icon
                              icon={
                                file.type === "folder"
                                  ? "mdi:folder"
                                  : "mdi:file-document"
                              }
                              className={clsx({
                                "text-primary": file.type === "folder",
                                "text-secondary": file.type !== "folder",
                              })}
                            />
                            <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                              {file.name}
                            </p>
                          </div>

                          {/* Button List */}
                          {actionList.map((action, index) => (
                            <Button
                              key={index}
                              color={action.color}
                              isIconOnly
                              size="sm"
                              onPress={() => action.onPress(file.name)}
                            >
                              <Icon icon={action.icon} fontSize={20} />
                            </Button>
                          ))}
                        </div>
                      ))
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <h1 className="font-semibold text-2xl">
                        Something went wrong while getting file tree
                      </h1>
                    </div>
                  )}
                </div>
              ) : isSidebarOpen ? (
                <div className="flex justify-center items-center h-full">
                  <h1 className="font-semibold text-2xl">Wait for selection</h1>
                </div>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <h1 className="font-semibold text-2xl">
                    Select a File Explorer
                  </h1>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-full">
            <h1 className="font-semibold text-2xl">No File Explorer found</h1>
          </div>
        )}
      </div>
    </>
  );
};

export default FileExplorerPage;
