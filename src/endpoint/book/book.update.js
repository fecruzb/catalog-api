const Book = require("../../module/book")
const { InternalServerError } = require("restify-errors")

module.exports = async (req, res) => {
  const { title, year, ISBN, author_id } = req.body
  try {
    const book = await Book.updateById(req.params.id, { title, year, ISBN, author_id })
    res.send(200, book)
  } catch (error) {
    throw new InternalServerError(error.message)
  }
}
