import { NavSection } from "@/types/sidebar";

export const NAV_DATA: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [{ title: "Home", icon: "mdi:home", url: "/dashboard", items: [] }],
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
        icon: "mdi:console",
        url: "/dashboard/commands",
        items: [],
      },
      {
        title: "File Explorer",
        icon: "mdi:file",
        url: "/clients/:hwid/files",
        items: [],
      },
    ],
  },
];
