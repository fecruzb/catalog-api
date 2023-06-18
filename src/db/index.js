const Sequelize = require("sequelize")

const db = new Sequelize("sqlite:./src/db/db.sqlite")

const AuthorModel = require("../model/Author")
const BookModel = require("../model/Book")

const Author = AuthorModel(db)
const Book = BookModel(db)

Book.belongsTo(Author, { foreignKey: "author_id" })
Author.hasMany(Book, { as: "books", foreignKey: "author_id" })

module.exports = { db, Author, Book }
