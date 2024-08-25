const express = require('express')
const userRouter = express.Router()

const userController = require('../controllers/userContoller')

userRouter.post('/register',userController.registerUser)

userRouter.get('/verify-email',userController.verifyEmail)

userRouter.post('/login',userController.loginUser)

userRouter.post('/refresh-token',userController.refreshToken)


module.exports = userRouter