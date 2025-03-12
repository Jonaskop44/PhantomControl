import { BillingProps, Filter } from "@/types/billing";

export function useBillingHelpers() {
  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format amount with currency
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get status display text
  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Paid";
      case "unpaid":
        return "Open";
      case "trial":
        return "Trial";
      default:
        return status;
    }
  };

  // Get status color for chip
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "unpaid":
        return "warning";
      case "trial":
        return "primary";
      default:
        return "default";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return "solar:check-circle-broken";
      case "unpaid":
        return "solar:clock-circle-bold-duotone";
      case "trial":
        return "solar:refresh-bold";
      default:
        return "solar:info-circle-bold-duotone";
    }
  };

  // Get status background color
  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-600";
      case "unpaid":
        return "bg-amber-100 text-amber-600";
      case "trial":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Filter records based on selected filter
  const filterRecords = (records: BillingProps[], filter: Filter) => {
    return records.filter((item) => {
      if (filter === "all") return true;
      if (filter === "open") return item.status === "unpaid";
      return item.status === filter;
    });
  };

  // Get display amount (special handling for trial)
  const getDisplayAmount = (record: BillingProps) => {
    return formatAmount(record.amount_paid);
  };

  // Calculate pagination
  const getPaginationData = (
    records: BillingProps[],
    currentPage: number,
    recordsPerPage: number
  ) => {
    const totalPages = Math.ceil(records.length / recordsPerPage);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

    return {
      totalPages,
      indexOfFirstRecord,
      indexOfLastRecord,
      currentRecords,
    };
  };

  return {
    formatDate,
    formatAmount,
    getStatusText,
    getStatusColor,
    getStatusIcon,
    getStatusBgColor,
    filterRecords,
    getDisplayAmount,
    getPaginationData,
  };
}
