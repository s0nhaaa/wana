import { useMemo, useRef, useState } from "react"
import Link from "next/link"
import { formatAddress } from "@/helpers/format-address"
import { generateAttributes } from "@/helpers/generate-attributes"
import { parseName, parseProtocol } from "@/helpers/parser"
import { signAndConfirmTransaction } from "@/helpers/sign-and-confirm-transaction"
import { useAppStore } from "@/stores/app"
import { ToastAction } from "@radix-ui/react-toast"
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react"
import { Context, SignatureResult } from "@solana/web3.js"
import clsx from "clsx"
import { motion } from "framer-motion"
import html2canvas from "html2canvas"
import { Glasses, Loader2, Puzzle, X } from "lucide-react"
import moment from "moment"

import { ShyftTxParsedHistoryResult } from "@/types/shyft-tx-parsed-history"
import {
  COLORS,
  GENERATIVE_COLORS,
  MINTING_STATUS,
  SHYFT_TRANSLATOR_ENDPOINT,
} from "@/config/constants"
import { randomElement } from "@/config/random-element"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

import GenerativeBackground from "./generative-background"
import TxStatus from "./tx-status"
import { Separator } from "./ui/separator"
import { useToast } from "./ui/use-toast"

interface TransationModalProps {
  id: string
  tx: ShyftTxParsedHistoryResult
  onClick: () => void
}

