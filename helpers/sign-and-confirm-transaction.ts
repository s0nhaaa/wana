import { AnchorWallet } from "@solana/wallet-adapter-react"
import { Connection } from "@solana/web3.js"

import { confirmTransaction } from "@/lib/shyft"

export async function signAndConfirmTransaction(
  connection: Connection,
  transaction: string,
  anchorWallet: AnchorWallet,
  callback: () => void
) {
  const ret = await confirmTransaction(connection, transaction, anchorWallet)
  console.log(ret)
  connection.onSignature(ret, callback, "finalized")
  return ret
}
