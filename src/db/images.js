const { Author, Book } = require(".")
const gpt = require("../../gpt/api")

const fs = require("fs")
const path = require("path")
const { kebabCase } = require("lodash")

// ANSI escape sequences for color
const colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  gray: "\x1b[90m",
}

function convertBase64ToPNG(content, filePath) {
  const data = content.replace(/^data:image\/\w+;base64,/, "")
  const buffer = Buffer.from(data, "base64")
  fs.writeFileSync(filePath, buffer)
}

function createFolderIfNotExists(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
  }
}

;(async () => {
  try {
    let data = await Author.findAll({
      include: [
        {
          model: Book,
          as: "books",
        },
      ],
    })

    const totalAuthors = data.length
    let authorCounter = 0

    // for each author
    for (const author of data) {
      authorCounter++
      const authorFileName = kebabCase(author.name)
      const authorFolderPath = path.join(__dirname, "../../public", "author", "line")
      const authorFilePath = path.join(authorFolderPath, `${authorFileName}.png`)

      // Skip generation if the file already exists
      if (!fs.existsSync(authorFilePath)) {
        createFolderIfNotExists(authorFolderPath)
        const authorImage = await gpt.image(`${author.name}, portrait, art line style`)
        console.log(
          `\nAuthor ${colors.yellow}${authorCounter}/${totalAuthors}:${colors.reset} ${colors.green}${author.name}${colors.reset}`,
        )
        console.log(colors.gray + "-- Generating author image..." + colors.reset)
        convertBase64ToPNG(authorImage, authorFilePath)
        console.log(colors.green + "-- Author image generated." + colors.reset)
      } else {
        console.log(
          `\nAuthor ${colors.yellow}${authorCounter}/${totalAuthors}:${colors.reset} ${colors.green}${author.name}${colors.reset}`,
        )
        console.log(
          colors.gray +
            "-- Skipping generation of author image. File already exists." +
            colors.reset,
        )
      }

      let bookCounter = 0
      const totalBooks = author.books.length

      // for each book inside author.books
      for (const book of author.books) {
        bookCounter++
        const bookFileName = kebabCase(book.title)
        const bookFolderPath = path.join(__dirname, "../../public", "book")
        const bookFilePath = path.join(bookFolderPath, `${bookFileName}.png`)

        // Skip generation if the file already exists
        if (!fs.existsSync(bookFilePath)) {
          createFolderIfNotExists(bookFolderPath)
          const bookImage = await gpt.image(`${book.title}, book cover art`)
          console.log(
            `\n  Book ${colors.yellow}${bookCounter}/${totalBooks}:${colors.reset} ${colors.green}${book.title}${colors.reset}`,
          )
          console.log(colors.gray + "  -- Generating book image..." + colors.reset)
          convertBase64ToPNG(bookImage, bookFilePath)
          console.log(colors.green + "  -- Book image generated." + colors.reset)
        } else {
          console.log(
            `\n  Book ${colors.yellow}${bookCounter}/${totalBooks}:${colors.reset} ${colors.green}${book.title}${colors.reset}`,
          )
          console.log(
            colors.gray +
              "  -- Skipping generation of book image. File already exists." +
              colors.reset,
          )
        }
      }
    }

    console.log(data)
  } catch (error) {
    console.error("An error occurred:", error)
  }
})()
