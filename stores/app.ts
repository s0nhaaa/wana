import { create } from "zustand"
import { persist } from "zustand/middleware"

import { Cluster } from "@/types/cluster"

interface AppState {
  cluster: Cluster
  setCluster: (cluster: Cluster) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      cluster: "mainnet-beta",
      setCluster: (cluster: Cluster) => set({ cluster }),
    }),
    {
      name: "app-storage",
    }
  )
)
