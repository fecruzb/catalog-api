const { db } = require("../db")

db.sync({ force: true })
