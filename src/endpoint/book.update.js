const { Book } = require("../db")
const gpt = require("../library/gpt")
const file = require("../library/file")

module.exports = async (req, res) => {
  const { title, year, ISBN, author_id } = req.body
  try {
    const book = await Book.findByPk(req.params.id)
    if (!book) {
      res.send(404, "Book not found")
    } else {
      await book.update({ title, year, ISBN, author_id })

      // generate book image if not exists
      if (!file.imageExists(book.title, "book/")) {
        const cover = await gpt.image(`${book.title}, book cover art`)
        await file.saveImage(cover, book.title, "book/")
      }

      res.send(200, book)
    }
  } catch (error) {
    res.send(500, error)
  }
}
