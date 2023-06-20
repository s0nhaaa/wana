import React from "react"

import { Badge } from "./ui/badge"

interface TxStatusProps {
  status: "Fail" | "Success"
}

export default function TxStatus({ status }: TxStatusProps) {
  return (
    <>
      {status === "Fail" ? (
        <Badge
          variant="default"
          className="select-none bg-[#E97A76] text-[#410704] hover:bg-[#E97A76] hover:text-[#410704]"
        >
          Transaction Fail
        </Badge>
      ) : (
        <Badge
          variant="default"
          className=" select-none bg-[#6CD09E] text-[#123222] hover:bg-[#6CD09E] hover:text-[#123222]"
        >
          Transaction Success
        </Badge>
      )}
    </>
  )
}
