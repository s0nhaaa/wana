import { useEffect, useState } from "react"
import Link from "next/link"
import { cleanup } from "@/helpers/cleanup"
import { getValueByKey } from "@/helpers/get-value-by-key"
import { parseName, parseProtocol } from "@/helpers/parser"
import { useAppStore } from "@/stores/app"
import { useWallet } from "@solana/wallet-adapter-react"
import { AnimatePresence, motion } from "framer-motion"
import { Glasses } from "lucide-react"
import moment from "moment"

import { ShyftTxParsedHistoryResult } from "@/types/shyft-tx-parsed-history"
import {
  GENERATIVE_COLORS,
  LOADING_STATUS,
  SHYFT_TRANSLATOR_ENDPOINT,
} from "@/config/constants"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import TransactionModal from "@/components/transaction-modal"

import GenerativeBackground from "./generative-background"
import TxStatus from "./tx-status"

const variants = {
  show: { opacity: 1, height: 650 },
  hide: { opacity: 0, height: 0 },
}

export default function HistoryList() {
  const [selectedTx, setSelectedTx] =
    useState<ShyftTxParsedHistoryResult | null>()
  const [
    txHistory,
    isLoading,
    loadingStatus,
    setIsLoading,
    setTxHistory,
    setLoadingStatus,
  ] = useAppStore((state) => [
    state.txHistory,
    state.isLoading,
    state.loadingStatus,
    state.setIsLoading,
    state.setTxHistory,
    state.setLoadingStatus,
  ])
  const [history, setHistory] = useState<
    ShyftTxParsedHistoryResult[] | undefined
  >()
  const cluster = useAppStore((state) => state.cluster)
  const { publicKey } = useWallet()

  useEffect(() => {
    const generatePrompt = async () => {
      if (!txHistory) {
        setHistory(undefined)
        return
      }

      let formatedTransaction = ""
      const txHistoryClone = structuredClone(txHistory)

      txHistory.map((tx, index) => {
        formatedTransaction += `\n${
          index + 1
        }.1. Transaction Id is ${tx.signatures[0].slice(0, 8)}\n${
          index + 1
        }.2. Transaction type is ${parseName(tx.type)}`
      })

      let currentIndex = 0

      const intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % LOADING_STATUS.length
        setLoadingStatus(LOADING_STATUS[currentIndex])
      }, 2000)

      try {
        const res = await fetch(`api/g`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: formatedTransaction,
          }),
        })

        const data = await res.json()
        console.log(data.data)
        console.log(cleanup(data.data))

        const parsedData = JSON.parse(cleanup(data.data))
        console.log(parsedData)

        if (parsedData) {
          txHistoryClone.forEach((tx) => {
            tx.generatedName = getValueByKey(
              parsedData,
              tx.signatures[0].slice(0, 8),
              parseName(tx.type)
            )
          })
        }

        setLoadingStatus("Here're yours: ")
        setHistory(txHistoryClone)
      } catch (error) {
        console.log(error)
        txHistoryClone.forEach((tx) => {
          tx.generatedName = parseName(tx.type)
        })
        setLoadingStatus(
          "GPT couldn't find the better name than default. Here're yours: "
        )
        setHistory(txHistoryClone)
      } finally {
        clearInterval(intervalId)
        setIsLoading(false)
      }
    }

    generatePrompt()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txHistory])

  useEffect(() => {
    setSelectedTx(null)
  }, [publicKey])

  return (
    <>
      <AnimatePresence>
        {history && history.length > 0 && (
          <motion.div
            initial="hide"
            variants={variants}
            animate={history.length > 0 ? "show" : "hide"}
            exit="hide"
            className="mt-8 overflow-hidden"
          >
            <ScrollArea className={` h-[650px] w-full`}>
              {history.map((tx, i) => (
                <motion.div
                  key={i}
                  className="mb-3  w-[100%] rounded-sm"
                  layoutId={tx.signatures[0]}
                >
                  <Card
                    className="relative select-none hover:border-accent-foreground"
                    onClick={() => setSelectedTx(tx)}
                  >
                    <CardHeader>
                      <CardTitle className="relative flex items-center gap-2">
                        <GenerativeBackground
                          name={tx.signatures[0]}
                          colors={GENERATIVE_COLORS}
                          size={20}
                          className="rounded-md"
                          title="sh"
                          square={true}
                        />
                        {tx.generatedName
                          ? tx.generatedName
                          : parseName(tx.type)}{" "}
                        <div className="flex gap-2">
                          <TxStatus status={tx.status} />
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={
                                  new URL(
                                    `tx/${tx.signatures[0]}?${
                                      cluster !== "mainnet-beta"
                                        ? `cluster=${cluster}`
                                        : ""
                                    }`,
                                    SHYFT_TRANSLATOR_ENDPOINT
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
                              `address/${tx.protocol.address}?${
                                cluster !== "mainnet-beta"
                                  ? `cluster=${cluster}`
                                  : ""
                              }`,
                              SHYFT_TRANSLATOR_ENDPOINT
                            )
                          }
                          target="_blank"
                        >
                          {parseProtocol(tx.protocol)}
                        </Link>{" "}
                        {moment(tx.timestamp).fromNow()}
                      </CardDescription>
                      <CardContent className="grid gap-3 p-0">
                        {tx.actions.slice(0, 2).map((action, index) => (
                          <div
                            key={index}
                            className="flex w-full flex-col space-x-4 rounded-md border p-4"
                          >
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-none">
                                {parseName(action.type)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTx && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            key="overlay"
            className="absolute inset-0 z-20 bg-slate-900 opacity-[0.2]"
          />
        )}

        {selectedTx && (
          <TransactionModal
            tx={selectedTx}
            id={selectedTx.signatures[0]}
            key="image"
            onClick={() => setSelectedTx(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
