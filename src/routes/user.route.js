import express from 'express'
import { getKaryawan, changePassword } from '../controllers/userController'
import { checkToken } from '../utils'

const userRoute = express.Router()

userRoute.get('/', checkToken, getKaryawan)
userRoute.post('/change-password', checkToken, changePassword)

export default userRoute