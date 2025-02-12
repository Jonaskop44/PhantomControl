import Link from "next/link";
import { useSidebarContext } from "@/context/SidebarProvider";
import clsx from "clsx";

const SidebarItem = (
  props: {
    className?: string;
    children: React.ReactNode;
    isActive: boolean;
  } & ({ as?: "button"; onClick: () => void } | { as: "link"; href: string })
) => {
  const { toggleSidebar, isMobile } = useSidebarContext();

  const baseStyles =
    "rounded-lg px-3.5 font-medium text-dark-4 transition-all duration-200";
  const activeStyles =
    "bg-[rgba(87,80,241,0.07)] text-primary hover:bg-[rgba(87,80,241,0.07)]";
  const inactiveStyles = "hover:bg-gray-100 hover:text-dark";

  const linkStyles = clsx(
    baseStyles,
    props.isActive ? activeStyles : inactiveStyles,
    "relative block py-2",
    props.className
  );

  const buttonStyles = clsx(
    baseStyles,
    props.isActive ? activeStyles : inactiveStyles,
    "flex w-full items-center gap-3 py-3"
  );

  if (props.as === "link") {
    return (
      <Link
        href={props.href}
        onClick={() => isMobile && toggleSidebar()}
        className={linkStyles}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      onClick={props.onClick}
      aria-expanded={props.isActive}
      className={buttonStyles}
    >
      {props.children}
    </button>
  );
};

export default SidebarItem;
