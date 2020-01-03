import React, {Component} from "react";
import styled from "styled-components";
import GemSelectionCard from "./GemSelectionCard";
import InfiniteScroll from 'react-infinite-scroller';
import {compose} from "redux";
import connect from "react-redux/es/connect/connect";
import GemSelectionFilters from "./GemSelectionFilters";
import {gradeConverter, type} from "./propertyPaneStyles";
import {bindGem} from "../plotActions";
import {proceedCombine} from "../../dashboard/dashboardActions";
import {
    SELECT_GEM_TO_COMBINE,
    APPLY_GEM_SELECTION_FILTER_OPTION,
    APPLY_GEM_SELECTION_SORTING,
    DESELECT_ALL_GEM_SELECTION_FILTERS, SET_DEFAULT_GEM_SELECTION_FILTERS
} from "../../dashboard/dashboardConstants";
import {
    typePaneColors, 
    typePaneOutlineColors 
} from "./propertyPaneStyles";
import { CutEdgesButton } from "../../../components/CutEdgesButton";

const CardBox = styled.section`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minMax(150px, 1fr));
  grid-column-gap: 10px
  grid-row-gap: 10px;
  padding-bottom: 200px;
`;

const GemSelectionFilter = styled.div`
`;

const select = store => {
    return {
        userGems: store.dashboard.userGems,
        gemMiningIds: store.plots.gemMiningIds,
        unselectedFilters: store.dashboard.unselectedGemSelectionFilters,
        selectedSort: store.dashboard.selectedGemSelectionSorting,
        selectedGems: store.dashboard.selectedGems,
    }
};

export class GemSelectionPopup extends Component {

    state = {
        allGems: this.props.userGems,
        scrolledGems: this.props.userGems.slice(0, 16),
        hasMoreGems: this.props.userGems.length > 16,
    };

    componentDidMount() {
        this.setState({windowWidth: window.innerWidth});
        const filteredGems = this.filterGems(this.props.userGems);
        this.sortGems(filteredGems);
        this.setState({
            allGems: filteredGems,
            scrolledGems: filteredGems.slice(0, 16),
            hasMoreGems: filteredGems.length > 16,
        });
    }

    componentDidUpdate(prevProps) {
        const {unselectedFilters, selectedSort, userGems} = this.props;
        if (unselectedFilters !== prevProps.unselectedFilters || userGems !== prevProps.userGems) {
            const filteredGems = this.filterGems(userGems);
            this.sortGems(filteredGems);
            this.setState({
                allGems: filteredGems,
                scrolledGems: filteredGems.slice(0, 16),
                hasMoreGems: filteredGems.length > 16,
            })
        }
        if (unselectedFilters === prevProps.unselectedFilters && selectedSort !== prevProps.selectedSort) {
            this.sortGems(this.state.allGems);
            this.setState({
                allGems: this.state.allGems,
                scrolledGems: this.state.allGems.slice(0, 16),
                hasMoreGems: this.state.hasMoreGems,
            })
        }
    }

    loadMore(page) {
        const scrollTo = Math.min(page * 16, this.state.allGems.length);
        this.setState({
            scrolledGems: this.state.allGems.slice(0, scrollTo),
            hasMoreGems: scrollTo < this.state.allGems.length,
        });
    }

    filterGems = (gems) => {
        const unselectedFilters = this.props.unselectedFilters;
        return gems.filter((gem) =>
          !unselectedFilters.grades.includes(gradeConverter(Number(gem.gradeType))) &&
          !unselectedFilters.levels.includes("lvl_" + gem.level) &&
          !unselectedFilters.types.includes(type(gem.color)));
    };

    sortGems = (gems) => {
        const sortOption = this.props.selectedSort;
        let sortingFunction;
        switch (sortOption) {
            case "mrb_up":
                sortingFunction = (p1, p2) => +p1.rate - p2.rate;
                break;
            case "mrb_down":
                sortingFunction = (p1, p2) => +p2.rate - p1.rate;
                break;
            case "level_up":
                sortingFunction = (p1, p2) => +p1.level - p2.level;
                break;
            case "level_down":
                sortingFunction = (p1, p2) => +p2.level - p1.level;
                break;
            default:
                sortingFunction = (p1, p2) => 1;
        }
        gems.sort((p1, p2) => {
            return sortingFunction(p1, p2);
        });
    };

    isGemApplicableToCombine = (gem, selectedGems, combineAsset) => {
        if (selectedGems.length === 0) return true;
        if (combineAsset === "silver") {
            return selectedGems[0].level === gem.level //&& selectedGems[0].color === gem.color
        }
        if (combineAsset === "gold") {
            return selectedGems[0].gradeType === gem.gradeType //&& selectedGems[0].color === gem.color
        }
        return false;
    }

