const { Book, Author } = require("../db")

module.exports = async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id, {
      include: [
        {
          model: Book,
          as: "books",
        },
      ],
    })
    if (!author) {
      res.send(404, "Author not found")
    } else {
      res.send(author)
    }
  } catch (error) {
    res.send(500, error)
  }
}
