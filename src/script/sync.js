const { db } = require("../db")
const User = require("../module/user")

db.sync({ force: true })
  .then(() => {
    // Create a user
    const userData = {
      name: "Felipe Cruz",
      email: "fecruzb@gmail.com",
      password: "123",
    }

    return User.create(userData)
  })
  .catch((error) => {
    // Error occurred during syncing or user creation
    console.error("Error:", error)
  })
