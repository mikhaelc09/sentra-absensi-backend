import express from 'express'
import { getKaryawan, changePassword, getUser } from '../controllers/UserController.js'
import { checkToken } from '../utils/index.js'

const userRoute = express.Router()

userRoute.get('/current-user', checkToken, getUser)
userRoute.get('/', checkToken, getKaryawan)
userRoute.post('/change-password', checkToken, changePassword)

export default userRoute