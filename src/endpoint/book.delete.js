const { Book } = require("../db")

module.exports = async (req, res) => {
  try {
    const author = await Book.findByPk(req.params.id)
    if (!author) {
      res.send(404, "Author not found")
    } else {
      await author.destroy()
      res.send(204)
    }
  } catch (error) {
    res.send(500, error)
  }
}
