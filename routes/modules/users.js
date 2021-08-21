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
  failureRedirect: '/users/login',
  failureFlash: true
}));

//註冊頁
router.get('/register', (req, res) => {
  res.render('register')
})

//請求註冊
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  let errors = []
  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        errors.push({ message: '此email已被註冊！' })
      }
      if (password !== confirmPassword) {
        errors.push({ message: '密碼與確認密碼不符' })
      }
      if (errors.length) {
        return res.render('register', { name, email, password, confirmPassword, errors })
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
          User.create({ name, email, password: hash })
        })
        .then(() => {
          req.flash('success', '註冊成功，登陸後即可解鎖使用功能！')
          res.redirect('/users/login')
        })
        .catch(err => console.log(err))
    })
})

//登出
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', '登出成功')
  res.redirect('/users/login')
});

module.exports = router