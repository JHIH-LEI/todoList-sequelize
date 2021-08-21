const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const usePassport = require('./config/passport')
const flash = require('connect-flash')
const routes = require('./routes') //載入總路由
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const PORT = process.env.PORT

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(flash())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
usePassport(app)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  next()
})
app.use(routes)

app.listen(PORT, () => {
  console.log(`express is running on http://localhost:${PORT}`)
})