const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const hashRound = 10

const UserSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  advertisements: [{ type: Schema.Types.ObjectId, ref: 'advertisement' }],
  projects: [{ type: Schema.Types.ObjectId, ref: 'project' }]
})

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, hashRound, (error, encrypted) => {
      if (error)  return next(error)
      this.password = encrypted
      next()
    })
  } else {
    next()
  }
})

UserSchema.methods.authenticate = function(plainTextPassword, callback) {
  bcrypt.compare(plainTextPassword, this.password, (err, res) => {
    if (err)  return callback(err)
    callback(null, res)
  })
} 

UserSchema.statics.removeAdvertisement = function(userId, adId, done) {
  this.model('user').update({ _id: userId, }, {
    $pull: { advertisements: adId } 
  }, (error, success) => {
    done(error, success)
  })
}

UserSchema.statics.removeProject = function(userId, projectId, done) {
  this.model('user').update({ _id: userId }, {
    $pull: { projects: projectId }
  }, (err, user) => {
    if (err)  return done(err)
    done(null, user)
  })
}

module.exports = mongoose.model('user', UserSchema)