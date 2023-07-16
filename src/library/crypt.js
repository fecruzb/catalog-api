const bcrypt = require("bcrypt")
const { kebabCase } = require("lodash")

const hash = async (data) => await bcrypt.hash(data, 10)
const compare = async (data, hashed) => await bcrypt.compare(data, hashed)

const slugify = (data) => kebabCase(data)

module.exports = {
  compare,
  hash,
  slugify,
}
