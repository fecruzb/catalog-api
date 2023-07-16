const Author = require("../../module/author")
const { InternalServerError } = require("restify-errors")

module.exports = async (req, res) => {
  try {
    const authors = await Author.list()
    res.send(authors)
  } catch (error) {
    throw new InternalServerError(error.message)
  }
}
