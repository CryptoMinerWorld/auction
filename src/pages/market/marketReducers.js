import { NEW_AUCTIONS_RECEIVED} from './marketConstants'

export default function marketReducer (state = [] , action) {
    
    if (action.type === NEW_AUCTIONS_RECEIVED){
        return action.payload
    }
    
    return state
    
}