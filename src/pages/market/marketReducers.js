import {AUCTION_CREATED, AUCTIONS_REQUESTED} from './marketConstants'

const initialState =  [{
    id: 432,
    minPrice: 1,
    maxPrice: 4,
    price: 2.3,
    deadline: 1537255385592,
    owner: "Crypto beasts",
    grade: 1,
    quality: 2,
    rate: 3
  }]

export default function marketReducer (state = initialState, action) {
    if (action.type === AUCTION_CREATED){
        return [...state, action.payload]
    } 

    if (action.type === AUCTIONS_REQUESTED){
        return action.payload
    } 
    
    return state
    
}