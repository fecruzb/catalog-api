const Sequelize = require("sequelize")
const crypt = require("../library/crypt")

module.exports = (db) => {
  const Author = db.define("author", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    slug: Sequelize.STRING,
    country: Sequelize.STRING,
    biography: Sequelize.TEXT,
    photo_description: Sequelize.TEXT,
  })

  const updateSlug = async (author) => {
    author.slug = await crypt.slugify(author.name)
  }

  Author.beforeCreate(updateSlug)
  Author.beforeUpdate(updateSlug)

  return Author
}
