import {
    DASHBOARD_WAS_FILTERED, FETCH_GEMS_PAGE_IMAGES, FETCH_USER_COUNTRIES,
    FETCH_USER_DETAILS_BEGUN,
    FETCH_USER_DETAILS_FAILED,
    FETCH_USER_DETAILS_SUCCEEDED,
    FETCH_USER_GEMS_BEGUN,
    FETCH_USER_GEMS_FAILED,
    FETCH_USER_GEMS_SUCCEEDED,
    ONLY_WANT_TO_SEE_GEMS_IN_AUCTIONS,
    PAGINATE,
    RERENDER_SORT_BOX,
    SORT_BOX_RERENDERED,
    USER_DETAILS_RETRIEVED,
    USER_GEMS_RETRIEVED,
    USER_HAS_NO_GEMS_IN_WORKSHOP,
    WANT_TO_SEE_ALL_GEMS,
} from './dashboardConstants';

import {NO_USER_EXISTS} from '../auth/authConstants';
import {NEW_AUCTION_CREATED,} from '../items/itemConstants';

export default function dashboardReducer(
  state = {
      gemsLoading: true,
      gemsLoadingError: false,
      userGems: [],
      userGemsPage: null,
      userGemsFiltered: [],
      sortBox: true,
      paginate: [],
      start: 0,
      end: 15
  },
  action,
) {

    //console.log('REDUCER::: action.type = ', action.type);
    //console.log('REDUCER::::::: payload =', action.payload);

    if (action.type === FETCH_GEMS_PAGE_IMAGES) {
        return {...state, /*userGemsPage: action.payload,*/ updateImages: false};
    }

    if (action.type === USER_GEMS_RETRIEVED) {
        const paginated = action.payload.length > 15 ? action.payload.slice(0, 15) : action.payload;
        //userGemsPage: paginated
        return {...state, userGems: action.payload, userGemsFiltered: action.payload, updateImages: true, gemsLoading: false};
    }

    if (action.type === FETCH_USER_COUNTRIES) {
        return {...state, userCountries: action.payload.userCountries};
    }

    if (action.type === NO_USER_EXISTS) {
        return {...state, userGems: '', userGemsPage: ''};
    }

    // if (action.type === ALL_USER_GEMS_RETRIEVED) {
    //   const paginated = action.payload.length > 15 ? action.payload.slice(0, 15) : action.payload;
    //   return {
    //     ...state,
    //     allUserGems: action.payload,
    //     userGemsPage: paginated,
    //   };
    // }

    // if (action.type === ALL_USER_GEMS_UPLOADED) {
    //   // merge without duplicates
    //   const newGems = state.userGems.concat(action.payload).reduce((total, item) => {
    //     if (!total.find(current => item.id === current.id)) {
    //       total.push(item);
    //     }
    //
    //     return total;
    //   }, []);
    //
    //   // const newGems = unionBy(state.allUserGems, action.payload, 'id');
    //   const paginated = newGems.length > 15 ? newGems.slice(0, 15) : newGems;
    //
    //
    //   return {
    //     ...state,
    //     allUserGems: newGems,
    //     userGems: newGems,
    //     userGemsPage: paginated,
    //   };
    // }

    if (action.type === USER_HAS_NO_GEMS_IN_WORKSHOP) {
        return {...state, userHasNoGems: true};
    }

    if (action.type === USER_HAS_NO_GEMS_IN_WORKSHOP) {
        return {...state, userHasNoGems: true};
    }

    if (action.type === DASHBOARD_WAS_FILTERED) {
        return {...state, userGemsFiltered: action.payload, updateImages: true};
    }

    if (action.type === 'DASHBOARD_GEMS_READY') {
        return {
            ...state,
            //userGemsPage: action.payload,
            userGems: action.payload,
            gemsLoading: false,
        };
    }

    if (action.type === 'REORDER_DASHBOARD') {
        const key = action.payload[0];
        const direction = action.payload[1];
        const currentDashboardItems = state.userGemsFiltered;
        const newMarket = currentDashboardItems.sort(
          (a, b) => (direction === 'desc' ? a[key] - b[key] : b[key] - a[key]),
        );

        console.log(state);
        console.log(key, direction, newMarket);

        // returns ordered data and resets pagination to first page]
        return {
            ...state,
            userGemsFiltered: newMarket,
            userGemsPage: null,
            updateImages: true,
            start: 0,
            end: 15,
            page: 1,
        };
    }

    if (action.type === 'FILTER_DASHBOARD') {
        const allGems = state.userGems;
        let newGemSelection;

        if (action.payload === 'allGems') {
            newGemSelection = [...allGems];
        }

        if (action.payload === 'gemsInAuction') {
            newGemSelection = allGems && allGems.filter(gem => gem.auctionIsLive === true);
        }

        if (action.payload === 'gemsNotInAuction') {
            newGemSelection = allGems && allGems.filter(gem => gem.auctionIsLive === false);
        }

        console.warn('NEW GEM SELECTION: ', newGemSelection);

        // returns ordered data and resets pagination to first page]
        return {
            ...state,
            userGemsFiltered: newGemSelection,
            updateImages: true,
            userGemsPage: null,
            start: 0,
            end: 15,
            page: 1,
        };
    }

    if (action.type === ONLY_WANT_TO_SEE_GEMS_IN_AUCTIONS) {
        return {
            ...state,
            userGemsFiltered: state.userGems.filter(gem => gem.auctionIsLive),
            updateImages: true,
            userGemsPage: null,
        };
    }

    if (action.type === WANT_TO_SEE_ALL_GEMS) {
        return {...state, userGemsFiltered: [...state.userGems], updateImages: true};
    }

    if (action.type === FETCH_USER_GEMS_BEGUN) {
        return {...state, gemsLoading: true, gemsLoadingError: false};
    }

    if (action.type === FETCH_USER_GEMS_SUCCEEDED) {
        return {...state, gemsLoading: false, gemsLoadingError: false};
    }

    if (action.type === FETCH_USER_GEMS_FAILED) {
        return {...state, gemsLoading: false, gemsLoadingError: action.payload};
    }

    if (action.type === FETCH_USER_DETAILS_BEGUN) {
        return {...state, userLoading: true, userLoadingError: false};
    }

    if (action.type === FETCH_USER_DETAILS_SUCCEEDED) {
        return {...state, userLoading: false, userLoadingError: false};
    }

    if (action.type === FETCH_USER_DETAILS_FAILED) {
        return {...state, userLoading: false, userLoadingError: action.payload};
    }

    if (action.type === USER_DETAILS_RETRIEVED) {
        return {...state, userLoading: false, userDetails: action.payload};
    }

    // if (action.type === RERENDER_SORT_BOX) {
    //     return {...state, sortBox: false};
    // }
    //
    // if (action.type === SORT_BOX_RERENDERED) {
    //     return {...state, sortBox: true};
    // }

    if (action.type === PAGINATE) {
        const start = action.payload[0] * action.payload[1] - action.payload[1];
        const end = action.payload[0] * action.payload[1];
        return {
            ...state,
            start,
            end,
            page: action.payload[0],
            userGemsPage: null,
        };
    }


    if (action.type === 'GEM_GIFTED') {
        return {
            ...state,
            userGems: state.userGems.filter(gem => gem.id !== action.payload),
            userGemsPage: state.userGemsPage.filter(gem => gem.id !== Number(action.payload)),
        };
    }

    if (action.type === NEW_AUCTION_CREATED) {
        const newFilter = state.userGems.map((gem) => {
            if (gem.id === action.payload.id) {
                return {...gem, auctionIsLive: true};
            }
            return gem;
        });

        return {...state, userGems: newFilter};
    }

    if (action.type === 'GEM_REMOVED_FROM_AUCTION') {
        const newFilter = state.userGems.map((gem) => {
            if (gem.id === action.payload) {
                return {...gem, auctionIsLive: false};
            }
            return gem;
        });

        return {...state, userGems: newFilter};
    }

    return state;
}
