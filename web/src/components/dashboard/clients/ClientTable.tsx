/* eslint-disable react-hooks/exhaustive-deps */
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
  Avatar,
  ChipProps,
  SortDescriptor,
  Selection,
} from "@heroui/react";
import { FC, useCallback, useMemo } from "react";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { Client } from "@/types/clients";

interface ClientTableProps {
  statusColorMap: Record<string, ChipProps["color"]>;
  filterValue: string;
  onClear: () => void;
  onSearchChange: (value: string) => void;
  statusFilter: Selection;
  setStatusFilter: (value: Selection) => void;
  statusOptions: { name: string; uid: string }[];
  selectedKeys: Selection;
  setSelectedKeys: (value: Selection) => void;
  visibleColumns: Selection;
  setVisibleColumns: (value: Selection) => void;
  onRowsPerPageChange: (value: number) => void;
  clients: Client[];
  hasSearchFilter: boolean;
  page: number;
  setPage: (value: number) => void;
  pages: number;
  sortDescriptor: SortDescriptor;
  columns: { name: string; uid: string; sortable?: boolean }[];
  items: Client[];
  setSortDescriptor: (value: SortDescriptor) => void;
  headerColumns: { name: string; uid: string; sortable?: boolean }[];
  sortedItems: Client[];
}

const ClientTable: FC<ClientTableProps> = ({
  statusColorMap,
  filterValue,
  onClear,
  onSearchChange,
  statusFilter,
  setStatusFilter,
  statusOptions,
  selectedKeys,
  setSelectedKeys,
  visibleColumns,
  setVisibleColumns,
  onRowsPerPageChange,
  clients,
  hasSearchFilter,
  page,
  setPage,
  pages,
  sortDescriptor,
  columns,
  items,
  setSortDescriptor,
  headerColumns,
  sortedItems,
}) => {
  const actionList = [
    {
      name: "Open Console",
      key: "console",
      icon: "mdi:console",
      color: "primary" as const,
    },
    {
      name: "Open File Explorer",
      key: "fileExplorer",
      icon: "mdi:folder",
      color: "primary" as const,
    },
    {
      name: "Delete",
      key: "delete",
      icon: "mdi:trash-can",
      color: "danger" as const,
    },
  ];

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
                {actionList.map((action) => (
                  <DropdownItem
                    key={action.key}
                    startContent={<Icon icon={action.icon} />}
                    color={action.color}
                  >
                    {action.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
    }
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
                {columns
                  .filter((column) => column.uid !== "actions")
                  .map((column) => (
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

export default ClientTable;
