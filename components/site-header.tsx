import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

import { Icons } from "./icons"
import { MenuNav } from "./menu-nav"
import { SelectCluster } from "./select-cluster"
import { ThemeToggle } from "./theme-toggle"

export default function SiteHeader() {
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
          <WalletMultiButton />
        </div>
      </div>
    </div>
  )
}
