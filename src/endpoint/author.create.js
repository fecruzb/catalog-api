const { Author } = require("../db")

module.exports = async (req, res) => {
  const { name, country } = req.body
  try {
    const author = await Author.create({ name, country })
    res.send(201, author)
  } catch (error) {
    res.send(500, error)
  }
}
