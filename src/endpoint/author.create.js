const Author = require("../module/author")

module.exports = async (req, res) => {
  const { name } = req.body
  try {
    const author = await Author.spawnByName(name)
    res.send(201, author)
  } catch (error) {
    console.log(error)
    res.send(500, error)
  }
}
