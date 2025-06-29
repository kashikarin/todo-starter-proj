import { storageService } from "./async-storage.service.js"


export const userService = {
    getLoggedinUser,
    login,
    logout,
    updateUser,
    addActivity,
    changeBalance,
    signup,
    getById,
    query,
    getEmptyCredentials
}
const STORAGE_KEY_LOGGEDIN = 'user'
const STORAGE_KEY = 'userDB'

function query() {
    return storageService.query(STORAGE_KEY)
}

function getById(userId) {
    return storageService.get(STORAGE_KEY, userId)
}

function login({ username, password }) {
    return storageService.query(STORAGE_KEY)
        .then(users => {
            const user = users.find(user => user.username === username)
            if (user) return _setLoggedinUser(user)
            else return Promise.reject('Invalid login')
        })
} 

function signup({ username, password, fullname }) {
    const user = { username, password, fullname, balance: 0, prefs: {color: '', bgColor: ''}, activities: [] }
    user.createdAt = user.updatedAt = Date.now()

    return storageService.post(STORAGE_KEY, user)
        .then(_setLoggedinUser)
}

function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
    return Promise.resolve()
}

function updateUser(user){
    return storageService.put(STORAGE_KEY, user)
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function addActivity(txt){
    const activity = {
        txt,
        at: Date.now()
    }
   
    const loggedInUser = getLoggedinUser()
    if (!loggedInUser) return Promise.reject('no logged in user')
    return getById(loggedInUser._id)
        .then(user => {
            if (!user.activities) user.activities = []
            user.activities.unshift(activity)
            return user
        })
        .then(userToSave => {
            return storageService.put(STORAGE_KEY, userToSave)
                .then(savedUser => {
                    _setLoggedinUser(savedUser)
                    return savedUser
                })})
                
}

function changeBalance(addition){
    const loggedInUser = getLoggedinUser()
    if (!loggedInUser) return Promise.reject('no logged in user')
    return getById(loggedInUser._id)
        .then(user => {
            user.balance += addition
            return storageService.put(STORAGE_KEY, user)
                .then(savedUser => {
                    _setLoggedinUser(savedUser)
                    return savedUser.balance
                })
        })
        .catch(err => {
            console.error('failed to update credit', err)
            throw err
        })
}


function _setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname, balance: user.balance, activities: user.activities, prefs: user.prefs }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
    return userToSave
}

function getEmptyCredentials() {
    return {
        fullname: '',
        username: 'muki',
        password: 'muki1',
    }
}


// signup({username: 'muki', password: 'muki1', fullname: 'Muki Ja'})
// login({username: 'muki', password: 'muki1'})

// Data Model:
// const user = {
//     _id: "KAtTl",
//     username: "muki",
//     password: "muki1",
//     fullname: "Muki Ja",
//     createdAt: 1711490430252,
//     updatedAt: 1711490430999
// }