import { NavSection } from "@/types/sidebar";

export const NAV_DATA: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Home",
        icon: "solar:home-angle-linear",
        url: "/dashboard",
        items: [],
      },
    ],
  },
  {
    label: "CLIENT MANAGEMENT",
    items: [
      {
        title: "Clients",
        icon: "mdi:devices",
        url: "/dashboard/clients",
        items: [],
      },
      {
        title: "Console",
        icon: "teenyicons:terminal-outline",
        url: "/dashboard/console",
        items: [],
      },
      {
        title: "File Explorer",
        icon: "solar:folder-outline",
        url: "/dashboard/file-explorer",
        items: [],
      },
    ],
  },
];
