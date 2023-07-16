const Sequelize = require("sequelize")
const crypt = require("../library/crypt")

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

  const updateSlug = async (character) => {
    character.slug = await crypt.slugify(character.name)
  }

  Character.beforeCreate(updateSlug)
  Character.beforeUpdate(updateSlug)

  return Character
}
