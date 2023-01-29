const restify = require("restify")
const corsMiddleware = require("restify-cors-middleware")

const AuthorCreate = require("./endpoint/author.create")
const AuthorList = require("./endpoint/author.list")
const AuthorRead = require("./endpoint/author.read")
const AuthorDelete = require("./endpoint/author.delete")
const AuthorUpdate = require("./endpoint/author.update")
const BookCreate = require("./endpoint/book.create")
const BookList = require("./endpoint/book.list")
const BookRead = require("./endpoint/book.read")
const BookDelete = require("./endpoint/book.delete")
const BookUpdate = require("./endpoint/book.update")

const server = restify.createServer()

const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ["*"],
  allowHeaders: ["API-Token"],
  exposeHeaders: ["API-Token-Expiry"],
})

/* middleware */
server.pre(cors.preflight)
server.use(cors.actual)

/* author endpoints */
server.post("/authors", AuthorCreate)
server.get("/authors", AuthorList)
server.get("/authors/:id", AuthorRead)
server.del("/authors/:id", AuthorDelete)
server.patch("/authors/:id", AuthorUpdate)

/* books endpoints */
server.post("/books", BookCreate)
server.get("/books", BookList)
server.get("/books/:id", BookRead)
server.del("/books/:id", BookDelete)
server.patch("/books/:id", BookUpdate)

/* start server */
server.listen(4000, () => {
  console.log("Server listening on port 4000")
})
