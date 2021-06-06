const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = express.Router()

// create task
router.post('/tasks', auth, async (req, res) => {
  const newTask = new Task({
    ...req.body,
    owner: req.user._id,
  })

  try {
    await newTask.save()

    res.status(201).send({
      result: newTask,
    })
  } catch (error) {
    res.send({
      error,
    })
  }
})

// get all tasks
router.get('/tasks', auth, async (req, res) => {
  try {
    await req.user.populate('tasks').execPopulate()

    res.status(200).send({
      result: req.user.tasks,
    })
  } catch (error) {
    res.send({
      error,
    })
  }
})

// get a particular task
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const task = await Task.findOne({ _id, owner: req.user._id })
    if (!task) {
      return res.status(404).send({
        result: 'No such task is created.',
      })
    }

    res.status(200).send({
      result: task,
    })
  } catch (error) {
    res.send({
      error,
    })
  }
})

// update a task
router.patch('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  const requestedUpdates = Object.keys(req.body)
  const allowedUpdates = ['title', 'completed']
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
    const task = await Task.findOne({ _id, owner: req.user._id })

    if (!task) {
      return res.status(404).send({
        result: 'No such task is created',
      })
    }

    requestedUpdates.forEach((requestedUpdate) => {
      task[requestedUpdate] = req.body[requestedUpdate]
    })
    await task.save()

    res.send({
      result: task,
    })
  } catch (error) {
    res.send({
      error,
    })
  }
})

// delete all tasks
router.delete('/tasks', auth, async (req, res) => {
  try {
    const result = await Task.deleteMany({ owner: req.user._id })
    res.status(200).send({
      result: `${result.deletedCount} tasks deleted successfully`,
    })
  } catch (error) {
    res.send({
      error,
    })
  }
})

// delete a particular task
router.delete('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id })

    if (!task) {
      return res.status(404).send({
        error: 'No such task is created',
      })
    }

    res.status(200).send({
      result: 'Task deleted successfully',
    })
  } catch (error) {
    res.send({
      error,
    })
  }
})

module.exports = router
