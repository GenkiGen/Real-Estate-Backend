const jwt = require('jsonwebtoken')
const Advertisement = require('../models/advertisement.model')

function authenticateUser(req, resp, next) {
  const token = req.header('x-access-token')
  if (!token) {
    return resp.status(301).json({
      message: "No access token provided",
      data: null
    })
  }
  
  try {
    const result = jwt.verify(token, req.app.get('secret'))
    if (result) {
      req.body.userId = result.userId
      next()
    } else {
      resp.status(400).json({
        message: 'Please provide a valid access token',
        data: null
      }).end()
    }
  } catch(error) {
    resp.status(302).json({
      message: error.toString(),
      data: null
    })
  }
}

function isAdOwner(req, resp, next) {
  Advertisement.findById(req.body._id, (error, ad) => {
    if (error)  return next(error)
    if (!ad)    return resp.status(301).json({
      message: 'Ad does not exist',
      data: null
    })
    if (ad.userId.toString() === req.body.userId.toString()) {
      next()
    } else {
      resp.status(301).json({
        message: 'Operation failed: Not adverse owner',
        data: null
      })
    }
  })
}


module.exports = {
  isAdOwner,
  authenticateUser
}
