const express = require('express')
const router = express.Router()

router.post('/image', async (req, res) => {
  try {
    return res.send('Hello world!')
  } catch (err) {
    return res.json({ success: false, message: err.message })
  }
})

module.exports = router