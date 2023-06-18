const Sequelize = require("sequelize")

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
  })

  return Author
}
