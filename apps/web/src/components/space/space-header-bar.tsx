import { Breadcrumbs } from "@/components/material-tailwind";
import Link from "next/link";
import { MdArrowForwardIos } from "react-icons/md";
import SpaceHeaderBarRetitleInput from "./space-header-bar-retitle-input";

function SpaceHeaderBar() {
  return (
    <div className="h-8 bg-[#0E0E0E]">
      <Breadcrumbs
        separator={
          <span className="h-4 w-4 text-white">
            <MdArrowForwardIos />
          </span>
        }
        className="m-auto bg-opacity-0"
      >
        <Link
          href="/spaces"
          className="text-white opacity-60 hover:opacity-100"
        >
          空間列表
        </Link>
        <SpaceHeaderBarRetitleInput />
      </Breadcrumbs>
    </div>
  );
}

export default SpaceHeaderBar;
