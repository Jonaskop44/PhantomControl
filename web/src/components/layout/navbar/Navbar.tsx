"use client";

import Image from "next/image";
import Link from "next/link";
import { useSidebarContext } from "@/context/SidebarProvider";
import { Icon } from "@iconify/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
  DropdownSection,
} from "@heroui/react";
import { userStore } from "@/data/userStore";
import { useHandleLogout } from "@/hooks/user";

const Navbar = () => {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const { user } = userStore();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white px-4 py-5 shadow-1 md:px-5 2xl:px-10">
      <button
        onClick={toggleSidebar}
        className="rounded-lg border px-1.5 py-1 lg:hidden"
      >
        <Icon icon="mdi:menu" className="text-xl" />
        <span className="sr-only">Toggle Sidebar</span>
      </button>

      {isMobile && (
        <Link href={"/"} className="ml-2 max-[430px]:hidden min-[375px]:ml-4">
          <Image
            src={"/images/icon.png"}
            width={45}
            height={45}
            alt="PhantomControl"
            role="presentation"
          />
        </Link>
      )}

      <div className="max-xl:hidden">
        <h1 className="mb-0.5 text-heading-5 font-semibold text-dark">
          Dashboard
        </h1>
        <p className="font-medium">Next.js Admin Dashboard Solution</p>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
        <div className="shrink-0">
          <Dropdown showArrow backdrop="opaque">
            <DropdownTrigger>
              <User
                as="button"
                avatarProps={{
                  src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                }}
                className="transition-transform"
                description={
                  "@" + (user.email ? user.email.split("@")[0] : "Guest")
                }
                name={user.username}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="flat">
              <DropdownSection showDivider>
                <DropdownItem isReadOnly key="profile" className="h-14 gap-2">
                  <p className="font-bold">Signed in as</p>
                  <p className="font-bold">{user.username}</p>
                </DropdownItem>
              </DropdownSection>
              <DropdownSection showDivider>
                <DropdownItem
                  key="settings"
                  startContent={<Icon icon="line-md:cog" fontSize={20} />}
                >
                  Settings
                </DropdownItem>
              </DropdownSection>
              <DropdownSection>
                <DropdownItem
                  key="logout"
                  color="danger"
                  startContent={<Icon icon="line-md:logout" />}
                  onPress={useHandleLogout()}
                >
                  Log Out
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
