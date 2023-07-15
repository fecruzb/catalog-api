const Book = require("../module/book")

module.exports = async (req, res) => {
  const { title, author_id } = req.body
  try {
    const book = await Book.createByTitle(title, author_id)
    res.send(201, book)
  } catch (error) {
    res.send(500, error)
  }
}
