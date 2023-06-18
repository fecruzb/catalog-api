const gpt = require("../library/gpt")
const file = require("../library/file")
const { Book } = require("../db")

const generator = {
  photo: async (name, dir = "author/") => {
    if (!file.imageExists(name, dir)) {
      const photo = await gpt.image(`${name}, realistic photo portrait`)
      await file.saveImage(photo, name, dir)
    }
  },
  biography: async (author) => {
    return await gpt.chat(`short biography about the author ${author.name}`)
  },
  base: async (author) => {
    const prompt = `
        About the following author: ${author.name}
        Answer me only a json object in the following format:
        {
          name, // correct spelled and complete author name
          country, // 2 letters code
          biography, // medium size biography about the author
          dob, // date of birthday in the formmat 'YYYY-MM-DD'
          books: [ // list of most popular books from this author
            {
              "title",  // complete title
              "year", // year of release 'YYYY'
              "ISBN", // single most recent ISBN, from any publisher,
              "resume", // medium size resume about this book
            },
          ]
        }
    `
    const response = await gpt.chat(prompt)
    return JSON.parse(response)
  },
}

const generate = async (author) => {
  // generate filled object
  const base = await generator.base(author)

  // generate image and save to disk
  await generator.photo(base.name)

  // update author
  const updatedAuthor = await author.update({
    ...base,
    slug: file.slugify(base.name),
  })

  for (const book of base.books) {
    await Book.create({
      ...book,
      slug: file.slugify(book.title),
      author_id: updatedAuthor.id,
    })
  }

  return updatedAuthor
}

module.exports = {
  generate,
}
