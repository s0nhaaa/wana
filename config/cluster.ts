import { Cluster } from "@/types/cluster"

export type ClusterConfig = typeof clusterConfig

export const clusterConfig = [
  {
    id: "mainnet-beta",
    value: "mainnet-beta" as Cluster,
    name: "Mainnet Beta",
  },
  {
    id: "devnet",
    value: "devnet" as Cluster,
    name: "Devnet",
  },
  {
    id: "testnet",
    value: "testnet" as Cluster,
    name: "Testnet",
  },
]
