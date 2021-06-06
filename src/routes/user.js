const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = express.Router()

// sign up
router.post('/users/signup', async (req, res) => {
  // console.log(req.body)
  const newUser = new User(req.body)

  try {
    await newUser.save()
    const authToken = await newUser.generateAuthToken()

    res.status(201).send({
      result: newUser,
      authToken,
      status: 'Signed up successfully',
    })
  } catch (error) {
    res.send({
      error,
    })
  }
})

// log in
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const authToken = await user.generateAuthToken()

    res.status(200).send({
      result: user,
      authToken,
      status: 'logged in successfully',
    })
  } catch (error) {
    res.send({
      error,
    })
  }
})

// logout
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.authTokens = req.user.authTokens.filter((authToken) => {
      return authToken.authToken !== req.authToken
    })

    await req.user.save()

    res.status(200).send({
      result: 'Succssfully logged out',
    })
  } catch (error) {
    res.status(500).send(error)
  }
})

// logout from all logged-in sessions
router.post('/users/logout_all', auth, async (req, res) => {
  try {
    req.user.authTokens = []

    await req.user.save()

    res.status(200).send({
      result: 'Succssfully logged out from all sessions',
    })
  } catch (error) {
    res.status(500).send(error)
  }
})

// get profile
router.get('/users/me', auth, async (req, res) => {
  res.status(200).send(req.user)
})

// update profile
router.patch('/users/me', auth, async (req, res) => {
  const requestedUpdates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password']
  const isValidOperation = requestedUpdates.every((requestedUpdate) => {
    if (allowedUpdates.includes(requestedUpdate)) {
      return true
    } else {
      return false
    }
  })

  if (!isValidOperation) {
    return res.send({
      error: 'Invalid updates requested',
    })
  }

  try {
    requestedUpdates.forEach((requestedUpdate) => {
      req.user[requestedUpdate] = req.body[requestedUpdate]
    })
    await req.user.save()

    res.send({
      result: req.user,
    })
  } catch (error) {
    res.send({
      error,
    })
  }
})

// delete profile
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    res.status(200).send({
      result: 'User profile deleted successfully',
      deletedProfile: req.user,
    })
  } catch (error) {
    res.send({
      error,
    })
  }
})

module.exports = router
