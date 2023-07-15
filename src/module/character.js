const db = require("../db")
const gpt = require("../library/gpt")

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
      "photo_description" // Anime style, studio ghlibe style, provide a brief description (up to 200 characters) of the most famous or widely recognized visual representation of this character.
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
 * Create a new character
 * @param {string} name - The character's name
 * @param {string} role - The character's role
 * @param {string} description - The character's description
 * @return {Promise<Object>} - The created character
 * @throws {Error} - If failed to create character
 */
const createByName = async (name, role, description) => {
  try {
    const created = await db.Character.create({ name, role, description })
    return created
  } catch (error) {
    throw new Error("Failed to create character")
  }
}

/**
 * Create a new character with all fields
 * @param {{name: string, role: string, description: string}} data - The character's data
 * @return {Promise<Object>} - The created character
 * @throws {Error} - If failed to create character
 */
const create = async (data, book_id) => {
  try {
    const created = await db.Character.create({
      name: data.name,
      role: data.role,
      description: data.description,
      photo_description: data.photo_description,
      book_id: data.book_id || book_id,
    })
    return created
  } catch (error) {
    throw new Error("Failed to create character")
  }
}
/**
 * Get all characters
 * @return {Promise<Array>} - The list of characters
 * @throws {Error} - If failed to retrieve characters
 */
const list = async () => {
  try {
    const characters = await db.Character.findAll()
    return characters
  } catch (error) {
    throw new Error("Failed to retrieve characters")
  }
}

/**
 * Get a character by ID
 * @param {number|string} id - The character's id
 * @return {Promise<Object>} - The character object
 * @throws {Error} - If failed to retrieve character
 */
const readById = async (id) => {
  try {
    const character = await db.Character.findByPk(id)
    return character
  } catch (error) {
    throw new Error("Failed to retrieve character")
  }
}

/**
 * Update a character by ID
 * @param {number|string} id - The character's id
 * @param {{name?: string, role?: string, description?: string}} updatedData - The updated character's data
 * @return {Promise<Object>} - The updated character
 * @throws {Error} - If failed to update character or character not found
 */
const updateById = async (id, updatedData) => {
  try {
    const [updatedRowsCount, [updated]] = await db.Character.update(updatedData, {
      where: { id },
      returning: true,
    })

    if (updatedRowsCount === 0) {
      throw new Error("Character not found")
    }

    return updated
  } catch (error) {
    throw new Error("Failed to update character")
  }
}

/**
 * Delete a character by ID
 * @param {number|string} id - The character's id
 * @return {Promise<boolean>} - True if character was deleted
 * @throws {Error} - If failed to delete character or character not found
 */
const deleteById = async (id) => {
  try {
    const deletedRowsCount = await db.Character.destroy({ where: { id } })

    if (deletedRowsCount === 0) {
      throw new Error("Character not found")
    }

    return true
  } catch (error) {
    throw new Error("Failed to delete character")
  }
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
