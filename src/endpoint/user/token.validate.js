const User = require("../../module/user")
const { UnauthorizedError } = require("restify-errors")

module.exports = async (req) => {
  try {
    const token = req.header("Authorization")

    if (!token) {
      throw Error("Token is empty")
    }

    const user = await User.readByToken(token)
    req.user = user.get({ plain: true })
  } catch (error) {
    throw new UnauthorizedError(error.message)
  }
}
