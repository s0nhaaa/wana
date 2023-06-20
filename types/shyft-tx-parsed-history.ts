export type ShyftTxParsedHistoryResponse = {
  success: boolean
  message: string
  result: {
    timestamp: string
    fee: number
    fee_payer: string
    actions: {
      info: any
      source_protocol: string
      type: string
    }[]
    status: "Success" | "Fail"
    protocol: {
      address: string
      name: string
    }
    type: string
    signers: string[]
    signatures: string[]
    generatedName?: string
  }
}

export type ShyftTxParsedHistory = ShyftTxParsedHistoryResponse["result"]
