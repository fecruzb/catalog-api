const Book = require("../module/book")

module.exports = async (req, res) => {
  try {
    const book = await Book.readById(req.params.id)
    if (!book) {
      res.send(404, "Book not found")
    } else {
      res.send(book)
    }
  } catch (error) {
    res.send(500, error)
  }
}
