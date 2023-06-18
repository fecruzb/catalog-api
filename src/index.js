const restify = require("restify")
const corsMiddleware = require("restify-cors-middleware2")
const path = require("path")

const GPTImage = require("./endpoint/gpt.image")
const GPTPrompt = require("./endpoint/gpt.prompt")

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

server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())

/* static images */
server.get("/public/*", restify.plugins.serveStaticFiles(path.join(__dirname, "../public")))

/* gpt endpoints */
server.get("/gpt/image", GPTImage)
server.get("/gpt/prompt", GPTPrompt)

/* author endpoints */
server.post("/authors", AuthorCreate)
server.get("/authors", AuthorList)
server.get("/authors/:id", AuthorRead)
server.del("/authors/:id", AuthorDelete)
server.put("/authors/:id", AuthorUpdate)

/* books endpoints */
server.post("/books", BookCreate)
server.get("/books", BookList)
server.get("/books/:id", BookRead)
server.del("/books/:id", BookDelete)
server.put("/books/:id", BookUpdate)

/* start server */
server.listen(4000, () => {
  console.log("Server listening on port 4000")
})
