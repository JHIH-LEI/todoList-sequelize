const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const bcrypt = require('bcryptjs')
const usePassport = require('./config/passport')
const passport = require('passport')
const { authenticator } = require('./middleware/auth')

const PORT = 3000
const db = require('./models')
const user = require('./models/user')
const todo = require('./models/todo')
const Todo = db.Todo
const User = db.User

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'test',
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
usePassport(app)
//主頁
app.get('/', authenticator, (req, res) => {
  return Todo.findAll({
    raw: true,
    nest: true,
    where: { UserId: req.user.id }
  })
    .then((todos) => { return res.render('index', { todos: todos }) })
    .catch((error) => { return res.status(422).json(error) })
})
//新增todo頁面
app.get('/todos/new', (req, res) => {
  res.render('new')
})
//新增todo
app.post('/todos', (req, res) => {
  const { name } = req.body
  Todo.create({ name, UserId: req.user.id })
  res.redirect('/')
})
//刪除todo
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  Todo.findOne({ where: { UserId, id } })
    .then(todo => todo.destroy())
    .then(() => res.redirect('/'))
})
//進入編輯頁
app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  Todo.findOne({ where: { id, UserId } })
    .then(todo => res.render('edit', { todo: todo.toJSON() }))
})
// 編輯todo
app.put('/todos/:id', (req, res) => {
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
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  return Todo.findOne({ where: { id, UserId } })
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(err => console.log(err))
})

//登陸頁
app.get('/users/login', (req, res) => {
  res.render('login')
})

//請求登陸
app.post('/users/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}));
//註冊頁
app.get('/users/register', (req, res) => {
  res.render('register')
})

//請求註冊
app.post('/users/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        console.log('此email已被註冊！')
        return res.render('register', { name, email, password, confirmPassword })
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
          User.create({ name, email, password: hash })
        })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    })
})

//登出
app.get('/users/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`express is running on http://localhost:${PORT}`)
})