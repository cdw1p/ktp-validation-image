const express = require('express')
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')
const tesseract = require('node-tesseract-ocr')
const router = express.Router()

router.post('/image', async (req, res) => {
  try {
    if (req.files && req.files.images) {
      const tempFile = req.files.images.tempFilePath
      const tempFilename = `./tmp/${path.basename(tempFile)}.jpeg`
      const convertToBW = await sharp(tempFile).greyscale().toFile(tempFilename)
      if (convertToBW) {
        const resOCR = await tesseract.recognize(tempFilename, { lang: 'eng', oem: 1, psm: 3 })
        const cleanResOCR = resOCR.trim()
        // Delete temp images
        Promise.all([ fs.unlinkSync(tempFile), fs.unlinkSync(tempFilename) ])

        if (await cleanResOCR.match(/NIK/gim) !== null) {
          const splitResNama = cleanResOCR.split('Nama ')[1]
          if (splitResNama) {
            const resNama = splitResNama.match(/=/g) !== null ? splitResNama.replace(/[^a-zA-Z ]/g, '') : splitResNama.split(': ')[1].split(/\r\n/gi)[0]
            const resNIK = cleanResOCR.split('NIK ')[1].split('= ')[1].substr(0, 16)
            const normalizeData = { resNama, resNIK }
            return res.json({ success: true, message: normalizeData })
          } else {
            return res.json({ success: false, message: 'Field\'s parsing is not valid.', rawData: cleanResOCR })
          }
        } else {
          return res.json({ success: false, message: 'Field\'s parsing is not valid.', rawData: cleanResOCR })
        }
      } else {
        return res.json({ success: false, message: 'Error while processing image.' })
      }
    } else {
      return res.json({ success: false, message: 'Params `images` is does\'t exists.' })
    }
  } catch (err) {
    return res.json({ success: false, message: err.message })
  }
})

module.exports = router