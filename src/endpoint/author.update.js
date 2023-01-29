const { Author } = require("../db")

module.exports = async (req, res) => {
  const { name, country } = req.body
  try {
    const author = await Author.findByPk(req.params.id)
    if (!author) {
      res.send(404, "Author not found")
    } else {
      await author.update({ name, country })
      res.send(200, author)
    }
  } catch (error) {
    res.send(500, error)
  }
}
