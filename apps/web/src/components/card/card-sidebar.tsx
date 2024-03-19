import { MdTipsAndUpdates } from "react-icons/md";
import { Button } from "../material-tailwind";
import Link from "next/link";

function CardSidebar() {
  return (
    <div
      style={{ gridArea: "side" }}
      className="border-r-2 border-solid border-[#262626] bg-[#202020] p-2"
    >
      <Button variant="text" className="flex w-full justify-start" size="sm">
        <h1 className="text-md font-bold text-gray-400">
          <span className="mr-2  text-lg text-white">
            <MdTipsAndUpdates className="inline-block" />
          </span>
          Ziphus
        </h1>
      </Button>
    </div>
  );
}

export default CardSidebar;
