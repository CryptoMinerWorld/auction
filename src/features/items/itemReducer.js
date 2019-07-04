import {
    AUCTION_DETAILS_RECEIVED,
    AUCTION_OWNER_DATA_RECEIVED,
    CLEAR_GEM_PAGE,
    GEM_AUCTION_DETAILS_RECEIVED,
    GEM_DETAILS_RECEIVED,
    GEM_MINING_DETAILS_RECEIVED,
    GEM_TX_DETAILS_RECEIVED
} from './itemConstants';

export default function auctionReducer(state = {
    dataLoaded: {
        gem: false,
        auction: false,
        mining: false,
        tx: false,
    },
    gem: {}
}, action) {
    if (action.type === AUCTION_DETAILS_RECEIVED) {
        return {...state, ...action.payload};
    }
    if (action.type === AUCTION_OWNER_DATA_RECEIVED) {
        return action.payload;
    }
    if (action.type === CLEAR_GEM_PAGE) {
        return null;
    }

    if (action.type === GEM_DETAILS_RECEIVED) {
        // data from auction should overwrite gem data.
        return {
            ...state,
            dataLoaded: {
              ...state.dataLoaded,
                mining: Number(action.payload.state) === 0,
                gem: true
            },
            gem: {...action.payload, ...state.gem}
        }
    }

    if (action.type === GEM_AUCTION_DETAILS_RECEIVED) {
        // data from auction should overwrite gem data.
        return {
            ...state,
            dataLoaded: {
                ...state.dataLoaded,
                auction: true
            },
            gem: {...state.gem, ...action.payload}
        }
    }

    if (action.type === GEM_MINING_DETAILS_RECEIVED) {
        return {
            ...state,
            dataLoaded: {
                ...state.dataLoaded,
                mining: true
            },
            gem: {...action.payload, ...state.gem}
        }
    }

    if (action.type === GEM_TX_DETAILS_RECEIVED) {
        return {
            ...state,
            dataLoaded: {
                ...state.dataLoaded,
                tx: true
            },
            gem: {...action.payload, ...state.gem}
        }
    }

    return state;
}
