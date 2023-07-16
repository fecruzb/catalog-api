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
  try {
    console.log("Creating user:", data.name)
    const created = await db.User.create({
      name: data.name,
      email: data.email,
      password: data.password,
    })
    console.log("User created:", created.get({ plain: true }))
    return created
  } catch (error) {
    console.log("Failed to create user:", data.name)
    console.log(error)
    throw new Error("Failed to create user")
  }
}

/**
 * Get all users.
 * @return {Promise<Array>} - The list of users.
 * @throws {Error} - If failed to retrieve users.
 */
const list = async () => {
  try {
    console.log("Retrieving users...")
    const users = await db.User.findAll()
    console.log(
      "Users retrieved:",
      users.map((node) => node.get({ plain: true })),
    )
    return users
  } catch (error) {
    console.log("Failed to retrieve users")
    throw new Error("Failed to retrieve users")
  }
}

/**
 * Get a user by ID.
 * @param {number|string} id - The user's ID.
 * @return {Promise<Object>} - The user object.
 * @throws {Error} - If failed to retrieve user.
 */
const readById = async (id) => {
  try {
    console.log("Retrieving user by ID:", id)
    const user = await db.User.findByPk(id)
    console.log("User retrieved:", user.get({ plain: true }))
    return user
  } catch (error) {
    console.log("Failed to retrieve user by ID:", id)
    throw new Error("Failed to retrieve user")
  }
}

/**
 * Update a user by ID.
 * @param {number|string} id - The user's ID.
 * @param {{name?: string, email?: string, password?: string}} updatedData - The updated user's data.
 * @return {Promise<Object>} - The updated user.
 * @throws {Error} - If failed to update user or user not found.
 */
const updateById = async (id, updatedData) => {
  try {
    console.log("Updating user by ID:", id)
    const [updatedRowsCount, [updated]] = await db.User.update(updatedData, {
      where: { id },
      returning: true,
    })

    if (updatedRowsCount === 0) {
      console.log("User not found:", id)
      throw new Error("User not found")
    }

    console.log("User updated:", updated.get({ plain: true }))
    return updated
  } catch (error) {
    console.log("Failed to update user by ID:", id)
    throw new Error("Failed to update user")
  }
}

/**
 * Delete a user by ID.
 * @param {number|string} id - The user's ID.
 * @return {Promise<boolean>} - True if user was deleted.
 * @throws {Error} - If failed to delete user or user not found.
 */
const deleteById = async (id) => {
  try {
    console.log("Deleting user by ID:", id)
    const deletedRowsCount = await db.User.destroy({ where: { id } })

    if (deletedRowsCount === 0) {
      console.log("User not found:", id)
      throw new Error("User not found")
    }

    console.log("User deleted:", id)
    return true
  } catch (error) {
    console.log("Failed to delete user by ID:", id)
    throw new Error("Failed to delete user")
  }
}

/**
 * Check if the provided email and password match a user in the database.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @return {Promise<Object|null>} - The user object if the email and password match, null otherwise.
 */
const checkCredentials = async (email, password) => {
  try {
    console.log("Checking user credentials...")
    const user = await db.User.findOne({ where: { email } })

    if (!user) {
      console.log("User not found for email:", email)
      return null
    }

    const passwordMatch = await crypt.compare(password, user.password)

    if (!passwordMatch) {
      console.log("Invalid password for user:", email)
      return null
    }

    console.log("User credentials verified:", email)
    return user
  } catch (error) {
    console.log("Failed to check user credentials:", email)
    throw new Error("Failed to check user credentials")
  }
}

/**
 * Generate a random authentication token.
 * @returns {string} - The authentication token.
 */
const generateAuthToken = async () => {
  const token = await crypt.hash(Math.random().toString())
  return token
}

/**
 * Login and generate a token for the provided user.
 * @param {Object} user - The user object.
 * @returns {Promise<string>} - The generated authentication token.
 * @throws {Error} - If failed to generate token.
 */
const login = async (user) => {
  try {
    console.log("Logging in user:", user.email)
    const token = await generateAuthToken()
    const token_exp = new Date(Date.now() + 60 * 60 * 1000)
    await user.update({ token, token_exp })
    console.log("Token generated for user:", user.email)
    return token
  } catch (error) {
    console.log("Failed to generate token for user:", user.email)
    console.log(error)
    console.log(error)
    throw new Error("Failed to generate token")
  }
}

/**
 * Get a user by token.
 * @param {string} token - The user's token.
 * @return {Promise<Object|null>} - The user object if found and token is not expired, null otherwise.
 */
const readByToken = async (token) => {
  try {
    console.log("Retrieving user by token:", token)

    const user = await db.User.findOne({
      where: {
        token,
      },
    })

    if (!user) {
      console.log("User not found for token:", token)
      throw new Error("User not found for token")
    }

    // Check if the token is expired
    const isTokenExpired = new Date() > user.token_exp
    if (isTokenExpired) {
      console.log("Token has expired for user:", user.email)
      throw new Error("Token has expired for user")
    }

    console.log("User retrieved:", user.get({ plain: true }))
    return user
  } catch (error) {
    console.log("Failed to retrieve user by token:", token)
    throw new Error("Failed to retrieve user")
  }
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
