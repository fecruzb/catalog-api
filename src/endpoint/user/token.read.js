const { InternalServerError } = require("restify-errors")

module.exports = async (req, res) => {
  try {
    const user = req.user
    res.send(200, user)
  } catch (error) {
    throw new InternalServerError(error.message)
  }
}
