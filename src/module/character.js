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
  console.log("Generating character metadata...")
  const response = await gpt.chat(prompt)
  console.log("Character metadata generated:", response)
  return JSON.parse(response)
}

/**
 * Generate image using GPT.
 *
 * @param {string} name - Name of the book.
 * @returns {Promise<object>} - A promise that resolves to the book's metadata.
 */
const generateImage = async (name, prompt) => {
  try {
    console.log("Generating image for character:", name)
    const image64 = await gpt.image(prompt)
    console.log("Image generated for character:", name)
    await file.saveImage(image64, name, "character/")
  } catch (e) {
    console.log("Failed to generate image for character:", name)
    console.log(e)
  }
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
  try {
    console.log("Creating character:", name)
    const created = await db.Character.create({ name, role, description })
    console.log("Character created:", created)
    return created
  } catch (error) {
    console.log("Failed to create character:", name)
    console.log(error)
    throw new Error("Failed to create character")
  }
}

/**
 * Create a new character with all fields.
 * @param {{name: string, role: string, description: string}} data - The character's data.
 * @return {Promise<Object>} - The created character.
 * @throws {Error} - If failed to create character.
 */
const create = async (data, book_id) => {
  try {
    const character = await db.Character.create({
      name: data.name,
      role: data.role,
      description: data.description,
      photo_description: data.photo_description,
      book_id: data.book_id || book_id,
    })

    console.log("Creating character:", character.name)
    await generateImage(character.slug, character.photo_description)
    console.log("Character created:", character.name)

    return character
  } catch (error) {
    console.log("Failed to create character:", data.name)
    console.log(error)
    throw new Error("Failed to create character")
  }
}

/**
 * Get all characters.
 * @return {Promise<Array>} - The list of characters.
 * @throws {Error} - If failed to retrieve characters.
 */
const list = async () => {
  try {
    console.log("Retrieving characters...")
    const characters = await db.Character.findAll()
    console.log(
      "Characters retrieved:",
      characters.map((node) => node.get({ plain: true })),
    )
    return characters
  } catch (error) {
    console.log("Failed to retrieve characters")
    throw new Error("Failed to retrieve characters")
  }
}

/**
 * Get a character by ID.
 * @param {number|string} id - The character's ID.
 * @return {Promise<Object>} - The character object.
 * @throws {Error} - If failed to retrieve character.
 */
const readById = async (id) => {
  try {
    console.log("Retrieving character by ID:", id)
    const character = await db.Character.findByPk(id)
    console.log("Character retrieved:", character.get({ plain: true }))
    return character
  } catch (error) {
    console.log("Failed to retrieve character by ID:", id)
    throw new Error("Failed to retrieve character")
  }
}

/**
 * Update a character by ID.
 * @param {number|string} id - The character's ID.
 * @param {{name?: string, role?: string, description?: string}} updatedData - The updated character's data.
 * @return {Promise<Object>} - The updated character.
 * @throws {Error} - If failed to update character or character not found.
 */
const updateById = async (id, updatedData) => {
  try {
    console.log("Updating character by ID:", id)
    const [updatedRowsCount, [updated]] = await db.Character.update(updatedData, {
      where: { id },
      returning: true,
    })

    if (updatedRowsCount === 0) {
      console.log("Character not found:", id)
      throw new Error("Character not found")
    }

    console.log("Character updated:", updated.get({ plain: true }))
    return updated
  } catch (error) {
    console.log("Failed to update character by ID:", id)
    throw new Error("Failed to update character")
  }
}

/**
 * Delete a character by ID.
 * @param {number|string} id - The character's ID.
 * @return {Promise<boolean>} - True if character was deleted.
 * @throws {Error} - If failed to delete character or character not found.
 */
const deleteById = async (id) => {
  try {
    console.log("Deleting character by ID:", id)
    const deletedRowsCount = await db.Character.destroy({ where: { id } })

    if (deletedRowsCount === 0) {
      console.log("Character not found:", id)
      throw new Error("Character not found")
    }

    console.log("Character deleted:", id)
    return true
  } catch (error) {
    console.log("Failed to delete character by ID:", id)
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
