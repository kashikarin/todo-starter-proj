import { userService } from "../../services/user.service.js"

export const SET_USER = 'SET_USER'
export const SET_USER_BALANCE = 'SET_USER_BALANCE'

const initialState = {
    loggedInUser: userService.getLoggedinUser(),
}

export function userReducer(state = initialState, cmd){
    switch(cmd.type){
        //users:
        case SET_USER:
            return {...state, loggedInUser: cmd.user}
        case SET_USER_BALANCE:
            return {...state, loggedInUser: {...state.loggedInUser, balance: cmd.balance}}
        default: return state
    }
}