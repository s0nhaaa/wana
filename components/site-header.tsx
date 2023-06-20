import { formatAddress } from "@/helpers/format-address"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { LogOut } from "lucide-react"

import { Icons } from "./icons"
import { MenuNav } from "./menu-nav"
import { SelectCluster } from "./select-cluster"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"

export default function SiteHeader() {
  const { setVisible } = useWalletModal()
  const { publicKey, connected, disconnect } = useWallet()

  return (
    <div className="fixed z-10 w-full select-auto">
      <div className="flex h-24 items-center justify-center gap-4 px-10">
        <div className="flex items-center justify-center gap-3">
          <Icons.logo width={24} height={24} />
          <p className="select-none text-lg font-semibold">Wana</p>
        </div>
        <MenuNav />
        <div className=" flex items-center gap-2">
          <ThemeToggle />
          <SelectCluster />
          <Button onClick={() => setVisible(true)}>
            {publicKey ? formatAddress(publicKey.toString()) : "Connect 👛"}
          </Button>
          {connected && (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger>
                  <Button className="p-3" onClick={disconnect}>
                    <LogOut size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Disconnect</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  )
}
