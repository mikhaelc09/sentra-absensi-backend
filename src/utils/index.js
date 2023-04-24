import * as dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken'

const checkToken = (req, res, next) => {
    let token = req.headers['x-auth-token']
    if (!token) {
        return res.status(401).send('Unauthorized')
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        next()
    } catch (err) {
        return res.status(400).send('Invalid API Key')
    }
}

const msg = (message) => {
    return { message }
}

const errmsg = (message) => {
    return msg(message)
}

export {
    checkToken, msg, errmsg
}