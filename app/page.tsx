"use client"

import { useEffect, useMemo, useState } from "react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import {
  BackpackWalletAdapter,
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"

import HistoryList from "@/components/history-list"
import SiteHeader from "@/components/site-header"
import { WalletInput } from "@/components/wallet-input"

require("@solana/wallet-adapter-react-ui/styles.css")

export default function IndexPage() {
  const network = WalletAdapterNetwork.Devnet

  const endpoint = useMemo(() => clusterApiUrl(network), [network])
  const [domLoaded, setDomLoaded] = useState(false)

  useEffect(() => {
    setDomLoaded(true)
  }, [])

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new BackpackWalletAdapter()],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  )

  return (
    <>
      {domLoaded && (
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <SiteHeader />
              <div className="relative h-screen w-screen ">
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-[700px] w-[50vw]">
                    <WalletInput />
                    <HistoryList />
                  </div>
                </div>
              </div>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      )}
    </>
  )
}
