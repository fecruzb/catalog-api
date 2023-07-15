const Author = require("../module/author")

module.exports = async (req, res) => {
  try {
    const authors = await Author.list()
    res.send(authors)
  } catch (error) {
    res.send(500, error)
  }
}
