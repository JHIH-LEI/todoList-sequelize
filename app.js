const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')

const PORT = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'test',
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

//主頁
app.get('/', (req, res) => {
  res.send('hi')
})

//登陸頁
app.get('/users/login', (req, res) => {
  res.render('login')
})

//請求登陸
app.post('/users/login', (req, res) => {
  res.send('login')
})
//註冊頁
app.get('/users/register', (req, res) => {
  res.render('register')
})

//請求註冊
app.post('/users/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.create({ name, email, password })
    .then(user => res.redirect('/'))
})

//登出
app.get('/users/logout', (req, res) => {
  res.send('logout')
})

app.listen(PORT, () => {
  console.log(`express is running on http://localhost:${PORT}`)
})