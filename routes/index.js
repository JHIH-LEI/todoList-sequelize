const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const user = require('./modules/users')
const todo = require('./modules/todos')
const { authenticator } = require('../middleware/auth')

router.use('/todos', authenticator, todo)
router.use('/users', user)
router.use('/', authenticator, home)

module.exports = router