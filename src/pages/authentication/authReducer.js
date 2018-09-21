
import {CURRENT_USER_AVAILABLE, CURRENT_USER_NOT_AVAILABLE, WEB3_AVAILABLE, USER_EXISTS} from './authConstants'

export default function marketReducer (state = { } , action) {

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
        return {...state, user: action.payload}
    }

    return state
    
}