const Author = require("../module/author")

module.exports = async (req, res) => {
  try {
    const author = await Author.readById(req.params.id)
    res.send(author)
  } catch (error) {
    res.send(500, error)
  }
}
