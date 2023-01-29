const Sequelize = require("sequelize")

module.exports = (db) => {
  const Author = db.define("author", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    country: Sequelize.STRING,
  })

  return Author
}
