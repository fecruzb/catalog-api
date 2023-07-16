const Author = require("../../module/author")
const { InternalServerError } = require("restify-errors")

module.exports = async (req, res) => {
  const { name, country, biography } = req.body
  try {
    const author = await Author.updateById(req.params.id, { name, country, biography })
    res.send(200, author)
  } catch (error) {
    throw new InternalServerError(error.message)
  }
}
