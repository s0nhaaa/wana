import { create } from "zustand"
import { persist } from "zustand/middleware"

import { Cluster } from "@/types/cluster"
import { ShyftTxParsedHistory } from "@/types/shyft-tx-parsed-history"

interface AppState {
  cluster: Cluster
  setCluster: (cluster: Cluster) => void

  txHistory: ShyftTxParsedHistory[] | undefined
  setTxHistory: (txHistory: ShyftTxParsedHistory[]) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      cluster: "mainnet-beta",
      setCluster: (cluster: Cluster) => set({ cluster }),

      txHistory: undefined,
      setTxHistory: (txHistory: ShyftTxParsedHistory[]) => set({ txHistory }),
    }),
    {
      name: "app-storage",
    }
  )
)
