import { formatAddress } from "./format-address"

export const parseProtocol = (protocol: { name: string; address: string }) => {
  if (!protocol.name) return formatAddress(protocol.address)

  return parseName(protocol.name)
}

export function parseName(name: string) {
  try {
    if (name.includes("_")) {
      var words = name.split("_")
      var capitalizedText = ""
      for (let index = 0; index < words.length; index++) {
        capitalizedText += capitalizeText(words[index]) + " "
      }
      return capitalizedText
    } else return capitalizeText(name)
  } catch (error) {
    return name
  }
}

function capitalizeText(text: string) {
  try {
    if (text === "NFT") return "NFT"
    else if (text === "SOL") return "SOL"
    else return text[0].toUpperCase() + text.substring(1).toLowerCase()
  } catch (error) {
    return text
  }
}
