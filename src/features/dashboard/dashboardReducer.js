import {
    APPLY_GEM_SELECTION_FILTER_OPTION, APPLY_GEM_SELECTION_SORTING,
    APPLY_GEM_WORKSHOP_FILTER_OPTION,
    APPLY_GEM_WORKSHOP_SORTING,
    DASHBOARD_WAS_FILTERED, DESELECT_ALL_GEM_SELECTION_FILTERS,
    DESELECT_ALL_GEM_WORKSHOP_FILTERS,
    FETCH_USER_COUNTRIES,
    FETCH_USER_DETAILS_BEGUN,
    FETCH_USER_DETAILS_FAILED,
    FETCH_USER_DETAILS_SUCCEEDED,
    FETCH_USER_GEMS_BEGUN,
    FETCH_USER_GEMS_FAILED,
    FETCH_USER_GEMS_SUCCEEDED,
    ONLY_WANT_TO_SEE_GEMS_IN_AUCTIONS,
    PAGINATE, SET_DEFAULT_GEM_SELECTION_FILTERS,
    SET_DEFAULT_GEM_WORKSHOP_FILTERS,
    USER_ARTIFACTS_RETRIEVED,
    USER_DETAILS_RETRIEVED,
    USER_GEMS_RETRIEVED,
    USER_HAS_NO_GEMS_IN_WORKSHOP,
    WANT_TO_SEE_ALL_GEMS,
    SELECT_GEM_TO_COMBINE
} from './dashboardConstants';

import {NO_USER_EXISTS} from '../auth/authConstants';
import {NEW_AUCTION_CREATED,} from '../items/itemConstants';
import {gradeConverter, type} from "../plots/components/propertyPaneStyles";

const pageSize = 18;

