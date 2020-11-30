require('dotenv').config()
const mongoose = require('mongoose')
const URL = process.env.DB_URI


mongoose.Promise = global.Promise

mongoose.connect(URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log(`MongoDB connected`)
  })
  .catch((err) => {
    console.log('Failed to connect to MongoDB:', err)
  })

module.exports = mongoose 