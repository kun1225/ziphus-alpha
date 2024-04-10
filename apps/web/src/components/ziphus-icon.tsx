import React from "react";
import NextImage from "next/image";
import { Image } from "@nextui-org/react";

export default function ZiphusIcon() {
  return (
    <Image
      as={NextImage}
      width={569}
      height={569}
      src="/ziphus.png"
      alt="Ziphus Icon"
      className="rounded-none"
    />
  );
}
