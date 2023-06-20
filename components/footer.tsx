import React from "react"
import Link from "next/link"

export default function Footer() {
  return (
    <div className="absolute bottom-3 left-[50%] translate-x-[-50%] text-sm text-muted-foreground">
      <span>
        Made by{" "}
        <Link
          className=" underline"
          href="https://twitter.com/s0nhaaa"
          target="_blank"
        >
          s0nhaaa
        </Link>
      </span>
    </div>
  )
}
