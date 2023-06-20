import { create } from "zustand"
import { persist } from "zustand/middleware"

import { Cluster } from "@/types/cluster"
import { ShyftTxParsedHistoryResult } from "@/types/shyft-tx-parsed-history"

interface AppState {
  cluster: Cluster
  setCluster: (cluster: Cluster) => void

  txHistory: ShyftTxParsedHistoryResult[] | undefined
  setTxHistory: (txHistory: ShyftTxParsedHistoryResult[]) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      cluster: "mainnet-beta",
      setCluster: (cluster: Cluster) => set({ cluster }),

      txHistory: undefined,
      setTxHistory: (txHistory: ShyftTxParsedHistoryResult[]) =>
        set({ txHistory }),
    }),
    {
      name: "app-storage",
    }
  )
)
