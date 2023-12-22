import { LocalStorage } from 'node-localstorage'

let localStorage = new LocalStorage('./scratch')

const getLocalStorage = () => {
    return localStorage
}

export {getLocalStorage}