const controller = require('../controllers/user.controller')
const { authenticateUser } = require('../middlewares/auth')

module.exports = function route(app) {
  app.post('/users', controller.createUser)
  app.post('/authenticate', controller.authenticateUser),
  app.get('/users/me', authenticateUser, controller.getOwnProfile)
}