const Author = require("../../module/author")
const { InternalServerError } = require("restify-errors")

module.exports = async (req, res) => {
  const { name } = req.body
  try {
    const author = await Author.spawnByName(name)
    res.send(201, author)
  } catch (error) {
    throw new InternalServerError(error.message)
  }
}
