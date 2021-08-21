const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

//新增todo頁面
router.get('/new', (req, res) => {
  res.render('new')
})
//新增todo
router.post('/', (req, res) => {
  const { name } = req.body
  Todo.create({ name, UserId: req.user.id })
  res.redirect('/')
})
//刪除todo
router.delete('/:id', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  Todo.findOne({ where: { UserId, id } })
    .then(todo => todo.destroy())
    .then(() => res.redirect('/'))
})
//進入編輯頁
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  Todo.findOne({ where: { id, UserId } })
    .then(todo => res.render('edit', { todo: todo.toJSON() }))
})
// 編輯todo
router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name } = req.body
  const isDone = req.body.isDone ? true : false
  const UserId = req.user.id
  Todo.findOne({ where: { id, UserId } })
    .then(todo => {
      todo.name = name
      todo.isDone = isDone
      todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(err => console.log(err))
})

//詳細頁
router.get('/:id', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  return Todo.findOne({ where: { id, UserId } })
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(err => console.log(err))
})

module.exports = router