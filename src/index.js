const restify = require("restify")
const corsMiddleware = require("restify-cors-middleware2")
const path = require("path")

const Authentication = require("./middleware/auth.token")

const AuthorCreate = require("./endpoint/author/author.create")
const AuthorList = require("./endpoint/author/author.list")
const AuthorRead = require("./endpoint/author/author.read")
const AuthorDelete = require("./endpoint/author/author.delete")
const AuthorUpdate = require("./endpoint/author/author.update")

const BookCreate = require("./endpoint/book/book.create")
const BookList = require("./endpoint/book/book.list")
const BookRead = require("./endpoint/book/book.read")
const BookDelete = require("./endpoint/book/book.delete")
const BookUpdate = require("./endpoint/book/book.update")

const UserLogin = require("./endpoint/user/user.login")
const UserRead = require("./endpoint/user/user.read")

const server = restify.createServer()

const cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ["*"],
  allowHeaders: ["Authorization"],
})

/* middleware */
server.pre(cors.preflight)
server.use(cors.actual)

server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())

/* static images */
server.get("/public/*", restify.plugins.serveStaticFiles(path.join(__dirname, "../public")))

/* endpoint for user login */
server.post("/user", UserLogin)
server.get("/user", Authentication, UserRead)

/* author endpoints */
server.post("/authors", Authentication, AuthorCreate)
server.get("/authors", Authentication, AuthorList)
server.get("/authors/:id", Authentication, AuthorRead)
server.del("/authors/:id", Authentication, AuthorDelete)
server.put("/authors/:id", Authentication, AuthorUpdate)

/* books endpoints */
server.post("/books", Authentication, BookCreate)
server.get("/books", Authentication, BookList)
server.get("/books/:id", Authentication, BookRead)
server.del("/books/:id", Authentication, BookDelete)
server.put("/books/:id", Authentication, BookUpdate)

/* start server */
server.listen(process.env.PORT || 4000, () => {
  console.log(`Server listening on port ${process.env.PORT || 4000}`)
})
