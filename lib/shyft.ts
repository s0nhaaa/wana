import { Buffer } from "buffer"
import { AnchorWallet } from "@solana/wallet-adapter-react"
import { Connection, Transaction } from "@solana/web3.js"

export async function confirmTransaction(
  connection: Connection,
  encodedTransaction: string,
  anchorWallet: AnchorWallet
) {
  console.log(encodedTransaction)
  const recoveredTransaction = Transaction.from(
    Buffer.from(encodedTransaction, "base64")
  )
  const signedTx = await anchorWallet.signTransaction(recoveredTransaction)
  const confirmTransaction = await connection.sendRawTransaction(
    signedTx.serialize()
  )
  return confirmTransaction
}
