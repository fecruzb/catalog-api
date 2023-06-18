const gpt = require("../../gpt/api")
const sharp = require("sharp")

module.exports = async (req, res) => {
  const { prompt } = req.query
  try {
    const image = await gpt.image(prompt)

    const imageBuffer = Buffer.from(image, "base64")

    const pngBuffer = await sharp(imageBuffer).png().toBuffer()

    res.setHeader("Content-Type", "image/png")
    res.setHeader("Content-Disposition", "attachment; filename=image.png")

    res.send(200, pngBuffer)
  } catch (error) {
    res.send(500, error)
  }
}
