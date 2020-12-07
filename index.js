const express = require('express')
const expressFileUpload = require('express-fileupload')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 80

// Server configuration
app.enable('trust proxy')
app.disable('x-powered-by')
app.use(expressFileUpload({ useTempFiles : true }))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan('common'))
app.use(cors())

// Route management
const Routes = require('./routes')
Routes.initialize(app)

// Global middleware express
app.use('*', function (req, res) {
  return res.redirect(301, 'https://google.com')
})

app.listen(port, () => console.log(`Sever running on port ${port}!`))