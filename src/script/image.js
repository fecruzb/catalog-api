const { Author, Book } = require("../db")
const gpt = require("../library/gpt")
const file = require("../library/file")

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

    for (const author of data) {
      if (!file.imageExists(author.name, "author/superhero/")) {
        console.log("A+:", author.name)

        const photo = await gpt.image(`${author.name}, portrait, as superhero`)
        await file.saveImage(photo, author.name, "author/superhero/")
      } else {
        console.log("A:", author.name)
      }

      for (const book of author.books) {
        if (!file.imageExists(book.title, "book/")) {
          console.log("  B+:", book.title)
          const cover = await gpt.image(`${book.title}, book cover art`)
          await file.saveImage(cover, book.title, "book/")
        } else {
          console.log("  B:", book.title)
        }
      }
    }
  } catch (error) {
    console.error("An error occurred:", error)
  }
})()
