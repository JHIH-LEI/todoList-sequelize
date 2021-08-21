module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    console.log('請先登陸在使用')
    res.redirect('/users/login')
  }
}