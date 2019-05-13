const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProjectSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  ownerName: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['House', 'Land', 'Apartment'], required: true },
  size: { 
    type: Number,
    validate: {
      validator: function(value) {
        return value > 0
      },
      message: 'Size must be a positive number'
    }
  },
  startYear: {
    type: Number,
    validate: {
      validator: function(value) {
        return value > 1900 && Number.isInteger(value)
      },
      message: 'Year must be a positive integer and larger than 1900'
    }
  },
  endYear: {
    type: Number,
    validate: {
      validator: function(value) {
        return value > 1900 && Number.isInteger(value)
      },
      message: 'Year must be a positive integer and larger than 1900'
    }
  },
  advertisements: [{type: Schema.Types.ObjectId, ref: 'advertisement'}]
})

ProjectSchema.pre('validate', function(next) {
  if (this.startYear > this.endYear)
    next(new Error('Start year must come before end year'))
  else
    next()
})

ProjectSchema.statics.removeAdvertisement = function(projectId, adId, done) {
  this.model('project').update(
    { _id: projectId },
    { $pull: { advertisements: adId }},
    (error, success) => done(error, success))
}

module.exports = mongoose.model('project', ProjectSchema)