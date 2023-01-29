const { Book } = require("../db")

module.exports = async (req, res) => {
  const { title, year, ISBN, author_id } = req.body
  try {
    const book = await Book.findByPk(req.params.id)
    if (!book) {
      res.send(404, "Book not found")
    } else {
      await book.update({ title, year, ISBN, author_id })
      res.send(200, book)
    }
  } catch (error) {
    res.send(500, error)
  }
}
