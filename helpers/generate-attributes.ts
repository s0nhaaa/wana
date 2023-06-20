import moment from "moment"

import { parseProtocol } from "./parser"

export const generateAttributes = (
  protocol: {
    address: string
    name: string
  },
  timestamp: string,
  type: string,
  status: string,
  actions: number
) => `[ 
  {\"trait_type\": \"by\", \"value\": \"${parseProtocol(protocol)}\"},
  {\"trait_type\": \"date\", \"value\": \"${moment(timestamp).format(
    "DD/MM/YYYY"
  )}\"},
  {\"trait_type\": \"type\", \"value\": \"${type}\"},
  {\"trait_type\": \"status\", \"value\": \"${status}\"},
  {\"trait_type\": \"actions\", \"value\": \"${actions}\"}
]`
