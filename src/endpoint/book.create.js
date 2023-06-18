const { Book } = require("../db")
const BookModule = require("../module/book")

module.exports = async (req, res) => {
  const { title, year, ISBN, author_id } = req.body
  try {
    const book = await Book.create({ title, year, ISBN, author_id })
    const updatedBook = await BookModule.generate(book)
    res.send(201, updatedBook)
  } catch (error) {
    res.send(500, error)
  }
}
