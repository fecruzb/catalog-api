const { Book } = require("../db")

module.exports = async (req, res) => {
  const { title, year, ISBN, author_id } = req.body
  try {
    const book = await Book.create({ title, year, ISBN, author_id })
    res.send(201, book)
  } catch (error) {
    res.send(500, error)
  }
}
