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
    "dob", // Date of birth in the format 'YYYY-MM-DD'
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
  console.log("Prompting author metadata...")
  const response = await gpt.chat(prompt)
  console.log("Author metadata received:", response)
  return JSON.parse(response)
}

const generateImage = async (name, prompt) => {
  try {
    console.log("Generating image for author:", name)
    const image64 = await gpt.image(prompt)
    console.log("Image generated for author:", name)
    await file.saveImage(image64, name, "author/")
  } catch (e) {
    console.log("Failed to generate image for author:", name)
    console.log(e)
  }
}

/**
 * Create a new author.
 * @param {string} name - The author's name.
 * @return {Promise<Object>} - The created author.
 * @throws {Error} - If failed to create author.
 */
const spawnByName = async (name) => {
  try {
    const authorGPT = await promptByName(name)

    console.log("Spawning author:", name)
    const author = await create(authorGPT)
    for (let bookGPT of authorGPT.books) {
      const book = await Book.create(bookGPT, author.id)
      for (let characterGPT of bookGPT.characters) {
        await Character.create(characterGPT, book.id)
      }
    }

    console.log("Author spawned:", name)
    return author
  } catch (error) {
    console.log("Failed to spawn author:", name)
    throw new Error("Failed to create author with GPT")
  }
}

/**
 * Create a new author with all fields.
 * @param {{name: string, country: string, biography: string}} data - The author's data.
 * @return {Promise<Object>} - The created author.
 * @throws {Error} - If failed to create author.
 */
const create = async (data) => {
  try {
    // Save to DB
    const author = await db.Author.create({
      name: data.name,
      country: data.country,
      biography: data.biography,
      dob: data.dob,
      photo_description: data.photo_description,
    })

    console.log("Creating author:", author.name)
    await generateImage(author.slug, author.photo_description)
    console.log("Author created:", author.name)

    return author
  } catch (error) {
    console.log("Failed to create author:", data.name)
    throw new Error("Failed to create author")
  }
}

/**
 * Get all authors.
 * @return {Promise<Array>} - The list of authors.
 * @throws {Error} - If failed to retrieve authors.
 */
const list = async () => {
  try {
    console.log("Retrieving authors...")
    const authors = await db.Author.findAll({
      include: [
        {
          model: db.Book,
          as: "books",
        },
      ],
    })
    console.log(
      "Authors retrieved:",
      authors.map((node) => node.get({ plain: true })),
    )
    return authors
  } catch (error) {
    console.log("Failed to retrieve authors")
    throw new Error("Failed to retrieve authors")
  }
}

/**
 * Get an author by ID.
 * @param {number|string} id - The author's ID.
 * @return {Promise<Object>} - The author object.
 * @throws {Error} - If failed to retrieve author.
 */
const readById = async (id) => {
  try {
    console.log("Retrieving author by ID:", id)
    const author = await db.Author.findByPk(id, {
      include: [
        {
          model: db.Book,
          as: "books",
        },
      ],
    })
    console.log("Author retrieved:", author.get({ plain: true }))
    return author
  } catch (error) {
    console.log("Failed to retrieve author by ID:", id)
    throw new Error("Failed to retrieve author")
  }
}

/**
 * Update an author by ID.
 * @param {number|string} id - The author's ID.
 * @param {{name?: string, country?: string, biography?: string}} updatedData - The updated author's data.
 * @return {Promise<Object>} - The updated author.
 * @throws {Error} - If failed to update author or author not found.
 */
const updateById = async (id, updatedData) => {
  try {
    console.log("Updating author by ID:", id)
    const [updatedRowsCount, [updated]] = await db.Author.update(updatedData, {
      where: { id },
      returning: true,
    })

    if (updatedRowsCount === 0) {
      console.log("Author not found:", id)
      throw new Error("Author not found")
    }

    console.log("Author updated:", updated.get({ plain: true }))
    return updated
  } catch (error) {
    console.log("Failed to update author by ID:", id)
    throw new Error("Failed to update author")
  }
}

/**
 * Delete an author by ID.
 * @param {number|string} id - The author's ID.
 * @return {Promise<boolean>} - True if author was deleted.
 * @throws {Error} - If failed to delete author or author not found.
 */
const deleteById = async (id) => {
  try {
    console.log("Deleting author by ID:", id)
    const deletedRowsCount = await db.Author.destroy({ where: { id } })

    if (deletedRowsCount === 0) {
      console.log("Author not found:", id)
      throw new Error("Author not found")
    }

    console.log("Author deleted:", id)
    return true
  } catch (error) {
    console.log("Failed to delete author by ID:", id)
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
