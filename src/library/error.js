const { InternalServerError, UnauthorizedError, NotFoundError } = require("restify-errors")

const endpoint = (code, message) => {
  if (code === 401) {
    throw new UnauthorizedError(message)
  }

  if (code === 404) {
    throw new NotFoundError(message)
  } else {
    throw new InternalServerError(message)
  }
}

module.exports = {
  endpoint,
}
