const { Book, Author } = require("../db")

module.exports = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [
        {
          model: Author,
          as: "author",
        },
      ],
    })
    if (!book) {
      res.send(404, "Book not found")
    } else {
      res.send(book)
    }
  } catch (error) {
    res.send(500, error)
  }
}
