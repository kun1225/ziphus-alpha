"use client";

import { FaDiscord } from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";
import Link from "next/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@/components/nextui";
import useLogout from "@/hooks/useLogout";
import useMe from "@/hooks/useMe";
import ZiphusIcon from "./ziphus-icon";

function Header() {
  const { account } = useMe();
  const logout = useLogout();
  return (
    <Navbar isBordered>
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4 flex items-center gap-2">
          <span className="size-6">
            <ZiphusIcon />
          </span>
          <Link href="/">
            <p className="hidden font-bold text-inherit text-white sm:block">
              Ziphus
            </p>
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden gap-3 text-zinc-200 sm:flex">
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <Link color="foreground " href="#">
                  Community
                </Link>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Static Actions"
                className="text-zinc-200"
              >
                <DropdownItem
                  key="discord"
                  startContent={<FaDiscord />}
                  href="https://discord.gg/sDcyDYjr"
                  target="_blank"
                >
                  Discord
                </DropdownItem>
                <DropdownItem
                  key="threads"
                  startContent={<FaThreads />}
                  href="https://www.threads.net/@ray.realms"
                  target="_blank"
                >
                  My threads
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground " href="#">
              wiki
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground " href="#">
              Price
            </Link>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>

      <NavbarContent
        as="div"
        className="items-center text-zinc-100 dark"
        justify="end"
      >
        {account ? (
          <>
            <NavbarItem>
              <Link color="foreground " href="/spaces">
                My Spaces
              </Link>
            </NavbarItem>

            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name={account.name}
                  size="sm"
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Profile Actions"
                variant="flat"
                className="text-white"
              >
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{account.email}</p>
                </DropdownItem>
                <DropdownItem key="settings">My Settings</DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={() => {
                    logout();
                  }}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        ) : (
          <NavbarItem>
            <Link color="foreground" href="/login">
              Sign in
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
export default Header;
