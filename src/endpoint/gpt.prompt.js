const gpt = require("../library/gpt")

module.exports = async (req, res) => {
  const { prompt } = req.query
  try {
    const response = await gpt.chat(prompt)
    res.send(200, response)
  } catch (error) {
    res.send(500, error)
  }
}
