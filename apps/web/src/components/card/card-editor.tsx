'use client';
import { useParams } from "next/navigation";

function CardEditor() {
  // get id from url
  const { id } = useParams();
  return <div>{id}</div>;
}

export default CardEditor;
