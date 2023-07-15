const Book = require("../module/book")

module.exports = async (req, res) => {
  try {
    const book = await Book.deleteById(req.params.id)
    res.send(204, book)
  } catch (error) {
    res.send(500, error)
  }
}
