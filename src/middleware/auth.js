const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
  try {
    const authToken = req.header('Authorization').replace('Bearer ', '')
    const decodedData = jwt.verify(authToken, 'jgijeij83a3j933ar3tai9ti9a938*U*TU*#*UR#UO3uuruq3rjqiojr93u9rurq3')
    const user = await User.findOne({
      _id: decodedData._id,
      'authTokens.authToken': authToken,
    })

    if (!user) {
      throw new Error()
    }

    req.user = user
    req.authToken = authToken

    next()
  } catch (error) {
    res.status(401).send({
      error: 'Please authenticate',
    })
  }
}

module.exports = auth
