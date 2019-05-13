const { authenticateUser } = require('../middlewares/auth')
const controller = require('../controllers/project.controller')
const Project = require('../models/project.model')
const Advertisement = require('../models/advertisement.model')

function isProjectOwner(req, resp, next) {
  Project.findById(req.params.id, (error, proj) => {
    if (error)  {
      if (error.name === 'CastError')
        return resp.status(400).json({
          message: 'Invalid project id',
          data: null
        })
      return next(error)
    }
    if (!proj)    return resp.status(301).json({
      message: 'Project does not exist',
      data: null
    })
    if (proj.userId.toString() === req.body.userId.toString()) {
      req.proj = proj
      next()
    } else {
      resp.status(301).json({
        message: 'Operation failed: Not project owner',
        data: null
      })
    }
  })
}

function isAdOwner(req, resp, next) {
  Advertisement.findById(req.body.adId, (error, ad) => {
    if (error)  {
      if (error.name === 'CastError')
        return resp.status(400).json({
          message: 'Invalid advertisement id',
          data: null
        })
      return next(error)
    }
    if (!ad) return resp.status(301).json({
      message: 'Ad does not exist',
      data: null
    })
    if (ad.userId.toString() === req.body.userId.toString()) {
      req.ad = ad
      next()
    } else {
      resp.status(301).json({
        message: 'Operation failed: Not adverse owner',
        data: null
      })
    }
  })
}

module.exports = function(app) {
  app.post('/projects', authenticateUser, controller.createProject),
  app.get('/projects/me', authenticateUser, controller.getOwnProjects),
  app.post('/projects/:id/addAdvertisement', authenticateUser, isProjectOwner, isAdOwner, controller.addAdvertisementToProject),
  app.delete('/projects/:id/removeAdvertisement', authenticateUser, isProjectOwner, isAdOwner, controller.removeAdFromProject),
  app.delete('/projects/:id', authenticateUser, isProjectOwner, controller.deleteProject)
  app.get('/projects/:id', authenticateUser, controller.getOneProject)
  app.put('/projects/:id', controller.updateProject)
}