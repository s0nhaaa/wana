"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { useAppStore } from "@/stores/app"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Loader2 } from "lucide-react"

import { ShyftTxParsedHistoryResponse } from "@/types/shyft-tx-parsed-history"
import { LOADING_STATUS } from "@/config/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface WalletInputProps {}

const variants = {
  down: { opacity: 1, y: 15 },
  normal: { opacity: 0, y: 0 },
}

export function WalletInput(props: WalletInputProps) {
  const input = useRef<HTMLInputElement>(null)
  const { publicKey } = useWallet()
  const [walletInput, setWalletInput] = useState<string>(
    publicKey?.toString() || ""
  )
  const cluster = useAppStore((state) => state.cluster)
  const [
    isLoading,
    loadingStatus,
    setIsLoading,
    setTxHistory,
    setLoadingStatus,
  ] = useAppStore((state) => [
    state.isLoading,
    state.loadingStatus,
    state.setIsLoading,
    state.setTxHistory,
    state.setLoadingStatus,
  ])

  useEffect(() => {
    if (!publicKey) return

    setWalletInput(publicKey.toString())
    getTransactionHistory(publicKey.toString())

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (walletInput.length < 42) return

    try {
      const publicKey = new PublicKey(walletInput)
      if (PublicKey.isOnCurve(publicKey)) {
        getTransactionHistory(publicKey.toString())
      }
    } catch (error) {}
  }

  const getTransactionHistory = async (address: string) => {
    let currentIndex = 0

    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % LOADING_STATUS.length
      setLoadingStatus(LOADING_STATUS[currentIndex])
    }, 2000)

    try {
      setIsLoading(true)
      setLoadingStatus("")
      setTxHistory(undefined)

      const response = await fetch(
        `https://api.shyft.to/sol/v1/transaction/history?network=${cluster}&tx_num=10&account=${address}`,
        {
          method: "GET",
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_SHYFT_API_KEY as string,
          },
        }
      )

      const data: ShyftTxParsedHistoryResponse = await response.json()
      data.result.length === 0 &&
        setLoadingStatus(
          "Hey welcome 👋 Seem like your wallet is brand-new. No transaction found!"
        )

      setTxHistory(data.result)
    } catch (error) {
      console.error(error)
    } finally {
      clearInterval(intervalId)
    }
  }

  return (
    <div className="relative">
      <form action="" onSubmit={handleSubmit} className="mb-3">
        <div className="inset-0 m-auto flex min-w-[400px] items-center space-x-2">
          <Input
            ref={input}
            className=" text-md"
            type="text"
            placeholder="Ex: Hb2HDX6tnRfw5j442npy58Z2GBzJA58Nz7ipouWGT63p"
            value={walletInput}
            onChange={(e) => setWalletInput(e.target.value)}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {walletInput.length >= 44 && (
                  <Button
                    disabled={Boolean(walletInput.length < 44) || isLoading}
                    type="submit"
                  >
                    {isLoading ? (
                      <Loader2 size={18} className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight size={18} />
                    )}
                  </Button>
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>View Transaction history</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <AnimatePresence>
          {loadingStatus && (
            <motion.div
              initial="normal"
              variants={variants}
              exit="normal"
              animate={loadingStatus ? "down" : "normal"}
            >
              <Label className="absolute inset-0 z-0 ml-2 flex items-center gap-1 text-sm text-muted-foreground">
                {loadingStatus}
              </Label>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  )
}
