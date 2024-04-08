"use client";

import { Breadcrumbs, BreadcrumbItem } from "@/components/nextui";
import SpaceHeaderBarRetitleInput from "./space-header-bar-retitle-input";

function SpaceHeaderBar() {
  return (
    <div className="h-8 bg-[#0E0E0E] text-white flex items-center px-8">
      <Breadcrumbs size="sm">
        <BreadcrumbItem key="space-list">空間列表</BreadcrumbItem>
        <BreadcrumbItem>
          <SpaceHeaderBarRetitleInput />
        </BreadcrumbItem>
      </Breadcrumbs>
    </div>
  );
}

export default SpaceHeaderBar;
