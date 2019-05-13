const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AdvertisementSchema = new Schema({
  title: { type: String, required: true },
  price: { 
    type: Number, 
    required: true,
    validate: {
      validator: function(value) {
        return value > 0
      },
      message: () => 'Price must be positive'
    }
  },
  size: { 
    type: Number, 
    required: true, 
    validate: {
      validator: function(value) {
        return value > 0
      },
      message: () => 'Size must be positive'
    },
  },
  totalBedrooms: { 
    type: Number, 
    required: true,
    validate: {
      validator: function(value) {
        return Number.isInteger(value) && value > 0
      },
      message: 'Total bedrooms must be a positive integer'
    } 
  },
  totalFloors: { 
    type: Number, 
    required: true,
    validate: {
      validator: function(value) {
        return Number.isInteger(value) && value > 0
      },
      message: 'Total floors must be a positive integer'
    }  
  },
  direction: { 
    type: String, 
    enum: ['North', 'East', 'South', 'West'],
    default: 'South',
    required: true
  },
  contact: {
    name: { type: String, required: true },
    phone: { type: String, require: true }
  },
  address: {
    street: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true }
  },
  postDate: { type: Date, required: true, default: Date.now},
  expDate: 
  { 
    type: Date, 
    required: true,
    validate: {
      validator: function(value) {
        return value > Date.now()
      },
      message: date => `${date} must be after post date`
    }
  },
  userId: { type: Schema.Types.ObjectId, ref: 'user' },
  projectId: { type: Schema.Types.ObjectId, ref: 'project'}
})

module.exports = mongoose.model('advertisement', AdvertisementSchema)