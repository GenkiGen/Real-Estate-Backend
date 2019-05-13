const Project = require('../models/project.model')
const errorHelper = require('../helpers/errorHelper')
const mongoose = require('mongoose')
const User = require('../models/user.model')
//Pagination
const PER_PAGE = 5

function createProject(req, resp) {
  const project = new Project({
    title: req.body.title,
    ownerName: req.body.ownerName,
    userId: req.body.userId,
    type: req.body.type,
    size: req.body.size,
    startYear: req.body.startYear,
    endYear: req.body.endYear
  })

  project.save((error, proj) => {
    if (error)  return resp.status(301).json({
      message: errorHelper.stringify(error),
      data: null
    })
    User.findById(req.body.userId, (err, user) => {
      if (err)  return resp.status(301).json({
        message: errorHelper.stringify(err),
        data: null
      })
      if(!user) return resp.status(301).json({
        message: 'User does not exist',
        data: null
      })
      user.projects.push(proj)
      user.save((error, success) => {
        if (error)  return resp.status(301).json({
          message: errorHelper.stringify(error),
          data: null
        })
        resp.json({
          message: "New Project has been added",
          data: proj
        })
      })
    })
  })
}

function getOwnProjects(req, resp) {
  // User.findById(req.body.userId)
  //     .populate('projects')
  //     .exec((error, result) => {
  //       if (error)  return resp.status(500).json({
  //         message: error.toString(),
  //         data: null
  //       })
  //       resp.json({
  //         message: 'Operation success',
  //         data: result.projects
  //       })
  //     })
  //Calculate pagination
  let page = parseInt(req.query.page)
  page = isNaN(page) ? 0 : page
  Project.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(req.body.userId) } },
    { $group: { _id: null, total: { $sum: 1 }, projects: { $push: '$$ROOT' }} },
    { $project: { _id: 0, total: 1, projects: { $slice: ['$projects', PER_PAGE * page, PER_PAGE] }}}
  ])
  .exec((err, results) => {
    if (err)  return resp.status(500).json({
      message: error.toString(),
      data: null
    })

    resp.json({
      message: 'Operation success',
      data: results.length > 0 ? results[0] : {
        total: 0,
        projects: []
      }
    })
  })
}

function getOneProject(req, resp) {
  Project.findById(req.params.id, (err, proj) => {
    if (err)  return resp.status(400).json({
      message: 'Can not find project',
      data: null
    })
    resp.json({
      message: 'Operation successful',
      data: proj
    })
  })
}

function deleteProject(req, resp) {
  Project.findByIdAndRemove(req.params.id, (err, proj) => {
    if (err)  return resp.status(500).json({
      message: 'Operation failed',
      data: err
    })
    User.removeProject(proj.userId, proj._id, (err, success) => {
      if (err)  return resp.status(500).json({
        message: 'Operation failed',
        data: err
      })
      resp.json({
        message: 'Operation success',
        data: null
      })
    })
  })
}

function updateProject(req, resp) {
  Project.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    ownerName: req.body.ownerName,
    type: req.body.type,
    size: req.body.size,
    startYear: req.body.startYear,
    endYear: req.body.endYear
  }, (err, succ) => {
    if (err)  return resp.status(500).json({
      message: 'Operation failed',
      data: err
    })
    resp.json({
      message: 'Operation successful',
      data: err
    })
  })
}

function addAdvertisementToProject(req, resp) {
  // Project.findById(req.params.id, (error, project) => {
  //   if (error)  return resp.status(500).json({
  //     message: error.toString(),
  //     data: null
  //   })
  //   if (!project) return resp.status(400).json({
  //     message: 'Project does not exist',
  //     data: null
  //   })
  //   Advertisement.findById(req.body.adId, (err, ad) => {
  //     if (err)  return resp.status(500).json({
  //       message: error.toString(),
  //       data: null
  //     })
  //     if (!ad) return resp.status(400).json({
  //       message: 'Advertisement does not exist',
  //       data: null
  //     })

  //   })
  // })
  const { ad, proj } = req
  if (ad.projectId) return resp.status(301).json({
    message: 'Advertisement already belongs to a project',
    data: null
  })
  ad.projectId = req.params.id
  ad.save((err, succ) => {
    if (err)  return resp.status(500).json({
      message: error.toString(),
      data: null
    })
    proj.advertisements.push(ad)
    proj.save((err, project) => {
      if (err)  return resp.status(500).json({
        message: error.toString(),
        data: null
      })
      resp.json({
        message: 'Operation Success',
        data: project
      })
    })
  })
}

function removeAdFromProject(req, resp, next) {
  const { ad, proj } = req
  if (ad.projectId && ad.projectId.toString() === proj._id.toString()) {
    //Remove
    ad.projectId = null
    ad.save((error, res) => {
      if (error)  return resp.status(500).json({
        message: error.toString(),
        data: null
      })
      Project.removeAdvertisement(proj._id, ad._id, (err, suc) => {
        if (err)  return resp.status(500).json({
          message: error.toString(),
          data: null
        })
        resp.json({
          message: 'Operation successful',
          data: suc
        })
      })
    })
  } else {
    resp.status(400).json({
      message: 'The advertisement does not belong to this project',
      data: null
    })
  }
}

module.exports = {
  createProject,
  getOwnProjects,
  getOneProject,
  addAdvertisementToProject,
  removeAdFromProject,
  deleteProject,
  updateProject
}