const express = require('express')
const router = express.Router()
const db = require('../../models')
const User = db.User
const passport = require('passport')
const bcrypt = require('bcryptjs')
//登陸頁
router.get('/login', (req, res) => {
  res.render('login')
})

//請求登陸
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}));

//註冊頁
router.get('/register', (req, res) => {
  res.render('register')
})

//請求註冊
router.post('/register', (req, res) => {
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
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router