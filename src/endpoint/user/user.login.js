const User = require("../../module/user")
const { UnauthorizedError } = require("restify-errors")

module.exports = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.checkCredentials(email, password)
    const token = await User.login(user)
    res.send(200, token)
  } catch (error) {
    throw new UnauthorizedError(error.message)
  }
}
