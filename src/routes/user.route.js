import express from 'express'
import jwt from 'jsonwebtoken'
import { getKaryawan, changePassword } from '../controllers/userController'

const checkToken = (req, res, next) => {
    let token = req.headers['x-auth-token']
    if (!token) {
        return res.status(400).send('Unauthorized')
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        next()
    } catch (err) {
        return res.status(400).send('Invalid API Key')
    }
}

const router = express.Router()

router.get('/', checkToken, getKaryawan)
router.post('/change-password', checkToken, changePassword)

export default router