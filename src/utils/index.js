import * as dotenv from 'dotenv';
dotenv.config();

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

const setCookie = (name,value,days) => {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

const getCookie = (name) => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

const eraseCookie = (name) => {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const removeCookieIfExists = (name) => {
    if(getCookie(name)){
        eraseCookie(name)
    }
}

const msg = (message) => {
    return { message }
}

const errmsg = (message) => {
    return msg(message)
}

export {
    checkToken, setCookie, getCookie, eraseCookie, removeCookieIfExists, msg, errmsg
}