const msg = (message) => {
    return { message }
}

const errmsg = (message) => {
    return msg(message)
}

export {
    msg, errmsg
}