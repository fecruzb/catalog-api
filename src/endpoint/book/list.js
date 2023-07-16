const Book = require("../../module/book")
const { InternalServerError } = require("restify-errors")

module.exports = async (req, res) => {
  try {
    const books = await Book.list()
    res.send(books)
  } catch (error) {
    console.log(error)
    throw new InternalServerError(error.message)
  }
}
