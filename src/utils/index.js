import * as dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken'
import { LocalStorage } from 'node-localstorage';

const localStorage = new LocalStorage('./scratch')

const checkToken = (req, res, next) => {
    let token = req.headers['x-auth-token'] ?? localStorage.getItem('token')

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
    return { message: message }
}

const errmsg = (message) => {
    return msg(message)
}

const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371; // Earth's radius in kilometers
    const deltaLat = lat2 - lat1;
    const deltaLon = lon2 - lon1;
  
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return earthRadius * c;
}

const isWithinRadius = (userLat, userLon, targetLat, targetLon, radius) => {
    const distance = haversineDistance(userLat, userLon, targetLat, targetLon);
    return distance <= radius;
}

export {
    checkToken, msg, errmsg, haversineDistance, isWithinRadius
}