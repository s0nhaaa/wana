import { Input } from "@/components/ui/input"

export function WalletInput() {
  return (
    <div className=" inset-0 m-auto min-w-[400px] ">
      <Input
        className=" text-md"
        type="text"
        placeholder="Ex: Hb2HDX6tnRfw5j442npy58Z2GBzJA58Nz7ipouWGT63p"
      />
    </div>
  )
}
