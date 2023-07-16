const Author = require("../../module/author")
const { NotFoundError } = require("restify-errors")

module.exports = async (req, res) => {
  try {
    const author = await Author.deleteById(req.params.id)
    res.send(204, author)
  } catch (error) {
    throw new NotFoundError(error.message)
  }
}
