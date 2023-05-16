"use client"

import { FormEvent, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { BellRing, Glasses } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SelectCluster } from "@/components/select-cluster"
import TransactionModal from "@/components/transaction-modal"

export default function IndexPage() {
  const [count, setCount] = useState(2)
  const input = useRef<HTMLInputElement>(null)
  const [index, setIndex] = useState<number | boolean>(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setCount(Number(input.current?.value) ?? 0)
  }

  return (
    <div className="relative h-screen w-screen ">
      <SelectCluster />
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-[700px] w-[60vw]">
          <form action="" onSubmit={handleSubmit}>
            <div className=" inset-0 m-auto min-w-[400px] ">
              <Input
                ref={input}
                className=" text-md"
                type="text"
                placeholder="Ex: Hb2HDX6tnRfw5j442npy58Z2GBzJA58Nz7ipouWGT63p"
              />
            </div>
          </form>
          {count >= 0 && (
            <ScrollArea className={`mt-2 h-[700px] w-full`}>
              {Array(3)
                .fill(0)
                .map((item, i) => (
                  <motion.div
                    key={i}
                    className="mb-3  w-[100%] rounded-sm"
                    layoutId={String(i)}
                  >
                    <Card
                      className="relative select-none"
                      onClick={() => setIndex(i)}
                    >
                      <CardHeader>
                        <CardTitle className="relative flex items-center gap-2">
                          SOL Transfer
                          <div className="flex gap-2">
                            <Badge variant="default" className=" select-none">
                              Transaction Success
                            </Badge>
                            <Badge variant="default" className=" select-none">
                              Transaction Fail
                            </Badge>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link
                                  href={
                                    new URL(
                                      `address/TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`,
                                      "https://translator.shyft.to/"
                                    )
                                  }
                                  target="_blank"
                                  className=" absolute right-0 inline-flex h-9 w-9 select-none items-center justify-center rounded-md border border-input p-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                >
                                  <Glasses size={16} />
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View on Shyft Transalator</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </CardTitle>
                        <CardDescription>
                          Made by{" "}
                          <Link
                            className="group relative  text-primary hover:underline"
                            href={
                              new URL(
                                `address/TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`,
                                "https://translator.shyft.to/"
                              )
                            }
                            target="_blank"
                          >
                            Token Program
                          </Link>{" "}
                          8 minutes ago
                        </CardDescription>
                        <CardContent className=" grid gap-3 p-0">
                          <div className=" flex w-full space-x-4 rounded-md border p-4">
                            <BellRing />
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-none">
                                Wrapper SOL
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Hb2HDX6tnRfw5j442npy58Z2GBzJA58Nz7ipouWGT63p
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
            </ScrollArea>
          )}
        </div>
      </div>
      <AnimatePresence>
        {index !== false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            key="overlay"
            className="absolute inset-0 bg-slate-900 opacity-[0.2]"
            onClick={() => setIndex(false)}
          />
        )}

        {index !== false && (
          <TransactionModal
            id={String(index)}
            key="image"
            onClick={() => setIndex(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
