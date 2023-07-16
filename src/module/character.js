const db = require("../db")
const gpt = require("../library/gpt")
const file = require("../library/file")

/**
 * Helper function to create a character prompt.
 *
 * @returns {string} - A character prompt string.
 */
const prompter = () => {
  return `
    {
      "name", // Name of the character
      "role", // Role of the character in the book
      "description", // Short description about the character
      "photo_description" // Short description (up to 400 characters) to be used on dall-e to draw the most famous representation of this character.
    }
    // ... More characters can be added here. Empty array if the book has no characters.
  `
}

/**
 * Fetches metadata about characters from a specified book using GPT.
 *
 * @param {string} book_title - ID of the book.
 * @returns {Promise<object>} - A promise that resolves to the character metadata of the book.
 */
const generateByTitleAndAuthor = async (book_title, author_name) => {
  const prompt = `About the book ${book_title} from ${author_name} \nPlease provide a list of JSON objects in the following format:\n [${prompter()}]`
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
  await file.saveImage(image64, name, "character/")
}

/**
 * Create a new character.
 * @param {string} name - The character's name.
 * @param {string} role - The character's role.
 * @param {string} description - The character's description.
 * @return {Promise<Object>} - The created character.
 * @throws {Error} - If failed to create character.
 */
const createByName = async (name, role, description) => {
  const created = await db.Character.create({ name, role, description })

  if (!created) {
    throw Error("Character not created")
  }

  return created
}

/**
 * Create a new character with all fields.
 * @param {{name: string, role: string, description: string}} data - The character's data.
 * @return {Promise<Object>} - The created character.
 * @throws {Error} - If failed to create character.
 */
const create = async (data, book_id) => {
  const character = await db.Character.create({
    name: data.name,
    role: data.role,
    description: data.description,
    photo_description: data.photo_description,
    book_id: data.book_id || book_id,
  })

  if (!character) {
    throw Error("Character not created")
  }

  await generateImage(character.slug, character.photo_description)

  return character
}

/**
 * Get all characters.
 * @return {Promise<Array>} - The list of characters.
 * @throws {Error} - If failed to retrieve characters.
 */
const list = async () => await db.Character.findAll()

/**
 * Get a character by ID.
 * @param {number|string} id - The character's ID.
 * @return {Promise<Object>} - The character object.
 * @throws {Error} - If failed to retrieve character.
 */
const readById = async (id) => {
  const character = await db.Character.findByPk(id)

  if (!character) {
    throw Error("Character not found")
  }

  return character
}

/**
 * Update a character by ID.
 * @param {number|string} id - The character's ID.
 * @param {{name?: string, role?: string, description?: string}} updatedData - The updated character's data.
 * @return {Promise<Object>} - The updated character.
 * @throws {Error} - If failed to update character or character not found.
 */
const updateById = async (id, updatedData) => {
  const character = await db.Character.findByPk(id)

  if (!character) {
    throw new Error("Character not found")
  }

  const updated = await character.update(updatedData)

  if (!updated) {
    throw new Error("Character not updated")
  }

  return updated
}

/**
 * Delete a character by ID.
 * @param {number|string} id - The character's ID.
 * @return {Promise<boolean>} - True if character was deleted.
 * @throws {Error} - If failed to delete character or character not found.
 */
const deleteById = async (id) => {
  const deletedRowsCount = await db.Character.destroy({ where: { id } })

  if (deletedRowsCount === 0) {
    throw new Error("Character not found")
  }

  return true
}

module.exports = {
  create,
  prompter,
  generateByTitleAndAuthor,
  createByName,
  list,
  readById,
  updateById,
  deleteById,
}
