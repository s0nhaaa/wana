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
    prompt: `I want you to act as a talent content creator working on solana blockchain industry. I will give you some informations about some transactions, You will give me a fun and playful title for each of them. The transaction informations are:  ${prompt} I want the result only the JSON format, the key is the transaction is and the value is the title. \nThe title must be follow the rules:\n- One line sentence less than 50 characters\n- Fun and playful`,
    temperature: 1,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })

  const data = (await response.json()) as ResponseTypes["createCompletion"]
  return NextResponse.json({ data: data.choices[0].text })
}