export default function TransactionModal({
  id,
  tx,
  onClick,
}: TransationModalProps) {
  const cluster = useAppStore((state) => state.cluster)
  const nftRef = useRef<HTMLDivElement | null>(null)
  const { publicKey } = useWallet()
  const anchorWallet = useAnchorWallet()
  const { connection } = useConnection()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const cellColors = useMemo(
    () => ({
      top: randomElement(COLORS),
      middle: randomElement(COLORS),
      bottom: randomElement(COLORS),
    }),
    []
  )
  const [mintingStatus, setMintingStatus] = useState("Please wait")

  const exportImageAndMint = async () => {
    if (!nftRef.current || !publicKey) return

    const canvas = await html2canvas(nftRef.current)
    canvas.toBlob(
      (blob) => {
        if (!blob) console.log("convert image fail")
        blob && mintNFT(blob, `${tx.generatedName}.png`, publicKey.toString())
      },
      "image/png",
      1
    )
  }

  const mintNFT = async (
    imageBlob: Blob,
    imageName: string,
    creator: string
  ) => {
    if (!anchorWallet) return

    const myHeaders = new Headers()
    myHeaders.append(
      "x-api-key",
      process.env.NEXT_PUBLIC_SHYFT_API_KEY as string
    )
    const formdata = new FormData()
    formdata.append("network", "devnet")
    formdata.append("wallet", creator)
    formdata.append(
      "name",
      tx.generatedName ? tx.generatedName : parseName(tx.type)
    )
    formdata.append("symbol", `WANA`)
    formdata.append(
      "description",
      "This transaction NFT generated and minted from Wana 👛!"
    )
    formdata.append(
      "attributes",
      generateAttributes(
        tx.protocol,
        tx.timestamp,
        tx.type,
        tx.status,
        tx.actions.length
      )
    )
    formdata.append(
      "external_url",
      `${SHYFT_TRANSLATOR_ENDPOINT}tx/${tx.signatures[0]}?cluster=${cluster}`
    )
    formdata.append("max_supply", "0")
    formdata.append("royalty", "100")
    formdata.append("file", imageBlob, imageName)
    formdata.append("nft_receiver", creator)

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    }

    let currentIndex = 0

    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % MINTING_STATUS.length
      setMintingStatus(MINTING_STATUS[currentIndex])
    }, 2000)

    try {
      setIsLoading(true)
      const response = await fetch(
        "https://api.shyft.to/sol/v1/nft/create_detach",
        requestOptions
      )
      const result = await response.json()
      console.log(result)
      setMintingStatus("Signing Transaction")
      clearInterval(intervalId)
      await signAndConfirmTransaction(
        connection,
        result.result.encoded_transaction,
        anchorWallet,
        (signatureResult: SignatureResult, context: Context) => {
          toast({
            title: "Bing ba da bum 🥁",
            description: `A new NFT just slid into your wallet`,
            action: <ToastAction altText="Continue">Continue</ToastAction>,
          })
          setIsLoading(false)
        }
      )
      setMintingStatus("Sending NFT to your wallet")
    } catch (error) {
      console.log("error", error)
      setIsLoading(false)
      clearInterval(intervalId)
    }
  }

  return (
    <div className="absolute inset-0 z-30 flex select-none items-center justify-center">
      <motion.div
        key="image"
        layoutId={id}
        className="relative flex h-fit w-[60vw] select-none rounded-lg bg-background"
      >
        <Button
          disabled={isLoading}
          className="absolute right-4 top-4 h-9 w-9 p-1"
          variant={"outline"}
          onClick={onClick}
        >
          <X size={16} />
        </Button>

        <Card className="flex w-[60%] flex-col justify-between border-none">
          <CardHeader>
            <CardTitle className="flex flex-col gap-2">
              <Label
                htmlFor="transaction-title"
                className=" text-muted-foreground "
              >
                Title is generated by GPT
              </Label>
              <p className="px-0 text-2xl">{tx.generatedName}</p>
            </CardTitle>
            <CardDescription className="flex flex-col gap-2">
              <div>
                Made by{" "}
                <Link
                  className="group relative text-primary hover:underline"
                  href={
                    new URL(
                      `address/${tx.protocol.address}?${
                        cluster !== "mainnet-beta" ? `cluster=${cluster}` : ""
                      }`,
                      SHYFT_TRANSLATOR_ENDPOINT
                    )
                  }
                  target="_blank"
                >
                  {parseProtocol(tx.protocol)}
                </Link>{" "}
                {moment(tx.timestamp).fromNow()}
              </div>
              <div className="flex gap-2">
                <TxStatus status={tx.status} />
              </div>
              <div className="mt-2 flex gap-2">
                Transaction finished with {tx.actions.length} action
                {tx.actions.length > 1 && "s"}:
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="-mt-4">
            <ScrollArea className="h-[300px] w-full">
              <div className="grid gap-3">
                {tx.actions.map((action, index) => (
                  <div
                    key={index}
                    className=" flex w-full flex-col space-x-4 rounded-md border p-4"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="flex items-center gap-2 text-sm font-medium leading-none">
                        <div className="rounded-lg bg-[#3abff8] p-2 text-[#002b3d]">
                          #{index + 1}
                        </div>
                        {parseName(action.type)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className=" flex-row-reverse gap-2">
            <Link
              href={
                new URL(
                  `address/${tx.protocol.address}?${
                    cluster !== "mainnet-beta" ? `cluster=${cluster}` : ""
                  }`,
                  SHYFT_TRANSLATOR_ENDPOINT
                )
              }
              target="_blank"
            >
              <Button variant={"outline"}>
                <Glasses className="mr-2 h-4 w-4" /> View on Shyft Transalator
              </Button>
            </Link>
          </CardFooter>
        </Card>
        <Separator orientation="vertical" />
        <Card className="flex w-[40%] flex-col justify-between border-none">
          <CardHeader>
            <CardTitle className="flex flex-col gap-2">
              <Label className="text-muted-foreground ">
                Generative transaction NFT
              </Label>
            </CardTitle>
          </CardHeader>
          <CardContent className="-mt-2">
            <div
              className="relative w-full overflow-hidden rounded-lg bg-transparent"
              ref={nftRef}
            >
              <div className="aspect-[1/1] w-full overflow-hidden bg-transparent">
                <GenerativeBackground
                  name={tx.signatures[0]}
                  colors={GENERATIVE_COLORS}
                  size={600}
                  title="sh"
                  square={true}
                />
              </div>
              <p className="absolute left-4 top-4 text-sm font-medium text-[#ffffff]">
                WANA
              </p>
              <p className="absolute right-4 top-4 text-sm font-medium text-[#ffffff]">
                SHYFT
              </p>
              <p className="absolute left-[18px] top-[75px] w-[80%] text-[36px] font-bold text-[#ffffff]">
                {tx.generatedName ? tx.generatedName : parseName(tx.type)}
              </p>
              <p className="absolute bottom-6 right-6 text-[36px] font-bold text-[#ffffff]">
                #{formatAddress(tx.signatures[0])}
              </p>
              <div className="absolute bottom-7 left-5 flex flex-col gap-2">
                <div
                  className={clsx(`h-4 w-4 rounded-sm`)}
                  style={{ backgroundColor: cellColors.top }}
                ></div>
                <div
                  className={clsx(`h-4 w-4 rounded-sm`)}
                  style={{ backgroundColor: cellColors.middle }}
                ></div>
                <div
                  className={clsx(`h-4 w-4 rounded-sm`)}
                  style={{ backgroundColor: cellColors.bottom }}
                ></div>
              </div>
            </div>
            <Label className="italic text-muted-foreground">
              * NFT minted will be live on Solana devnet
            </Label>
          </CardContent>
          <CardFooter className=" flex-row-reverse gap-2">
            <Button onClick={exportImageAndMint} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mintingStatus}
                </>
              ) : (
                <>
                  <Puzzle className="mr-2 h-4 w-4" /> Mint transaction as NFT
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
