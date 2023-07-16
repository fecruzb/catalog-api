const Sequelize = require("sequelize")
const crypt = require("../library/crypt")

module.exports = (db) => {
  const User = db.define("user", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: Sequelize.TEXT,
    token_exp: Sequelize.DATE,
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
  })

  User.beforeCreate(async (user) => {
    user.password = await crypt.hash(user.password, 10)
  })

  return User
}
