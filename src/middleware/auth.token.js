const User = require("../module/user")
const { UnauthorizedError } = require("restify-errors")

module.exports = async (req) => {
  const token = req.header("Authorization")

  if (!token) {
    throw new UnauthorizedError("Token is empty")
  }

  try {
    const user = await User.readByToken(token)
    req.user = user.get({ plain: true })
  } catch (error) {
    throw new UnauthorizedError(error.message)
  }
}
