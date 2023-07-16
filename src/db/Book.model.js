const Sequelize = require("sequelize")
const crypt = require("../library/crypt")

module.exports = (db) => {
  const Book = db.define("book", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    slug: Sequelize.STRING,
    title: Sequelize.STRING,
    year: Sequelize.INTEGER,
    ISBN: Sequelize.STRING,
    resume: Sequelize.TEXT,
    cover_description: Sequelize.TEXT,
  })

  const updateSlug = async (book) => {
    book.slug = await crypt.slugify(book.title)
  }

  Book.beforeCreate(updateSlug)
  Book.beforeUpdate(updateSlug)

  return Book
}
