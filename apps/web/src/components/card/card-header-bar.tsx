import { Breadcrumbs } from "@/components/material-tailwind";
import Link from "next/link";
import { MdArrowForwardIos } from "react-icons/md";
import CardHeaderBarRetitleInput from "./card-header-bar-retitle-input";

function CardHeaderBar() {
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
        <Link href="/cards" className="text-white opacity-60 hover:opacity-100">
          筆記列表
        </Link>
        <CardHeaderBarRetitleInput />
      </Breadcrumbs>
    </div>
  );
}

export default CardHeaderBar;
