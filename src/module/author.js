const db = require("../db")
const gpt = require("../library/gpt")
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
    "dob", // Date of birth in the format 'YYYY-MM-DD'
    "photo_description",  // Anime style, studio ghlibe style, Short description (200 chars max) about the most famous profile picture of this author
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
 * Create a new author
 * @param {string} name - The author's name
 * @return {Promise<Object>} - The created author
 * @throws {Error} - If failed to create author
 */
const spawnByName = async (name) => {
  try {
    const authorGPT = await promptByName(name)

    const author = await create(authorGPT)
    for (let bookGPT of authorGPT.books) {
      const book = await Book.create(bookGPT, author.id)
      for (let characterGPT of bookGPT.characters) {
        await Character.create(characterGPT, book.id)
      }
    }
    return author
  } catch (error) {
    console.log(error)
    throw new Error("Failed to create author with gpt")
  }
}

/**
 * Create a new author with all fields
 * @param {{name: string, country: string, biography: string}} data - The author's data
 * @return {Promise<Object>} - The created author
 * @throws {Error} - If failed to create author
 */
const create = async (data) => {
  try {
    const author = await db.Author.create({
      name: data.name,
      country: data.country,
      biography: data.biography,
      dob: data.dob,
      photo_description: data.photo_description,
    })
    return author
  } catch (error) {
    throw new Error("Failed to create author")
  }
}

/**
 * Get all authors
 * @return {Promise<Array>} - The list of authors
 * @throws {Error} - If failed to retrieve authors
 */
const list = async () => {
  try {
    const authors = await db.Author.findAll({
      include: [
        {
          model: db.Book,
          as: "books",
        },
      ],
    })
    return authors
  } catch (error) {
    throw new Error("Failed to retrieve authors")
  }
}

/**
 * Get an author by ID
 * @param {number|string} id - The author's id
 * @return {Promise<Object>} - The author object
 * @throws {Error} - If failed to retrieve author
 */
const readById = async (id) => {
  try {
    const author = await db.Author.findByPk(id, {
      include: [
        {
          model: db.Book,
          as: "books",
        },
      ],
    })
    return author
  } catch (error) {
    throw new Error("Failed to retrieve author")
  }
}

/**
 * Update an author by ID
 * @param {number|string} id - The author's id
 * @param {{name?: string, country?: string, biography?: string}} updatedData - The updated author's data
 * @return {Promise<Object>} - The updated author
 * @throws {Error} - If failed to update author or author not found
 */
const updateById = async (id, updatedData) => {
  try {
    const [updatedRowsCount, [updated]] = await db.Author.update(updatedData, {
      where: { id },
      returning: true,
    })

    if (updatedRowsCount === 0) {
      throw new Error("Author not found")
    }

    return updated
  } catch (error) {
    throw new Error("Failed to update author")
  }
}

/**
 * Delete an author by ID
 * @param {number|string} id - The author's id
 * @return {Promise<boolean>} - True if author was deleted
 * @throws {Error} - If failed to delete author or author not found
 */
const deleteById = async (id) => {
  try {
    const deletedRowsCount = await db.Author.destroy({ where: { id } })

    if (deletedRowsCount === 0) {
      throw new Error("Author not found")
    }

    return true
  } catch (error) {
    throw new Error("Failed to delete author")
  }
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
