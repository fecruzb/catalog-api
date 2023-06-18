require("dotenv").config()

const { Configuration, OpenAIApi } = require("openai")

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

const image = async (prompt, format = "b64_json") => {
  const response = await openai.createImage({
    prompt,
    n: 1,
    size: "256x256",
    response_format: format,
  })
  return response?.data?.data[0].b64_json
}

const chat = async (content) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content,
      },
    ],
  })
  return response?.data?.choices?.[0]?.message?.content
}

const code = async (prompt) => {
  const response = await openai.createCompletion({
    model: "code-davinci-002",
    prompt,
  })
  return response?.data?.choices?.[0]?.text
}

module.exports = {
  chat,
  code,
  image,
}
