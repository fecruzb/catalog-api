const { db } = require("./")

db.sync({ force: true })
