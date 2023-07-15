const Book = require("../module/book")

module.exports = async (req, res) => {
  try {
    const books = await Book.list()
    res.send(books)
  } catch (error) {
    res.send(500, error)
  }
}