export default function dashboardReducer(
  state = {
      gemsLoaded: false,
      gemsLoadingError: false,
      userGems: [],
      userArtifacts: null,
      userGemsPage: null,
      userGemsFiltered: [],
      sortBox: true,
      paginate: [],
      start: 0,
      end: pageSize,
      hasMoreGems: false,
      unselectedGemWorkshopFilters: defaultFiltersUnselected,
      selectedGemWorkshopSorting: defaultSorting,
      unselectedGemSelectionFilters: defaultFiltersUnselected,
      selectedGemSelectionSorting: "mrb_down",
      selectedGems: []
  },
  action,
) {
    if (action.type === USER_GEMS_RETRIEVED) {
        return {
            ...state,
            userGems: action.payload,
            userGemsFiltered: action.payload,
            gemsLoaded: true,
            hasMoreGems: action.payload.length > pageSize
        };
    }

    if (action.type === FETCH_USER_COUNTRIES) {
        return {
            ...state,
            userCountries: action.payload.userCountries,
            countriesNotWithdrawnEth: action.payload.totalNotWithdrawn
        };
    }

    if (action.type === USER_ARTIFACTS_RETRIEVED) {
        return {...state, userArtifacts: action.payload.userArtifacts};
    }

    if (action.type === NO_USER_EXISTS) {
        return {...state, userGems: '', userGemsPage: ''};
    }

    if (action.type === USER_HAS_NO_GEMS_IN_WORKSHOP) {
        return {...state, userHasNoGems: true};
    }

    if (action.type === USER_HAS_NO_GEMS_IN_WORKSHOP) {
        return {...state, userHasNoGems: true};
    }

    if (action.type === DASHBOARD_WAS_FILTERED) {
        return {...state, userGemsFiltered: action.payload};
    }

    if (action.type === 'DASHBOARD_GEMS_READY') {
        return {
            ...state,
            userGems: action.payload,
            gemsLoaded: true,
        };
    }

    if (action.type === 'REORDER_DASHBOARD') {
        const key = action.payload[0];
        const direction = action.payload[1];
        const currentDashboardItems = state.userGemsFiltered;
        const newMarket = currentDashboardItems.sort(
          (a, b) => (direction === 'desc' ? a[key] - b[key] : b[key] - a[key]),
        );

        return {
            ...state,
            userGemsFiltered: newMarket,
            userGemsScrolled: null,
            start: 0,
            end: pageSize,
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

        return {
            ...state,
            userGemsFiltered: newGemSelection,
            userGemsScrolled: null,
            hasMoreGems: newGemSelection.length > pageSize,
            start: 0,
            end: pageSize,
            page: 1,
        };
    }

    if (action.type === ONLY_WANT_TO_SEE_GEMS_IN_AUCTIONS) {
        const filteredGems = state.userGems.filter(gem => gem.auctionIsLive);
        return {
            ...state,
            userGemsFiltered: filteredGems,
            userGemsScrolled: null,
            hasMoreGems: filteredGems.length > pageSize
        };
    }

    if (action.type === WANT_TO_SEE_ALL_GEMS) {
        return {
            ...state,
            userGemsFiltered: state.userGems.slice(0, state.userGems.length),
            hasMoreGems: state.userGems.length > pageSize
        };
    }

    if (action.type === FETCH_USER_GEMS_BEGUN) {
        return {...state, gemsLoaded: false, gemsLoadingError: false};
    }

    if (action.type === FETCH_USER_GEMS_SUCCEEDED) {
        return {...state, gemsLoaded: true, gemsLoadingError: false};
    }

    if (action.type === FETCH_USER_GEMS_FAILED) {
        return {...state, gemsLoaded: false, gemsLoadingError: action.payload};
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
    //
    // if (action.type === SCROLL_GEMS) {
    //     const scrollTo = Math.min(action.payload[0] * action.payload[1], state.userGemsFiltered.length);
    //     return {
    //         ...state,
    //         end: scrollTo,
    //         hasMoreGems: scrollTo < state.userGemsFiltered.length,
    //         userGemsScrolled: state.userGemsFiltered.slice(0, scrollTo)
    //     };
    // }

    if (action.type === 'GEM_GIFTED') {
        return {
            ...state,
            userGems: state.userGems.filter(gem => gem.id !== action.payload),
            userGemsFiltered: state.userGems.filter(gem => gem.id !== action.payload),
            hasMoreGems: state.userGems.length - 1 > pageSize,
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

    if (action.type === APPLY_GEM_WORKSHOP_FILTER_OPTION) {
        const {filterOption, optionType} = action.payload;
        let newFilters;
        const unselectedFilters = state.unselectedGemWorkshopFilters;
        if (filterIsClean(unselectedFilters)) {
            newFilters = {...defaultFiltersUnselected};
            newFilters[optionType] = allFiltersDeselected[optionType].filter(e => e !== filterOption);
            console.log("NEW FILTERS:", newFilters);
        } else {
            newFilters = {...unselectedFilters};
            newFilters[optionType] = unselectedFilters[optionType].includes(filterOption) ?
              unselectedFilters[optionType].filter(e => e !== filterOption) :
              unselectedFilters[optionType].concat(filterOption);
        }

        return {
            ...state, unselectedGemWorkshopFilters: newFilters
        }
    }

    if (action.type === APPLY_GEM_WORKSHOP_SORTING) {
        return {
            ...state, selectedGemWorkshopSorting: action.payload
        }
    }

    if (action.type === SET_DEFAULT_GEM_WORKSHOP_FILTERS) {
        return {...state, unselectedGemWorkshopFilters: defaultFiltersUnselected}
    }

    if (action.type === DESELECT_ALL_GEM_WORKSHOP_FILTERS) {
        return {...state, unselectedGemWorkshopFilters: allFiltersDeselected}
    }

    if (action.type === APPLY_GEM_SELECTION_FILTER_OPTION) {
        const {filterOption, optionType} = action.payload;
        let newFilters;
        const unselectedFilters = state.unselectedGemSelectionFilters;
        if (gemSelectionFilterIsClean(unselectedFilters)) {
            newFilters = {...defaultFiltersUnselected};
            newFilters[optionType] = allFiltersDeselected[optionType].filter(e => e !== filterOption);
            console.log("NEW FILTERS:", newFilters);
        } else {
            newFilters = {...unselectedFilters};
            newFilters[optionType] = unselectedFilters[optionType].includes(filterOption) ?
              unselectedFilters[optionType].filter(e => e !== filterOption) :
              unselectedFilters[optionType].concat(filterOption);
        }
        return {
            ...state, unselectedGemSelectionFilters: newFilters
        }
    }

    if (action.type === APPLY_GEM_SELECTION_SORTING) {
        return {
            ...state, selectedGemSelectionSorting: action.payload
        }
    }

    if (action.type === SET_DEFAULT_GEM_SELECTION_FILTERS) {
        return {...state, unselectedGemSelectionFilters: defaultFiltersUnselected, selectedGems: []}
    }

    if (action.type === DESELECT_ALL_GEM_SELECTION_FILTERS) {
        return {...state, unselectedGemSelectionFilters: allFiltersDeselected, selectedGems: []}
    }

    if (action.type === SELECT_GEM_TO_COMBINE) {
        const {gem, combineAsset} = action.payload;
        if (state.selectedGems.length == 0) {
            const newFilters = {...defaultFiltersUnselected};
            //const newTypeFilters = [...allFiltersDeselected.types]
            //newFilters["types"] = newTypeFilters.filter(t => t !== type(gem.color));
            if (combineAsset == "silver") {
                const newLevelFilters = [...allFiltersDeselected.levels]
                newLevelFilters.splice(gem.level - 1, 1);
                newFilters["levels"] = newLevelFilters;
            } else if (combineAsset == "gold") {
                const newGradeFilters = [...allFiltersDeselected.grades]
                newGradeFilters.splice(gem.gradeType - 1, 1);
                newFilters["grades"] = newGradeFilters;
            }
            return {...state, selectedGems: [gem], unselectedGemSelectionFilters: newFilters}
        }

        if (state.selectedGems.length <= 4) {
            const newSelectedGems = state.selectedGems.filter((g) => g.id != gem.id);
            if (newSelectedGems.length === state.selectedGems.length && newSelectedGems.length < 4) {
                if ((combineAsset === "silver" && gem.level === state.selectedGems[0].level) ||
                (combineAsset === "gold") && gem.gradeType === state.selectedGems[0].gradeType) {
                    newSelectedGems.push(gem);
                }
            }
            return {...state, selectedGems: newSelectedGems}
        } 
    }

    return state;
}

const defaultFiltersUnselected = {
    types: ["Per", "Aqu", "Dia", "Top", "Tur"],
    levels: [],
    grades: [],
    states: [],
};

const allFiltersDeselected = {
    types: ["Ame", "Gar", "Opa", "Sap", "Rub", "Per", "Aqu", "Dia", "Eme", "Pea", "Top", "Tur"],
    levels: ["lvl_1", "lvl_2", "lvl_3", "lvl_4", "lvl_5"],
    grades: ["D", "C", "B", "A", "AA", "AAA"],
    states: ["mining", "auction", "idle", "stuck"]
};

const defaultSorting = {
    sortOption: "acq",
    sortDirection: "up",
};

const gemSelectionFilterIsClean = (unselectedFilters) => {
    return unselectedFilters.grades.length === allFiltersDeselected.grades.length &&
      unselectedFilters.levels.length === allFiltersDeselected.levels.length &&
      unselectedFilters.types.length === allFiltersDeselected.types.length;
};

const filterIsClean = (unselectedFilters) => {
    return unselectedFilters.grades.length === allFiltersDeselected.grades.length &&
      unselectedFilters.levels.length === allFiltersDeselected.levels.length &&
      unselectedFilters.types.length === allFiltersDeselected.types.length &&
      unselectedFilters.states.length === allFiltersDeselected.states.length;
};