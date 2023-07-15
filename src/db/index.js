const Sequelize = require("sequelize")

const db = new Sequelize("sqlite:./db.sqlite")

const AuthorModel = require("./Author.model")
const CharacterModel = require("./Character.model")
const BookModel = require("./Book.model")

const Author = AuthorModel(db)
const Book = BookModel(db)
const Character = CharacterModel(db)

Character.belongsTo(Book, { foreignKey: "book_id" })
Book.belongsTo(Author, { foreignKey: "author_id" })
Book.hasMany(Character, { as: "characters", foreignKey: "book_id" })
Author.hasMany(Book, { as: "books", foreignKey: "author_id" })

module.exports = { db, Author, Book, Character }
