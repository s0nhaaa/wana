import { NextResponse } from "next/server"
import { Configuration, OpenAIApi, ResponseTypes } from "openai-edge"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export const runtime = "edge"

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `You are a talent content creator working on solana blockchain industry. You will give me a fun and playful title for each transaction. Title length less than 25 characters. Do not include '\'\'\. Must be Json. \nExample title for a transaction:\nTransaction:\n1.1. Transaction Id is 5WYTQhAp\n1.2. Transaction type is SOL_TRANSFER\n\nThe JSON Result:\n[{"5WYTQhAp": "The Great Solana Shuffle: Transfer Complete!"}]\n\nThe list of transaction:  ${prompt} \n The result title (no '\'\'\ and json format):`,
    temperature: 1,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })

  const data = (await response.json()) as ResponseTypes["createCompletion"]
  console.log(data)
  return NextResponse.json({ data: data.choices[0].text })
}
