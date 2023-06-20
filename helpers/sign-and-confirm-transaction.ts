import { AnchorWallet } from "@solana/wallet-adapter-react"
import { Connection, SignatureResultCallback } from "@solana/web3.js"

import { confirmTransaction } from "@/lib/shyft"

export async function signAndConfirmTransaction(
  connection: Connection,
  transaction: string,
  anchorWallet: AnchorWallet,
  callback: SignatureResultCallback
) {
  const ret = await confirmTransaction(connection, transaction, anchorWallet)
  connection.onSignature(ret, callback, "finalized")
  return ret
}
