const restify = require("restify")
const corsMiddleware = require("restify-cors-middleware2")
const path = require("path")

const AuthToken = require("./middleware/auth.token")

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

/* static images (public) */
server.get("/public/*", restify.plugins.serveStaticFiles(path.join(__dirname, "../public")))

/* endpoint to perform login (public) */
server.post("/user", UserLogin)

/* endpoint for retrieve logged user (private) */
server.get("/user", AuthToken, UserRead)

/* author endpoints (private) */
server.post("/authors", AuthToken, AuthorCreate)
server.get("/authors", AuthToken, AuthorList)
server.get("/authors/:id", AuthToken, AuthorRead)
server.del("/authors/:id", AuthToken, AuthorDelete)
server.put("/authors/:id", AuthToken, AuthorUpdate)

/* books endpoints (private) */
server.post("/books", AuthToken, BookCreate)
server.get("/books", AuthToken, BookList)
server.get("/books/:id", AuthToken, BookRead)
server.del("/books/:id", AuthToken, BookDelete)
server.put("/books/:id", AuthToken, BookUpdate)

/* start server */
server.listen(process.env.PORT || 4000, () => {
  console.log(`Server listening on port ${process.env.PORT || 4000}`)
})
