const db = require("../db")
const gpt = require("../library/gpt")
const file = require("../library/file")
const Book = require("../module/book")
const Character = require("../module/character")

/**
 * Helper function to create an author prompt.
 *
 * @returns {string} - An author prompt string.
 */
const prompter = () => {
  return `
  {
    "name", // Correctly spelled and complete author name
    "country", // Two-letter country code
    "biography", // Medium-sized biography about the author
    "photo_description", // Short description (up to 400 characters) to be used on dall-e to draw this author as his most recognizable picture.
    "books": [
      ${Book.prompter()}
    ]
  }
`
}

/**
 * Fetches author metadata, including their most popular books and characters, using GPT.
 *
 * @param {string} name - Name of the author.
 * @returns {Promise<object>} - A promise that resolves to the author's metadata.
 */
const promptByName = async (name) => {
  const prompt = `About the following author: ${name} \nPlease provide a JSON object with the following format:\n ${prompter()}`
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
  await file.saveImage(image64, name, "author/")
}

/**
 * Create a new author.
 * @param {string} name - The author's name.
 * @return {Promise<Object>} - The created author.
 * @throws {Error} - If failed to create author.
 */
const spawnByName = async (name) => {
  const authorGPT = await promptByName(name)
  const author = await create(authorGPT)
  for (let bookGPT of authorGPT.books) {
    const book = await Book.create(bookGPT, author.id)
    for (let characterGPT of bookGPT.characters) {
      await Character.create(characterGPT, book.id)
    }
  }

  return author
}

/**
 * Create a new author with all fields.
 * @param {{name: string, country: string, biography: string}} data - The author's data.
 * @return {Promise<Object>} - The created author.
 * @throws {Error} - If failed to create author.
 */
const create = async (data) => {
  // Save to DB
  const author = await db.Author.create({
    name: data.name,
    country: data.country,
    biography: data.biography,
    dob: data.dob,
    photo_description: data.photo_description,
  })

  if (!author) {
    throw new Error("Author not created")
  }

  await generateImage(author.slug, author.photo_description)

  return author
}

/**
 * Get all authors.
 * @return {Promise<Array>} - The list of authors.
 * @throws {Error} - If failed to retrieve authors.
 */
const list = async () =>
  await db.Author.findAll({
    include: [
      {
        model: db.Book,
        as: "books",
      },
    ],
  })

/**
 * Get an author by ID.
 * @param {number|string} id - The author's ID.
 * @return {Promise<Object>} - The author object.
 * @throws {Error} - If failed to retrieve author.
 */
const readById = async (id) => {
  const author = await db.Author.findByPk(id, {
    include: [
      {
        model: db.Book,
        as: "books",
      },
    ],
  })

  if (!author) {
    throw new Error("Author not found")
  }

  return author
}

/**
 * Update an author by ID.
 * @param {number|string} id - The author's ID.
 * @param {{name?: string, country?: string, biography?: string}} updatedData - The updated author's data.
 * @return {Promise<Object>} - The updated author.
 * @throws {Error} - If failed to update author or author not found.
 */
const updateById = async (id, updatedData) => {
  const author = await db.Author.findByPk(id)

  if (!author) {
    throw new Error("Author not found")
  }

  const updated = await author.update(updatedData)

  if (!updated) {
    throw new Error("Author not updated")
  }

  return updated
}

/**
 * Delete an author by ID.
 * @param {number|string} id - The author's ID.
 * @return {Promise<boolean>} - True if author was deleted.
 * @throws {Error} - If failed to delete author or author not found.
 */
const deleteById = async (id) => {
  const deletedRowsCount = await db.Author.destroy({ where: { id } })

  if (deletedRowsCount === 0) {
    throw new Error("Author not found")
  }

  return true
}

module.exports = {
  prompter,
  spawnByName,
  create,
  list,
  readById,
  updateById,
  deleteById,
}
