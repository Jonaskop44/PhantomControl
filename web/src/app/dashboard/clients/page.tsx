"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Avatar,
} from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import ApiClient from "@/api";
import { Clients } from "@/types/clients";
import { format } from "date-fns";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "USERNAME", uid: "username", sortable: true },
  { name: "OS", uid: "os", sortable: true },
  { name: "HWID", uid: "hwid", sortable: true },
  { name: "IP", uid: "ip", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "CREATED AT", uid: "createdAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Online", uid: "online" },
  { name: "Offline", uid: "offline" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  online: "success",
  offline: "danger",
};

const INITIAL_VISIBLE_COLUMNS = ["username", "hwid", "ip", "status", "actions"];

type Client = Clients;

const apiClient = new ApiClient();

const ClientsPage = () => {
  const [clients, setClients] = useState<Clients[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });

  useEffect(() => {
    apiClient.clients.helper.getAllClients().then((response) => {
      if (response.status) {
        setClients(response.data);
      }
    });
  }, []);

  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredClients = [...clients];

    if (hasSearchFilter) {
      filteredClients = filteredClients.filter((client) =>
        client.username.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredClients = filteredClients.filter((client) =>
        Array.from(statusFilter).includes(client.online ? "online" : "offline")
      );
    }

    return filteredClients;
  }, [clients, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: Client, b: Client) => {
      const first = a[sortDescriptor.column as keyof Client] as number;
      const second = b[sortDescriptor.column as keyof Client] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback((client: Client, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return <p className="text-bold text-small">{client.id}</p>;

      case "username":
        return (
          <div className="flex items-center gap-2">
            <Avatar
              classNames={{
                base: "bg-gradient-to-br from-[#006bff] to-[#00aaff]",
                icon: "text-black/80",
              }}
              icon={
                <Icon icon="mdi:account" className="text-black" fontSize={25} />
              }
            />
            <p className="text-bold text-small capitalize">{client.username}</p>
          </div>
        );

      case "os":
        if (typeof client.os === "string") {
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{client.os}</p>
              <p className="text-bold text-tiny capitalize text-default-400">
                {client.hostname}
              </p>
            </div>
          );
        }

      case "hwid":
        return <p className="text-bold text-small">{client.hwid}</p>;

      case "ip":
        return <p className="text-bold text-small">{client.ip}</p>;

      case "status":
        const statusText =
          client.online !== undefined
            ? client.online
              ? "Online"
              : "Offline"
            : "N/A";

        return (
          <Chip
            className="capitalize"
            color={statusColorMap[client.online ? "online" : "offline"]}
            size="sm"
            variant="flat"
          >
            {statusText}
          </Chip>
        );

      case "createdAt":
        if (typeof client.createdAt === "string") {
          const date = new Date(client.createdAt);
          return format(date, "dd MMM yyyy, HH:mm");
        }

      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <Icon icon="mdi:dots-vertical" className="text-black" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="view">View</DropdownItem>
                <DropdownItem key="edit">Edit</DropdownItem>
                <DropdownItem key="delete">Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
    }
  }, []);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<Icon icon="mdi:magnify" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={
                    <Icon icon="mdi:chevron-down" className="text-small" />
                  }
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={
                    <Icon icon="mdi:chevron-down" className="text-small" />
                  }
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <span className="text-default-400 text-small">
          Total {clients.length} clients
        </span>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    clients.length,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <Table
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[565px]",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No clients found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ClientsPage;
