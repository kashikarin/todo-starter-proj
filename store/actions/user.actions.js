import { SET_USER } from "../reducers/user.reducer.js"
import { store } from "../store.js"
import { userService } from "../../services/user.service.js"

export function logout() {
    return userService.logout()
        .then(() => store.dispatch({type: SET_USER, user: null}))
        .catch((err) => {
            console.error('user actions => Failed to log out user')
            throw err
        })
}

export function login(credentials) {
    return userService.login(credentials)
        .then(user => store.dispatch({type: SET_USER, user}))
        .catch((err) => {
            console.error('user actions => failed to log in', err)
            throw err
        })
}

export function signup(credentials) {
    return userService.signup(credentials)
        .then((user) => store.dispatch({type: SET_USER, user}))
        .catch((err) => {
            console.error('user actions => failed to signup', err) 
            throw err
         })
}