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
  console.log("Prompting book metadata...")
  const response = await gpt.chat(prompt)
  console.log("Book metadata received:", response)
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
    console.log("Generating image for book:", name)
    const image64 = await gpt.image(prompt)
    console.log("Image generated for book:", name)
    await file.saveImage(image64, name, "book/")
  } catch (e) {
    console.log("Failed to generate image for book:", name)
    console.log(e)
  }
}

/**
 * Create a new book.
 * @param {string} title - The book's title.
 * @param {number} author_id - The author's id.
 * @return {Promise<Object>} - The created book.
 * @throws {Error} - If failed to create book.
 */
const spawnByTitle = async (title, author_id) => {
  try {
    const author = await db.Author.findByPk(author_id)
    const bookGPT = await promptByTitle(title, author.name)

    console.log("Spawning book:", title)
    const book = await create(bookGPT)

    for (let characterGPT of bookGPT.characters) {
      await Character.create(characterGPT, book.id)
    }

    console.log("Book spawned:", title)
    return book
  } catch (error) {
    console.log("Failed to spawn book:", title)
    console.log(error)
    throw new Error("Failed to create author with GPT")
  }
}

/**
 * Create a new book with all fields.
 * @param {{title: string, year: number, ISBN: string, resume: string, author_id: number}} data - The book's data.
 * @return {Promise<Object>} - The created book.
 * @throws {Error} - If failed to create book.
 */
const create = async (data, author_id) => {
  try {
    const book = await db.Book.create({
      title: data.title,
      year: data.year,
      ISBN: data.ISBN,
      resume: data.resume,
      cover_description: data.cover_description,
      author_id: data.author_id || author_id,
    })

    console.log("Creating book:", book.title)
    await generateImage(book.slug, book.cover_description)
    console.log("Book created:", book.title)

    return book
  } catch (error) {
    console.log("Failed to create book:", data.title)
    throw new Error("Failed to create book")
  }
}

/**
 * Get all books.
 * @return {Promise<Array>} - The list of books.
 * @throws {Error} - If failed to retrieve books.
 */
const list = async () => {
  try {
    console.log("Retrieving books...")
    const books = await db.Book.findAll({
      include: [
        {
          model: db.Author,
          as: "author",
        },
      ],
    })
    console.log(
      "Books retrieved:",
      books.map((node) => node.get({ plain: true })),
    )
    return books
  } catch (error) {
    console.log("Failed to retrieve books")
    throw new Error("Failed to retrieve books")
  }
}

/**
 * Get a book by ID.
 * @param {number|string} id - The book's ID.
 * @return {Promise<Object>} - The book object.
 * @throws {Error} - If failed to retrieve book.
 */
const readById = async (id) => {
  try {
    console.log("Retrieving book by ID:", id)
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
    console.log("Book retrieved:", book.get({ plain: true }))
    return book
  } catch (error) {
    console.log("Failed to retrieve book by ID:", id)
    throw new Error("Failed to retrieve book")
  }
}

/**
 * Update a book by ID.
 * @param {number|string} id - The book's ID.
 * @param {{title?: string, year?: number, ISBN?: string, resume?: string}} updatedData - The updated book's data.
 * @return {Promise<Object>} - The updated book.
 * @throws {Error} - If failed to update book or book not found.
 */
const updateById = async (id, updatedData) => {
  try {
    console.log("Updating book by ID:", id)
    const [updatedRowsCount, [updated]] = await db.Book.update(updatedData, {
      where: { id },
      returning: true,
    })

    if (updatedRowsCount === 0) {
      console.log("Book not found:", id)
      throw new Error("Book not found")
    }

    console.log("Book updated:", updated.get({ plain: true }))
    return updated
  } catch (error) {
    console.log("Failed to update book by ID:", id)
    throw new Error("Failed to update book")
  }
}

/**
 * Delete a book by ID.
 * @param {number|string} id - The book's ID.
 * @return {Promise<boolean>} - True if book was deleted.
 * @throws {Error} - If failed to delete book or book not found.
 */
const deleteById = async (id) => {
  try {
    console.log("Deleting book by ID:", id)
    const deletedRowsCount = await db.Book.destroy({ where: { id } })

    if (deletedRowsCount === 0) {
      console.log("Book not found:", id)
      throw new Error("Book not found")
    }

    console.log("Book deleted:", id)
    return true
  } catch (error) {
    console.log("Failed to delete book by ID:", id)
    throw new Error("Failed to delete book")
  }
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
