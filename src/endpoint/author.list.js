const { Book, Author } = require("../db")

module.exports = async (req, res) => {
  try {
    const authors = await Author.findAll({
      include: [
        {
          model: Book,
          as: "books",
          attributes: ["id", "title"],
        },
      ],
    })
    res.send(authors)
  } catch (error) {
    res.send(500, error)
  }
}
