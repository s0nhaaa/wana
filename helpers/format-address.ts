export const formatAddress = (address: string, length = 4) => {
  if (address.length <= 7) {
    return address
  }

  const first = address.slice(0, length)
  const last = address.slice(-length)

  return `${first}...${last}`
}
