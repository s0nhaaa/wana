import { formatAddress } from "./format-address"

export const parseProtocol = (protocol: { name: string; address: string }) => {
  if (!protocol.name) return formatAddress(protocol.address)

  const parts = protocol.name.split("_")
  const firstWord = parts[0]
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())

  if (parts.length === 1) {
    return firstWord
  }

  const remainingWords = parts
    .slice(1)
    .map((word) => word.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()))

  return `${firstWord} ${remainingWords.join(" ")}`
}
