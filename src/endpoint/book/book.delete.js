const Book = require("../../module/book")
const { NotFoundError } = require("restify-errors")

module.exports = async (req, res) => {
  try {
    const book = await Book.deleteById(req.params.id)
    res.send(204, book)
  } catch (error) {
    throw new NotFoundError(error.message)
  }
}
