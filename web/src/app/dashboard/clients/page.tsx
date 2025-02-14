/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Selection, ChipProps, SortDescriptor } from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import ApiClient from "@/api";
import { Clients, Client } from "@/types/clients";
import ClientTable from "@/components/dashboard/clients/ClientTable";

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
const STORAGE_KEY = "visibleColumns";

const apiClient = new ApiClient();

const ClientsPage = () => {
  const [clients, setClients] = useState<Clients[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [page, setPage] = useState(-1);
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });

  const getStoredColumns = (): Set<string> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored
      ? new Set(JSON.parse(stored))
      : new Set(INITIAL_VISIBLE_COLUMNS);
  };

  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(getStoredColumns())
  );

  useEffect(() => {
    apiClient.clients.helper.getAllClients().then((response) => {
      if (response.status) {
        setClients(response.data);
      }
    });
  }, []);

  useEffect(() => {
    if (clients.length > 0) {
      setPage(1);
    }
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Array.from(visibleColumns))
    );
  }, [visibleColumns]);

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
      let first = a[sortDescriptor.column as keyof Client] as number;
      let second = b[sortDescriptor.column as keyof Client] as number;

      if (sortDescriptor.column === "status") {
        first = a.online ? 0 : 1;
        second = b.online ? 0 : 1;
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

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

  return (
    <ClientTable
      statusColorMap={statusColorMap}
      filterValue={filterValue}
      onClear={onClear}
      onSearchChange={onSearchChange}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      statusOptions={statusOptions}
      selectedKeys={selectedKeys}
      setSelectedKeys={setSelectedKeys}
      visibleColumns={visibleColumns}
      setVisibleColumns={setVisibleColumns}
      onRowsPerPageChange={setRowsPerPage}
      clients={clients}
      hasSearchFilter={hasSearchFilter}
      page={page}
      setPage={setPage}
      pages={pages}
      sortDescriptor={sortDescriptor}
      columns={columns}
      items={items}
      setSortDescriptor={setSortDescriptor}
      headerColumns={headerColumns}
      sortedItems={sortedItems}
    />
  );
};

export default ClientsPage;
