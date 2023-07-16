const db = require("../db")
const crypt = require("../library/crypt")

/**
 * Create a new user.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @return {Promise<Object>} - The created user.
 * @throws {Error} - If failed to create user.
 */
const create = async (data) => {
  const created = await db.User.create({
    name: data.name,
    email: data.email,
    password: data.password,
  })

  if (!created) {
    throw Error("User not created")
  }

  return created
}

/**
 * Get all users.
 * @return {Promise<Array>} - The list of users.
 * @throws {Error} - If failed to retrieve users.
 */
const list = async () => await db.User.findAll()

/**
 * Get a user by ID.
 * @param {number|string} id - The user's ID.
 * @return {Promise<Object>} - The user object.
 * @throws {Error} - If failed to retrieve user.
 */
const readById = async (id) => {
  const user = await db.User.findByPk(id)

  if (!user) {
    throw Error("User not found")
  }

  return user
}

/**
 * Update a user by ID.
 * @param {number|string} id - The user's ID.
 * @param {{name?: string, email?: string, password?: string}} updatedData - The updated user's data.
 * @return {Promise<Object>} - The updated user.
 * @throws {Error} - If failed to update user or user not found.
 */
const updateById = async (id, updatedData) => {
  const user = await db.User.findByPk(id)

  if (!user) {
    throw new Error("user not found")
  }

  const updated = await user.update(updatedData)

  if (!updated) {
    throw new Error("User not updated")
  }

  return updated
}

/**
 * Delete a user by ID.
 * @param {number|string} id - The user's ID.
 * @return {Promise<boolean>} - True if user was deleted.
 * @throws {Error} - If failed to delete user or user not found.
 */
const deleteById = async (id) => {
  const deletedRowsCount = await db.User.destroy({ where: { id } })

  if (deletedRowsCount === 0) {
    throw new Error("User not deleted")
  }

  return true
}

/**
 * Check if the provided email and password match a user in the database.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @return {Promise<Object|null>} - The user object if the email and password match, null otherwise.
 */
const checkCredentials = async (email, password) => {
  const user = await db.User.findOne({ where: { email } })

  if (!user) {
    throw Error("User not found for email:", email)
  }

  const passwordMatch = await crypt.compare(password, user.password)

  if (!passwordMatch) {
    throw Error("Invalid password for user: " + email)
  }

  return user
}

/**
 * Generate a random authentication token.
 * @returns {string} - The authentication token.
 */
const generateAuthToken = async () => await crypt.hash(Math.random().toString())

/**
 * Login and generate a token for the provided user.
 * @param {Object} user - The user object.
 * @returns {Promise<string>} - The generated authentication token.
 * @throws {Error} - If failed to generate token.
 */
const login = async (user) => {
  const token = await generateAuthToken()
  const token_exp = new Date(Date.now() + 60 * 60 * 1000)
  await user.update({ token, token_exp })
  return token
}

/**
 * Get a user by token.
 * @param {string} token - The user's token.
 * @return {Promise<Object|null>} - The user object if found and token is not expired, null otherwise.
 */
const readByToken = async (token) => {
  const user = await db.User.findOne({
    where: {
      token,
    },
  })

  if (!user) {
    throw new Error("User not found for token")
  }

  // Check if the token is expired
  const isTokenExpired = new Date() > user.token_exp

  if (isTokenExpired) {
    throw new Error("Token has expired for user")
  }

  return user
}

module.exports = {
  readByToken,
  login,
  generateAuthToken,
  create,
  list,
  readById,
  updateById,
  deleteById,
  checkCredentials,
}
