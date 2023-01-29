const { Book, Author } = require("../db")

module.exports = async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [
        {
          model: Author,
          as: "author",
          attributes: ["id", "name"],
        },
      ],
    })
    res.send(books)
  } catch (error) {
    res.send(500, error)
  }
}
