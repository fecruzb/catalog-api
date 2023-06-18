const { Author } = require("../db")
const AuthorModule = require("../module/author")

module.exports = async (req, res) => {
  const { name, country } = req.body
  try {
    const author = await Author.create({ name, country })
    const updatedAuthor = await AuthorModule.generate(author)
    res.send(201, updatedAuthor)
  } catch (error) {
    console.log(error)
    res.send(500, error)
  }
}
