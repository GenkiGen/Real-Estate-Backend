const User = require('../models/user.model')
const jwt = require('jsonwebtoken')

function createUser(req, resp) {
  const newUser = new User(req.body)
  newUser.save((error, user) => {
    if (error)  return resp.status(402).json({
      message: "Registration failed",
      data: {
        error
      }
    })
    //Provided an access token upon sign up
    const accessToken = jwt.sign({ userId: user._id, }, req.app.get('secret'), { expiresIn: "2h" })
    resp.json({
      message: 'Successfully create user',
      data: {
        name: user.name,
        userId: user._id,
        createdAt: user.createdAt,
        accessToken
      }
    })
  })
}

function getOwnProfile(req, resp, next) {
  User.findById(req.body.userId, (error, user) => {
    if (error)  return next(error)
    resp.json({
      message: "Operation Succeeded",
      data: {
        name: user.name,
        createdAt: user.createdAt,
        _id: user._id
      }
    })
  })
}

function authenticateUser(req, resp, next) {
  User.findOne({ name: req.body.name }, (userError, user) => {
    if (userError)  return next(userError)
    if (!user)      return resp.status(401).json({
      status: 'Failed',
      message: 'Invalid combination',
      data: null
    })
    user.authenticate(req.body.password, (passError, result) => {
      if (passError)  return next(passError)
      if (!result)    return resp.status(401).json({
        status: 'Failed',
        message: 'Invalid combination',
        data: null
      })
      const accessToken = jwt.sign({ userId: user._id, expiresIn: new Date().getTime() + 7200000 }, req.app.get('secret'), { expiresIn: "2h" })
      resp.json({
        status: 'Success',
        message: 'Valid login credential',
        data: {
          accessToken,
          name: user.name,
          userId: user._id
        }
      })
    })
  })
}

module.exports = {
  createUser,
  authenticateUser,
  getOwnProfile
}