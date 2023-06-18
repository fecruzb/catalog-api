const gpt = require("../library/gpt")
const file = require("../library/file")

const generator = {
  cover: async (book, dir = "book/") => {
    if (!file.imageExists(book.title, dir)) {
      const cover = await gpt.image(`${book.title}, book cover art`)
      await file.saveImage(cover, book.title, dir)
    }
  },
  resume: async (book) => {
    return await gpt.chat(`short resume about the book ${book.title}`)
  },
}

const generate = async (book) => {
  await generator.cover(book)

  const changes = {
    slug: file.slugify(book.title),
    resume: await generator.resume(book),
  }

  return await book.update(changes)
}

module.exports = {
  generate,
}
