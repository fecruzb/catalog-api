const restify = require("restify")
const corsMiddleware = require("restify-cors-middleware2")
const path = require("path")

const AuthorCreateEndpoint = require("./endpoint/author/create")
const AuthorListEndpoint = require("./endpoint/author/list")
const AuthorReadEndpoint = require("./endpoint/author/read")
const AuthorDeleteEndpoint = require("./endpoint/author/delete")
const AuthorUpdateEndpoint = require("./endpoint/author/update")

const BookCreateEndpoint = require("./endpoint/book/create")
const BookListEndpoint = require("./endpoint/book/list")
const BookReadEndpoint = require("./endpoint/book/read")
const BookDeleteEndpoint = require("./endpoint/book/delete")
const BookUpdateEndpoint = require("./endpoint/book/update")

const UserTokenCreateEndpoint = require("./endpoint/user/token.create")
const UserTokenReadEndpoint = require("./endpoint/user/token.read")
const UserTokenValidateMiddleware = require("./middleware/token.validate")

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
server.post("/user", UserTokenCreateEndpoint)

/* endpoint for retrieve logged user (private) */
server.get("/user", UserTokenValidateMiddleware, UserTokenReadEndpoint)

/* author endpoints (private) */
server.post("/authors", UserTokenValidateMiddleware, AuthorCreateEndpoint)
server.get("/authors", UserTokenValidateMiddleware, AuthorListEndpoint)
server.get("/authors/:id", UserTokenValidateMiddleware, AuthorReadEndpoint)
server.del("/authors/:id", UserTokenValidateMiddleware, AuthorDeleteEndpoint)
server.put("/authors/:id", UserTokenValidateMiddleware, AuthorUpdateEndpoint)

/* books endpoints (private) */
server.post("/books", UserTokenValidateMiddleware, BookCreateEndpoint)
server.get("/books", UserTokenValidateMiddleware, BookListEndpoint)
server.get("/books/:id", UserTokenValidateMiddleware, BookReadEndpoint)
server.del("/books/:id", UserTokenValidateMiddleware, BookDeleteEndpoint)
server.put("/books/:id", UserTokenValidateMiddleware, BookUpdateEndpoint)

/* start server */
server.listen(process.env.PORT || 4000, () => {
  console.log(`Server listening on port ${process.env.PORT || 4000}`)
})
