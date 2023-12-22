import * as dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken'
import { getLocalStorage } from "../utils/LocalStorage.js";
let localStorage = getLocalStorage()

const checkToken = (req, res, next) => {
    let token =  localStorage.getItem('token') ?? req.headers['x-auth-token']

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
    const earthRadius = 6371;

    const toRadians = (angle) => (angle * Math.PI) / 180;
    lat1 = toRadians(lat1);
    lon1 = toRadians(lon1);
    lat2 = toRadians(lat2);
    lon2 = toRadians(lon2);

    const deltaLat = lat2 - lat1;
    const deltaLon = lon2 - lon1;
  
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));
  
    return earthRadius * d;
}

const isWithinRadius = (userLat, userLon, targetLat, targetLon, radius) => {
    const distance = haversineDistance(userLat, userLon, targetLat, targetLon);
    console.log(distance)
    return distance <= radius;
}

export {
    checkToken, msg, errmsg, haversineDistance, isWithinRadius
}