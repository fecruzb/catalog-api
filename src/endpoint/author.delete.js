const Author = require("../module/author")

module.exports = async (req, res) => {
  try {
    const author = await Author.deleteById(req.params.id)
    res.send(204, author)
  } catch (error) {
    res.send(500, error)
  }
}
