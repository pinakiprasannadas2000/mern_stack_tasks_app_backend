const mongoose = require('mongoose')
const { MONGODB_URI } = require('../config/keys')

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
