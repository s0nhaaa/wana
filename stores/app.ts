import { create } from "zustand"
import { persist } from "zustand/middleware"

import { Cluster } from "@/types/cluster"
import { ShyftTxParsedHistoryResult } from "@/types/shyft-tx-parsed-history"

interface AppState {
  cluster: Cluster
  setCluster: (cluster: Cluster) => void

  txHistory: ShyftTxParsedHistoryResult[] | undefined
  setTxHistory: (txHistory: ShyftTxParsedHistoryResult[] | undefined) => void

  loadingStatus: string
  setLoadingStatus: (loadingStatus: string) => void

  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      cluster: "devnet",
      setCluster: (cluster: Cluster) => set({ cluster }),

      txHistory: undefined,
      setTxHistory: (txHistory: ShyftTxParsedHistoryResult[] | undefined) =>
        set({ txHistory }),

      loadingStatus:
        "GM! Paste wallet address to input field above 👆. Or connect wallet",
      setLoadingStatus: (loadingStatus: string) => set({ loadingStatus }),

      isLoading: false,
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
    }),
    {
      name: "app-storage",
      partialize: (state) => ({ cluster: state.cluster }),
    }
  )
)
