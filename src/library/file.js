const fs = require("fs")
const path = require("path")
const { kebabCase } = require("lodash")

const PUBLIC_FOLDER = path.join(__dirname, "../../public")

const slugify = (name) => {
  return kebabCase(name)
}

const exists = (dir) => {
  return fs.existsSync(dir)
}

const createFolder = (dir) => {
  return fs.mkdirSync(dir, { recursive: true })
}

const imageExists = (name, folder = "files") => {
  const filepath = path.join(PUBLIC_FOLDER, folder, `${slugify(name)}.png`)
  return exists(filepath)
}

const saveImage = async (content, name, folder = "files") => {
  const data = content.replace(/^data:image\/\w+;base64,/, "")
  const buffer = Buffer.from(data, "base64")

  const folderpath = path.join(PUBLIC_FOLDER, folder)

  if (!exists(folderpath)) {
    createFolder(folderpath)
  }

  const filepath = path.join(folderpath, `${slugify(name)}.png`)

  if (!exists(filepath)) {
    await fs.promises.writeFile(filepath, buffer)
  }
}

module.exports = {
  slugify,
  saveImage,
  createFolder,
  exists,
  imageExists,
}
