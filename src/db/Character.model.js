const Sequelize = require("sequelize")

module.exports = (db) => {
  const Character = db.define("character", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    slug: Sequelize.STRING,
    name: Sequelize.STRING,
    role: Sequelize.STRING,
    resume: Sequelize.TEXT,
    description: Sequelize.TEXT,
    photo_description: Sequelize.TEXT,
  })
  return Character
}
