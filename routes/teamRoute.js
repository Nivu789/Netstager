const express = require('express')
const teamRouter = express.Router()
const teamController = require('../controllers/teamController')
const adminAuth = require('../middlewares/adminAuth')
const userAuth = require('../middlewares/userAuth')
const teamAuth = require('../middlewares/teamAuth')

teamRouter.post('/',adminAuth,teamController.createTeam)

teamRouter.get('/',adminAuth,teamController.getTeams)

teamRouter.post('/:teamId/tasks',adminAuth,teamController.assignTask)

teamRouter.get('/:teamId/tasks',userAuth,teamAuth,teamController.getTasks)

teamRouter.patch('/:teamId/tasks',userAuth,teamAuth,teamController.updateTaskStatus)

module.exports = teamRouter