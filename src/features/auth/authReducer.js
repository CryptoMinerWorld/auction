
import {CURRENT_USER_AVAILABLE, CURRENT_USER_NOT_AVAILABLE, WEB3_AVAILABLE, USER_EXISTS, NEW_USER, NO_USER_EXISTS} from './authConstants'

export default function authReducer (state = { } , action) {

    if (action.type === WEB3_AVAILABLE){
        return {...state, web3: action.payload}
    }
    
    if (action.type === CURRENT_USER_AVAILABLE){
        return {...state, currentUserId: action.payload}
    }
   
    if (action.type ===  CURRENT_USER_NOT_AVAILABLE){
        return {...state, currentUserId: 'META MASK NOT AVAILABLE'}
    }

    if (action.type ===  USER_EXISTS){
        return {...state, user: action.payload, newUser: false, existingUser:true }
    }

    if (action.type ===  NEW_USER){
        return {...state, newUser: true }
    }
    
    if (action.type ===  NO_USER_EXISTS){
        return {...state, existingUser: false }
    }

    return state
    
}