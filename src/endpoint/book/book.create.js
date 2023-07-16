const Book = require("../../module/book")
const { InternalServerError } = require("restify-errors")

module.exports = async (req, res) => {
  const { title, author_id } = req.body
  try {
    const book = await Book.spawnByTitle(title, author_id)
    res.send(201, book)
  } catch (error) {
    throw new InternalServerError(error.message)
  }
}
