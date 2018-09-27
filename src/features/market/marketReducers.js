import { NEW_AUCTIONS_RECEIVED, MARKETPLACE_WAS_FILTERED, FETCH_NEW_AUCTIONS_SUCCEEDED, FETCH_NEW_AUCTIONS_FAILED, FETCH_NEW_AUCTIONS_BEGUN} from './marketConstants'
import {NEW_AUCTION_CREATED} from '../items/itemConstants'

export const  marketReducer = (state = [] , action) => {
    
    if (action.type === NEW_AUCTIONS_RECEIVED){
        return action.payload
    }

    if (action.type === NEW_AUCTION_CREATED){
        return [...state, action.payload]
    }

    if (action.type === NEW_AUCTION_CREATED){
        return [...state, action.payload]
    }

    if (action.type === MARKETPLACE_WAS_FILTERED){
        return action.payload
    }

    return state
    
}


// @dev The reducer above was one of teh first reducers I created and I shaped it as an array by MediaStreamTrackEvent, which means I couldn't extend it. Henc eteh extra reducer below, shaped as an object
const initialState = {
    loading: false, 
    error: false
}

export const marketActionsReducer = (state = initialState , action) => {
   

    if (action.type === FETCH_NEW_AUCTIONS_SUCCEEDED){
        return {...state, loading: false, error: false}
    }

    if (action.type === FETCH_NEW_AUCTIONS_FAILED){
        return {...state, loading: false, error: true}
    }

    if (action.type === FETCH_NEW_AUCTIONS_BEGUN){
        return {...state, loading: true, error: false}
    }

    return state
    
}