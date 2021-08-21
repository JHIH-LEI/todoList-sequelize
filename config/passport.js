const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook')
const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
  // 登陸策略
  passport.use(new LocalStrategy({ usernameField: 'email' },
    (email, password, done) => {
      User.findOne({ where: { email } })
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'This email is not registered!' })
          }
          return bcrypt.compare(password, user.password)
            .then(isMatch => {
              if (!isMatch) {
                return done(null, false, { message: 'Email or password incorrect.' })
              }
              return done(null, user)
            })
        })
        .catch(err => done(err, false))
    }
  ));

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_APP_CALLBACK,
    profileFields: ['email', 'displayName']
  },
    (accessToken, refreshToken, profile, done) => {
      const { email, name } = profile_json
      User.findOne({ where: { email } })
        .then(user => {
          if (user) {
            return done(null, user)
          }
          const randomPassword = Math.random().toString(36).slice(-8)
          return bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(randomPassword, salt))
            .then(hash => {
              User.create({ email, name, password: hash })
            })
            .then(user => done(null, user))
            .catch(err => done(err, false))
        })
    }
  ));
  // 反/序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then(user => {
        user = user.toJSON() //user很容易被傳到前端樣板做使用，所以要先轉成plain object
        done(null, user)
      })
      .catch(err => done(err, false))
  })
}