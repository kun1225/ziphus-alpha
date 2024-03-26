"use client";
import { MdTipsAndUpdates } from "react-icons/md";
import { Button } from "./material-tailwind";
import SidebarContainer from "./sidebar-container";
import { useState } from "react";

function Sidebar() {
  const [display, setDisplay] = useState<"static" | "float">("static");
  return (
    <SidebarContainer display={display}>
      <div className="flex justify-between">
        <Button variant="text" className="flex flex-1 justify-start" size="sm">
          <h1 className="text-md font-bold text-gray-400">
            <span className="mr-2  text-lg text-white">
              <MdTipsAndUpdates className="inline-block" />
            </span>
            Ziphus
          </h1>
        </Button>
        <Button
          variant="text"
          className="flex w-8 justify-start"
          size="sm"
          onClick={() => setDisplay(display === "static" ? "float" : "static")}
        >
          {display === "static" ? (
            <span className="text-white">🔒</span>
          ) : (
            <span className="text-white">🔓</span>
          )}
        </Button>
      </div>
    </SidebarContainer>
  );
}

export default Sidebar;
