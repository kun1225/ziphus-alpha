"use client";

import { useState } from "react";
import { FaMap } from "react-icons/fa";
import { MdTipsAndUpdates, MdHomeFilled } from "react-icons/md";
import {
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarLeftCollapse,
} from "react-icons/tb";
import { useRouter } from "next/navigation";
import { Button } from "@/components/nextui";
import SidebarContainer from "./sidebar-container";

function Sidebar() {
  const [display, setDisplay] = useState<"static" | "float">("static");
  const router = useRouter();
  return (
    <>
      {display === "float" && (
        <div className=" fixed left-2 top-10 z-50">
          <Button
            variant="light"
            className="size-8"
            onClick={() => setDisplay("static")}
          >
            <span className="text-white">
              <TbLayoutSidebarLeftExpand />
            </span>
          </Button>
        </div>
      )}

      <SidebarContainer display={display}>
        <div className="flex justify-between">
          <Button variant="light" className="flex size-8 flex-1 justify-start">
            <h1 className="text-md font-bold text-gray-400">
              <span className="mr-2  text-lg text-white">
                <MdTipsAndUpdates className="inline-block" />
              </span>
              Ziphus
            </h1>
          </Button>
          <Button
            variant="light"
            className="size-8"
            onClick={() =>
              setDisplay(display === "static" ? "float" : "static")
            }
          >
            {display === "static" ? (
              <span className="text-white">
                <TbLayoutSidebarLeftCollapse />
              </span>
            ) : (
              <span className="text-white">
                <TbLayoutSidebarLeftExpand />
              </span>
            )}
          </Button>
        </div>
        <Button
          variant="light"
          className="flex w-full justify-start"
          size="sm"
          onClick={() => {
            router.push("/");
          }}
        >
          <h1 className="text-md font-bold text-gray-400">
            <span className="mr-2  text-lg text-white">
              <MdHomeFilled className="inline-block" />
            </span>
            Home
          </h1>
        </Button>
        <Button
          variant="light"
          className="flex w-full justify-start"
          size="sm"
          onAbort={() => {
            router.push("/spaces");
          }}
        >
          <h1 className="text-md font-bold text-gray-400">
            <span className="mr-2  text-lg text-white">
              <FaMap className="inline-block" />
            </span>
            Spaces
          </h1>
        </Button>
      </SidebarContainer>
    </>
  );
}

export default Sidebar;
