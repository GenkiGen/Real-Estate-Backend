const Advertisement = require('../models/advertisement.model')
const Project = require("../models/project.model")
const errorHelper = require('../helpers/errorHelper')
const sortHelper = require('../helpers/filtertHelper')
const User = require('../models/user.model')
const mongoose = require('mongoose')

//Pagination
const PER_PAGE = 5

function createAdvertisement(req, resp) {
  const newAd = new Advertisement({
    title: req.body.title,
    price: req.body.price, 
    size: req.body.size,
    totalBedrooms: req.body.totalBedrooms,
    totalFloors: req.body.totalFloors,
    direction: req.body.direction,
    contact: {
      name: req.body.ownerName,
      phone: req.body.ownerPhone
    },
    address: {
      street: req.body.street,
      district: req.body.district,
      city: req.body.city
    },
    expDate: req.body.expDate,
    userId: req.body.userId
  })

  newAd.save((error, ad) => {
    if (error)  return resp.status(301).json({
      message: errorHelper.stringify(error),
      data: null
    })
    User.findById(req.body.userId, (error, user) => {
      if (error)  return resp.status(301).json({
        message: errorHelper.stringify(error),
        data: null
      })

      user.advertisements.push(ad)
      user.save((error, success) => {
        if (error)  return resp.status(301).json({
          message: errorHelper.stringify(error),
          data: null
        })
        resp.json({
          message: "New advers has been added",
          data: ad
        })
      })
    })
  })
}

function updateAdvertisement(req, resp, next) {
  Advertisement.findByIdAndUpdate(req.body._id, {
    title: req.body.title,
    price: req.body.price, 
    size: req.body.size,
    totalBedrooms: req.body.totalBedrooms,
    totalFloors: req.body.totalFloors,
    direction: req.body.direction,
    contact: {
      name: req.body.ownerName,
      phone: req.body.ownerPhone
    },
    address: {
      street: req.body.street,
      district: req.body.district,
      city: req.body.city
    },
    expDate: req.body.expDate,
    userId: req.body.userId
  }, 
  { runValidators: true },
  (error, res) => {
    if (error)  return resp.status(301).json({
      data: null,
      message: errorHelper.stringify(error)
    })
    resp.json({
      message: "Advertisement updated",
      data: res
    })
  })
}

function getOwnAdverstisement(req, resp, next) {
  const page = req.query.p ? parseInt(req.query.p) : 0
  Advertisement.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(req.body.userId) }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        advertisements: { $push: '$$ROOT' }
      }
    },
    {
      $project: {
        total: 1,
        advertisements: { $slice: ['$advertisements', page * PER_PAGE, PER_PAGE] }
      }
    }
  ])
  .exec((error, results) => {
    if (error)  return next(error)
    resp.json({
      message: 'Operation successful',
      data: {
        total: results[0] ? results[0].total : 0,
        page,
        advertisements: results[0] ? results[0].advertisements : []
      }
    })
  })
}

function getOneAdvertisement(req, resp) {
  Advertisement.findById(req.params.id, (error, ad) => {
    if (error) return resp.status(500).json({
      message: error.toString(),
      data: null
    })
    if (!ad) return resp.status(400).json({
      message: 'Ad does not exist',
      data: null
    })
    resp.json({
      message: 'Operation success',
      data: ad
    })
  })
}

function deleteAdvertisement(req, resp, next) {
  //Delete from advertisement
  Advertisement.findByIdAndRemove(req.body._id, (error, ad) => {
    if (error)  return next(error)
    //Remove from User
    User.removeAdvertisement(req.body.userId, req.body._id, (err, success) => {
      if (err)  return next(err)
      //Remove from project
      if (ad.projectId) {
        Project.removeAdvertisement(ad.projectId, ad._id, (error, succ) => {
          if (error)  return next(err)
          resp.json({
            message: 'Advertisement deleted',
            data: success
          })
        })
      } else {
        resp.json({
          message: 'Advertisement deleted',
          data: success
        })
      }
    })
  })
}

function getAdvertisements(req, resp, next) {
  const page = req.query.p ? parseInt(req.query.p) : 0
  const sortCred = sortHelper.getSortObject(req, resp)
  const filterCred = sortHelper.getFilterObject(req, resp)
  Advertisement.aggregate([
    {
      $match: filterCred
    },
    {
      $sort: sortCred
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        advertisements: { $push: '$$ROOT' }
      }
    },
    {
      $project: {
        total: 1,
        advertisements: 
        { 
          $slice: ['$advertisements', page * PER_PAGE, PER_PAGE]
        }
      }
    }
  ])
  .exec((error, results) => {
    if (error)  return next(error)
    if (results.length > 0) {
      resp.json({
        message: 'Operation successful',
        data: {
          total: results[0].total,
          page,
          advertisements: results[0].advertisements
        }
      })
    } else {
      resp.json({
        message: 'Operation successful',
        data: {
          total: 0,
          page,
          advertisements: []
        }
      })
    }
  })
}

module.exports = {
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  getAdvertisements,
  getOwnAdverstisement,
  getOneAdvertisement
}