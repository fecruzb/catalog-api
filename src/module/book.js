const db = require("../db")
const gpt = require("../library/gpt")
const file = require("../library/file")
const Character = require("../module/character")

/**
 * Helper function to create a book prompt.
 *
 * @returns {string} - A book prompt string.
 */
const prompter = () => {
  return `
  {
    "title",  // The complete and correctly spelled title of the book
    "year", // Year of release in 'YYYY' format
    "ISBN", // The most recent ISBN from any publisher
    "resume", // Medium-sized summary about this book
    "cover_description", // Short description (up to 400 characters) to be used on dall-e to draw a cover art for this book.
    "characters": [
      ${Character.prompter()}
    ]
  }
  // ... More books can be added here. Empty array if the author has no books.
`
}

/**
 * Fetches metadata about a specific book from a given author and its characters using GPT.
 *
 * @param {string} title - Title of the book.
 * @param {string} authorName - Name of the author.
 * @returns {Promise<object>} - A promise that resolves to the book's metadata.
 */
const promptByTitle = async (title, authorName) => {
  const prompt = `About the following book "${title}" by author "${authorName}", \nPlease provide a single JSON object in the following format:\n ${prompter()}`
  const response = await gpt.chat(prompt)
  return JSON.parse(response)
}

/**
 * Generate image using GPT.
 *
 * @param {string} name - Name of the book.
 * @returns {Promise<object>} - A promise that resolves to the book's metadata.
 */
const generateImage = async (name, prompt) => {
  const image64 = await gpt.image(prompt)
  await file.saveImage(image64, name, "book/")
}

/**
 * Create a new book.
 * @param {string} title - The book's title.
 * @param {number} author_id - The author's id.
 * @return {Promise<Object>} - The created book.
 * @throws {Error} - If failed to create book.
 */
const spawnByTitle = async (title, author_id) => {
  const author = await db.Author.findByPk(author_id)
  const bookGPT = await promptByTitle(title, author.name)

  const book = await create(bookGPT)
  for (let characterGPT of bookGPT.characters) {
    await Character.create(characterGPT, book.id)
  }

  return book
}

/**
 * Create a new book with all fields.
 * @param {{title: string, year: number, ISBN: string, resume: string, author_id: number}} data - The book's data.
 * @return {Promise<Object>} - The created book.
 * @throws {Error} - If failed to create book.
 */
const create = async (data, author_id) => {
  const book = await db.Book.create({
    title: data.title,
    year: data.year,
    ISBN: data.ISBN,
    resume: data.resume,
    cover_description: data.cover_description,
    author_id: data.author_id || author_id,
  })

  if (!book) {
    throw new Error("Book not created")
  }

  await generateImage(book.slug, book.cover_description)

  return book
}

/**
 * Get all books.
 * @return {Promise<Array>} - The list of books.
 * @throws {Error} - If failed to retrieve books.
 */
const list = async () =>
  await db.Book.findAll({
    include: [
      {
        model: db.Author,
        as: "author",
      },
    ],
  })

/**
 * Get a book by ID.
 * @param {number|string} id - The book's ID.
 * @return {Promise<Object>} - The book object.
 * @throws {Error} - If failed to retrieve book.
 */
const readById = async (id) => {
  const book = await db.Book.findByPk(id, {
    include: [
      {
        model: db.Author,
        as: "author",
      },
      {
        model: db.Character,
        as: "characters",
      },
    ],
  })

  if (!book) {
    throw new Error("Book not found")
  }

  return book
}

/**
 * Update a book by ID.
 * @param {number|string} id - The book's ID.
 * @param {{title?: string, year?: number, ISBN?: string, resume?: string}} updatedData - The updated book's data.
 * @return {Promise<Object>} - The updated book.
 * @throws {Error} - If failed to update book or book not found.
 */
const updateById = async (id, updatedData) => {
  const book = await db.Book.findByPk(id)

  if (!book) {
    throw new Error("Book not found")
  }

  const updated = await book.update(updatedData)

  if (!updated) {
    throw new Error("Book not updated")
  }

  return updated
}

/**
 * Delete a book by ID.
 * @param {number|string} id - The book's ID.
 * @return {Promise<boolean>} - True if book was deleted.
 * @throws {Error} - If failed to delete book or book not found.
 */
const deleteById = async (id) => {
  const deletedRowsCount = await db.Book.destroy({ where: { id } })

  if (deletedRowsCount === 0) {
    throw new Error("Book not found")
  }

  return true
}

module.exports = {
  prompter,
  promptByTitle,
  spawnByTitle,
  create,
  list,
  readById,
  updateById,
  deleteById,
}
