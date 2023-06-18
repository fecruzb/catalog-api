const Sequelize = require("sequelize")

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
  })
  return Book
}
