const express = require('express')
const cors = require('cors')
require('./db/mongoose')
const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(taskRouter)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
