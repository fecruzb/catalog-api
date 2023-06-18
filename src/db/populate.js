const { faker } = require("@faker-js/faker")
const { Author, Book } = require(".")
const seed = require("./seed/initial.json")
const { kebabCase } = require("lodash")

function generateISBN() {
  const group = faker.number.int({ min: 0, max: 9 })
  const publisher = faker.number.int({ min: 0, max: 9 })
  const title = faker.number.int({ min: 0, max: 99999 })
  const checkDigit = faker.number.int({ min: 0, max: 9 })

  const isbn = `${group}-${publisher}-${title}-${checkDigit}`
  return isbn
}

;(async () => {
  for (const author of seed) {
    let newAuthor = await Author.findOne({ where: { name: author.name } })

    try {
      if (!newAuthor) {
        console.log(`> Create: ${author.name}`)
        newAuthor = await Author.create({
          name: author.name,
          slug: kebabCase(author.name),
          country: author.country,
        })
      } else {
        console.log(`> Already Found: ${author.name}`)
      }
    } catch {
      continue
    }

    for (const book of author.books) {
      let newBook = await Book.findOne({ where: { title: book.title } })

      try {
        if (!newBook) {
          console.log(`>>>> Create: ${book.title}`)
          newBook = await Book.create({
            title: book.title,
            slug: kebabCase(book.title),
            author_id: newAuthor.id,
            year: book.year,
            ISBN: generateISBN(),
          })
        } else {
          console.log(`>>>> Already Found: ${book.title}`)
        }
      } catch {
        continue
      }
    }
  }
})()
