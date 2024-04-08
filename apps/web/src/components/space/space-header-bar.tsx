import Link from "next/link";
import { Breadcrumbs, BreadcrumbItem } from "@/components/nextui";
import SpaceHeaderBarRetitleInput from "./space-header-bar-retitle-input";

function SpaceHeaderBar() {
  return (
    <div className="h-8 bg-[#0E0E0E]">
      <Breadcrumbs>
        <BreadcrumbItem>
          <Link
            href="/spaces"
            className="text-white opacity-60 hover:opacity-100"
          >
            空間列表
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <SpaceHeaderBarRetitleInput />
        </BreadcrumbItem>
      </Breadcrumbs>
    </div>
  );
}

export default SpaceHeaderBar;
