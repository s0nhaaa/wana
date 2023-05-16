"use client"

import { useAppStore } from "@/stores/app"
import { ToastAction } from "@radix-ui/react-toast"

import { Cluster } from "@/types/cluster"
import { clusterConfig } from "@/config/cluster"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export function SelectCluster() {
  const setCluster = useAppStore((state) => state.setCluster)
  const { toast } = useToast()

  const changeCluster = (cluster: Cluster) => {
    setCluster(cluster)
    toast({
      title: "Switch cluster",
      description: `Successfully switch to ${cluster}`,
      action: (
        <ToastAction altText="Goto schedule to undo">Continue</ToastAction>
      ),
    })
  }

  return (
    <Select
      defaultValue="mainnet-beta"
      onValueChange={(e: Cluster) => changeCluster(e)}
    >
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Cluster" />
      </SelectTrigger>
      <SelectContent>
        {clusterConfig.map((cluster) => (
          <SelectItem key={cluster.id} value={cluster.value}>
            {cluster.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
