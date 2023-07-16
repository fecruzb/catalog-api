const Book = require("../../module/book")
const { NotFoundError } = require("restify-errors")

module.exports = async (req, res) => {
  try {
    const book = await Book.readById(req.params.id)
    if (!book) {
      res.send(404, "Book not found")
    } else {
      res.send(book)
    }
  } catch (error) {
    throw new NotFoundError(error.message)
  }
}
