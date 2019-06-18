import {
    APPLY_GEM_MARKET_FILTER_OPTION,
    APPLY_GEM_MARKET_SORTING,
    DESELECT_ALL_GEM_MARKET_FILTERS,
    FETCH_NEW_AUCTIONS_BEGUN,
    FETCH_NEW_AUCTIONS_FAILED,
    NEW_AUCTIONS_RECEIVED,
    SET_DEFAULT_GEM_MARKET_FILTERS,
} from './marketConstants';
import {NEW_AUCTION_CREATED} from '../items/itemConstants';

export const marketReducer = (
  state = {
      auctions: [],
      auctionsLoading: true,
      hasMoreGems: false,
      unselectedGemMarketFilters: defaultFiltersUnselected,
      selectedGemMarketSorting: defaultSorting,
  }, action) => {
    if (action.type === NEW_AUCTIONS_RECEIVED) {
        return {
            ...state,
            auctions: action.payload,
            auctionsLoading: false,
        };
    }

    if (action.type === NEW_AUCTION_CREATED) {
        const newAuction = action.payload;
        newAuction.currentPrice = action.payload.maxPrice;
        return [...state, newAuction];
    }

    if (action.type === APPLY_GEM_MARKET_FILTER_OPTION) {
        const {filterOption, optionType} = action.payload;
        let newFilters;
        const unselectedFilters = state.unselectedGemMarketFilters;
        if (filterIsClean(unselectedFilters)) {
            newFilters = {...defaultFiltersUnselected};
            newFilters[optionType] = allFiltersDeselected[optionType].filter(e => e !== filterOption);
            console.log("NEW FILTERS:", newFilters);
        } else {
            newFilters = {...unselectedFilters};
            switch (optionType) {
                case "min-price":
                    console.log("filter option:", filterOption);
                    newFilters.prices = [filterOption, unselectedFilters.prices[1]];
                    break;
                case "max-price":
                    newFilters.prices = [unselectedFilters.prices[0], filterOption];
                    break;
                default:
                    newFilters[optionType] = unselectedFilters[optionType].includes(filterOption) ?
                      unselectedFilters[optionType].filter(e => e !== filterOption) :
                      unselectedFilters[optionType].concat(filterOption);
                    break;
            }
        }
        return {
            ...state, unselectedGemMarketFilters: newFilters
        }
    }

    if (action.type === APPLY_GEM_MARKET_SORTING) {
        return {
            ...state, selectedGemMarketSorting: action.payload
        }
    }

    if (action.type === SET_DEFAULT_GEM_MARKET_FILTERS) {
        console.log("DEFAULT_GEM_MARKET_FILTERS");
        return {...state, unselectedGemMarketFilters: defaultFiltersUnselected}
    }

    if (action.type === DESELECT_ALL_GEM_MARKET_FILTERS) {
        return {...state, unselectedGemMarketFilters: allFiltersDeselected}
    }

    return state;
};

const defaultFiltersUnselected = {
    types: ["Per", "Aqu", "Dia", "Top", "Tur"],
    levels: [],
    grades: [],
    prices: [0, 1000],
};

const allFiltersDeselected = {
    types: ["Ame", "Gar", "Opa", "Sap", "Rub", "Per", "Aqu", "Dia", "Eme", "Pea", "Top", "Tur"],
    levels: ["lvl_1", "lvl_2", "lvl_3", "lvl_4", "lvl_5"],
    grades: ["D", "C", "B", "A", "AA", "AAA"],
    prices: [0, 1000]
}

const defaultSorting = {
    sortOption: "price",
    sortDirection: "up",
}

const filterIsClean = (unselectedFilters) => {
    return unselectedFilters.grades.length === allFiltersDeselected.grades.length &&
      unselectedFilters.levels.length === allFiltersDeselected.levels.length &&
      unselectedFilters.types.length === allFiltersDeselected.types.length;
}


// @dev The reducer above was one of the first reducers I created
// and I shaped it as an array by MediaStreamTrackEvent, which means I couldn't extend it.
// Hence the extra reducer below, shaped as an object
const initialState = {
    loading: true,
    error: false,
    filterLoading: false,
    filterError: false,
    gems: {
        amethyst: true,
        garnet: true,
        sapphire: true,
        opal: true,
        ruby: true,
    },
    level: {
        min: 0,
        max: 5,
    },
    gradeType: {
        min: 1,
        max: 6,
    },
    //GWei price
    currentPrice: {
        min: 0,
        max: 100000000000,
    },
};

export const marketActionsReducer = (state = initialState, action) => {
    if (action.type === NEW_AUCTIONS_RECEIVED) {
        return {...state, loading: false, error: false};
    }

    if (action.type === FETCH_NEW_AUCTIONS_FAILED) {
        return {...state, loading: false, error: true};
    }

    if (action.type === FETCH_NEW_AUCTIONS_BEGUN) {
        return {...state, loading: true, error: false};
    }

    return state;
}

