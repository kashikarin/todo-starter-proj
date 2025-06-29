import { SET_USER, SET_USER_BALANCE } from "../reducers/user.reducer.js"
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

export function updateUser(updatedUser) {
    return userService.updateUser(updatedUser)
        .then(user => store.dispatch({type: SET_USER, user}))
        .catch(err => {
            console.error('user actions => failed to update user', err)
            throw err
        })
}

export function addActivity(txt){
    return userService.addActivity(txt)
        .then(user => store.dispatch({type: SET_USER, user}))
        .catch(err => {
            console.error('user actions => failed to add activity to the user')
            throw err
        })
}


export function changeUserBalance(addition){
    return userService.changeBalance(addition)
        .then((balance)=> store.dispatch({type: SET_USER_BALANCE, balance}))
        .catch(err => {
            console.error('user actions => failed to credit the user for completing activity')
            throw err
        })
}