    render() {
        const container = {
            display: "flex",
            width: this.state.windowWidth > 800 ? "800px" : this.state.windowWidth,
            padding: "0 10px",
            fontSize: "14px",
            fontWeight: "bold",
            textAlign: "center",
            //overflowY: "scroll",
            //overflowX: "hidden",
            height: "525px",
            overflow: "hidden auto",
            flexDirection: "column"
        };

        const PlotsInfo = styled.div`
            background-color: #24292F;
            padding: 5px 10px;
            border-radius: 10px;
            width: 100%;
            display: flex;
            margin: 6px 0;
            flex-wrap: wrap;
        `;

        const Col = styled.div`
            flex: ${props => props.flex}
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            margin: 0 2%;
        `;

        const ShowButton = styled.div`
            background-color: #2A3238;
            border: 3px solid #62626B;
            border-radius: 10px;
            font-weight: bold;
            padding: 5px;
            cursor: pointer;
            color: ${props => props.selected ? "#eee" : "#4F565D"};
            border: 3px solid ${props => props.selected ? "#eee" : "#4F565D"};
            font-size: 12px;
            text-align: center;
            margin: 5px;
            
            &:hover {
                color: #eee;
                background-color: #24292F;
                border: 2px solid #4F565D;
            };
        `;

        const {handleBindGem, selectedPlot, gemMiningIds, transactionStartCallback, showConfirmPopupCallback,
            updatePlot, unselectedFilters, selectedSort, handleApplySort, handleApplyFilterOption,
            handleDeselectAllFilters, handleSetDefaultFilters, combineAsset, selectedGems, 
            handleSelectGem, showProceedCombinePopup, goToMarketAndApplyFilters} = this.props;
        const {scrolledGems} = this.state;

        return (
          <div style={container}>
              {scrolledGems && scrolledGems.length > 0 ?
                <InfiniteScroll
                  pageStart={0}
                  loadMore={(page) => this.loadMore(page)}
                  hasMore={this.state.hasMoreGems}
                  loader={<div key={0}>Loading ...</div>}
                  style={{width: "100%"}}
                  treshold={110}
                  useWindow={false}
                >
                    <CardBox>
                        {scrolledGems && scrolledGems.length > 0 ? (
                          scrolledGems.map(userGem => {
                              const available = !userGem.auctionIsLive && gemMiningIds && !gemMiningIds.includes(userGem.id.toString());
                              const applicableToPlot = selectedPlot ? selectedPlot.layerEndPercentages[userGem.level - 1] > selectedPlot.currentPercentage : false
                              const isSelectedToCombine = (combineAsset && selectedGems.length > 0) ? selectedGems.find(gem => gem.id === userGem.id) : false
                              if (available) return (
                                //<div></div>
                                <GemSelectionCard 
                                    backgroundColor={isSelectedToCombine ? typePaneColors(userGem.color) : undefined} 
                                    outlineColor={isSelectedToCombine ? typePaneOutlineColors(userGem.color) : undefined} 
                                    selectedPlot={selectedPlot} 
                                    auction={userGem} 
                                    key={userGem.id} 
                                    available={(selectedPlot && applicableToPlot) ||
                                         (combineAsset && this.isGemApplicableToCombine(userGem, selectedGems, combineAsset))}
                                    onClick={() => {
                                        if (selectedPlot) {
                                            if (applicableToPlot) {
                                                showConfirmPopupCallback();
                                                handleBindGem(selectedPlot, userGem, updatePlot, transactionStartCallback)
                                            }
                                            return
                                        }
                                        if (combineAsset) {
                                            handleSelectGem(userGem, combineAsset)
                                            return
                                        }
                                    }}
                                />
                              )
                          })
                        ) : ""
                        }
                        {combineAsset ? 
                            <CutEdgesButton outlineColor={"white"}
                                fontColor={"#dedede"}
                                backgroundColor={"black"}
                                edgeSizes={[7, 7]}
                                outlineWidth={3}
                                height={210}
                                fontSize={22}
                                content={"Click here to \\A"+
                                        "go to Market \\A " + 
                                        "to buy Gems \\A " +
                                        "of this Color \\A " + 
                                        "and " + (combineAsset === "silver" ? "Level" : "Grade")}
                                onClick={() => goToMarketAndApplyFilters(unselectedFilters)}/> : ""
                        }
                    </CardBox>
                </InfiniteScroll> :
                <div>No matching gems found. Check the filter settings</div>
              }
              <GemSelectionFilters unselectedFilters={unselectedFilters}
                                   toggleFilter={(option, optionType) => {
                                       handleApplyFilterOption(option, optionType)
                                   }}
                                   clearFilters={handleDeselectAllFilters}
                                   setDefaultFilters={handleSetDefaultFilters}
                                   selectedSort={selectedSort}
                                   toggleSort={(sortOption) => {
                                       (sortOption !== selectedSort) && handleApplySort(sortOption)
                                   }}
                                   selectedGems={selectedGems}
                                   combineAsset={combineAsset}
                                   proceedCombine={() => selectedGems && selectedGems.length === 4 
                                        && showProceedCombinePopup(selectedGems)}
                                   >
              </GemSelectionFilters>
          </div>
        );
    }
}


export default compose(
  connect(
    select,
    {
        handleSelectGem: (gem, combineAsset) => ({type: SELECT_GEM_TO_COMBINE, payload: {gem, combineAsset}}),
        handleBindGem: bindGem,
        handleApplySort: (sortOption) => ({type: APPLY_GEM_SELECTION_SORTING, payload: sortOption}),
        handleApplyFilterOption: (option, optionType) => ({type: APPLY_GEM_SELECTION_FILTER_OPTION, payload: {filterOption: option, optionType: optionType}}),
        handleDeselectAllFilters: () => ({type: DESELECT_ALL_GEM_SELECTION_FILTERS}),
        handleSetDefaultFilters: () => ({type: SET_DEFAULT_GEM_SELECTION_FILTERS}),
    }
  )
)(GemSelectionPopup);