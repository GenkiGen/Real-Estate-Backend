const controller = require('../controllers/advertisement.controller')
const { isAdOwner, authenticateUser } = require('../middlewares/auth')

module.exports = function(app) {
  app.get('/advertisements', controller.getAdvertisements)
  app.post('/advertisements', authenticateUser,controller.createAdvertisement)
  app.put('/advertisements', authenticateUser, isAdOwner,controller.updateAdvertisement),
  app.delete('/advertisements', authenticateUser, isAdOwner, controller.deleteAdvertisement),
  app.get('/advertisements/me', authenticateUser, controller.getOwnAdverstisement)
  app.get('/advertisements/:id', authenticateUser, controller.getOneAdvertisement)
}