"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { ArrowDown, ArrowRight, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function WalletInput() {
  const input = useRef<HTMLInputElement>(null)
  const { publicKey } = useWallet()
  const [walletInput, setWalletInput] = useState<string>(
    publicKey?.toString() || ""
  )
  const [isWalletAddress, setIsWalletAddress] = useState(false)
  const [isSubmited, setIsSubmited] = useState(false)

  useEffect(() => {
    publicKey && setWalletInput(publicKey.toString())
  }, [publicKey])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsSubmited(true)
    if (walletInput.length < 42) return

    try {
      const publicKey = new PublicKey(walletInput)
      setIsWalletAddress(PublicKey.isOnCurve(publicKey))
    } catch (error) {
      setIsWalletAddress(false)
    }
  }

  return (
    <>
      <form action="" onSubmit={handleSubmit} className="mb-3">
        <div className=" inset-0 m-auto flex min-w-[400px] items-center space-x-2">
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
                    disabled={Boolean(walletInput.length < 44)}
                    type="submit"
                  >
                    {isSubmited ? (
                      <RotateCcw size={18} />
                    ) : (
                      <ArrowRight size={18} />
                    )}
                  </Button>
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>{isSubmited ? "Fetch new Transaction" : "View history"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </form>
      <>
        {isSubmited && (
          <Label className=" ml-2 flex items-center gap-1 text-sm text-muted-foreground">
            {isWalletAddress
              ? "Here're your wallet histories"
              : "It's not a wallet address but you can check it in Shyft Translator"}
            <ArrowDown size={16} />
          </Label>
        )}
      </>
    </>
  )
}
