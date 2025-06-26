import { userService } from "../../services/user.service.js"

export const SET_USER = 'SET_USER'
export const UPDATE_USER = 'UPDATE_USER'

const initialState = {
    loggedInUser: userService.getLoggedinUser(),
}

export function userReducer(state = initialState, cmd){
    switch(cmd.type){
        //users:
        case SET_USER:
            return {...state, loggedInUser: cmd.user}
        case UPDATE_USER:
            return {...state, loggedInUser: {...cmd.user}}
        default: return state
    }
}