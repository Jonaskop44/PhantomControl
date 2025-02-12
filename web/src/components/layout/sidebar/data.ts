export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      { title: "Dashboard", icon: "mdi:home", url: "/dashboard", items: [] },
      { title: "Calendar", icon: "mdi:calendar", url: "/calendar", items: [] },
      { title: "Profile", icon: "mdi:account", url: "/profile", items: [] },
      {
        title: "Forms",
        icon: "mdi:form-textbox",
        items: [
          { title: "Form Elements", url: "/forms/form-elements" },
          { title: "Form Layout", url: "/forms/form-layout" },
        ],
      },
      {
        title: "Tables",
        icon: "mdi:table",
        items: [{ title: "Tables", url: "/tables" }],
      },
      {
        title: "Pages",
        icon: "mdi:file",
        items: [{ title: "Settings", url: "/pages/settings" }],
      },
    ],
  },
  {
    label: "OTHERS",
    items: [
      {
        title: "Charts",
        icon: "mdi:chart-pie",
        items: [{ title: "Basic Chart", url: "/charts/basic-chart" }],
      },
      {
        title: "UI Elements",
        icon: "mdi:view-grid",
        items: [
          { title: "Alerts", url: "/ui-elements/alerts" },
          { title: "Buttons", url: "/ui-elements/buttons" },
        ],
      },
      {
        title: "Authentication",
        icon: "mdi:lock",
        items: [{ title: "Sign In", url: "/auth/sign-in" }],
      },
    ],
  },
];
