const Author = require("../../module/author")
const { NotFoundError } = require("restify-errors")

module.exports = async (req, res) => {
  try {
    const author = await Author.readById(req.params.id)
    res.send(author)
  } catch (error) {
    throw new NotFoundError(error.message)
  }
}
