import React, {Component} from "react";
import styled from "styled-components";
import GemSelectionCard from "./GemSelectionCard";
import InfiniteScroll from 'react-infinite-scroller';
import {compose} from "redux";
import connect from "react-redux/es/connect/connect";
import GemSelectionFilters from "./GemSelectionFilters";
import {gradeConverter, type} from "./propertyPaneStyles";
import {bindGem} from "../plotActions";

const CardBox = styled.section`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minMax(150px, 1fr));
  grid-column-gap: 10px
  grid-row-gap: 10px;
`;

const GemSelectionFilter = styled.div`
`;

const select = store => {
    return {
        userGems: store.dashboard.userGems,
    }
}
const defaultFiltersUnselected = {
    types: ["Per", "Aqu", "Dia", "Eme", "Pea", "Top", "Tur"],
    levels: [],
    grades: [],
};

const deselectAllFilters = {
    types: ["Ame", "Gar", "Opa", "Sap", "Rub", "Per", "Aqu", "Dia", "Eme", "Pea", "Top", "Tur"],
    levels: ["lvl_1", "lvl_2", "lvl_3", "lvl_4", "lvl_5"],
    grades: ["D", "C", "B", "A", "AA", "AAA"],
}

export class GemSelectionPopup extends Component {

    state = {
        allGems: this.props.userGems,
        scrolledGems: this.props.userGems.slice(0, 16),
        hasMoreGems: this.props.userGems.length > 16,
        unselectedFilters: {
            types: ["Per", "Aqu", "Dia", "Eme", "Pea", "Top", "Tur"],
            levels: [],
            grades: [],
        },
        filterIsClean: false,
        selectedSort: ""
    };

    componentDidMount() {
        this.sortGems("mrb_down");
        this.setState({windowWidth: window.innerWidth});
    }

    loadMore(page) {
        console.log("Load more ", page);
        const scrollTo = Math.min(page * 16, this.state.allGems.length);
        this.setState({
            scrolledGems: this.state.allGems.slice(0, scrollTo),
            hasMoreGems: scrollTo < this.state.allGems.length,
        });
    }

    setDefaultFilters = () => {
        const newFilters = defaultFiltersUnselected;
        const filteredGems = this.props.userGems.filter((gem) =>
          !newFilters.grades.includes(gradeConverter(Number(gem.gradeType))) && !newFilters.levels.includes("lvl_" + gem.level) && !newFilters.types.includes(type(gem.color)));
        this.setState({
            allGems: filteredGems,
            unselectedFilters: newFilters,
            scrolledGems: filteredGems.slice(0, 16),
            hasMoreGems: filteredGems.length > 16
        }, () => this.sortGems(this.state.selectedSort))
    }

    deselectAllFilters = () => {
        const newFilters = {...deselectAllFilters};
        this.setState({
            allGems: [],
            unselectedFilters: newFilters,
            scrolledGems: [],
            hasMoreGems: false
        });
    }

    filterIsClean = () => {
        return this.state.unselectedFilters.grades.length === deselectAllFilters.grades.length &&
          this.state.unselectedFilters.levels.length === deselectAllFilters.levels.length &&
          this.state.unselectedFilters.types.length === deselectAllFilters.types.length;
    }

    addFilterOption = (filterOption, optionType) => {
        let newFilters;
        if (this.filterIsClean()) {
            newFilters = {...defaultFiltersUnselected};
            newFilters[optionType] = deselectAllFilters[optionType].filter(e => e !== filterOption);
            console.log("NEW FILTERS:", newFilters);
        } else {
            newFilters = {...this.state.unselectedFilters};
            newFilters[optionType] = this.state.unselectedFilters[optionType].includes(filterOption) ?
              this.state.unselectedFilters[optionType].filter(e => e !== filterOption) :
              this.state.unselectedFilters[optionType].concat(filterOption);
        }
        const filteredGems = this.props.userGems.filter((gem) =>
          !newFilters.grades.includes(gradeConverter(Number(gem.gradeType))) && !newFilters.levels.includes("lvl_" + gem.level) && !newFilters.types.includes(type(gem.color)));
        this.setState({
            allGems: filteredGems,
            unselectedFilters: newFilters,
            scrolledGems: filteredGems.slice(0, 16),
            hasMoreGems: filteredGems.length > 16
        }, () => this.sortGems(this.state.selectedSort))
    };

    sortGems = (sortOption) => {
        if (sortOption === this.state.selectedSort) return;
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
        }
        const sortedGems = this.state.allGems.sort((p1, p2) => {
            return sortingFunction(p1, p2);
        });
        this.setState({
            allGems: sortedGems,
            selectedSort: sortOption,
            scrolledGems: sortedGems.slice(0, 16),
            hasMoreGems: sortedGems.length > 16
        });
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
        }

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

        const {applyFilter, applySort, prevPage, nextPage, activeControls, userGems, handleBindGem, selectedPlotId} = this.props;
        const {unselectedFilters, selectedSort, scrolledGems} = this.state;

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
                              //console.log('USER GEM: ', userGem);
                              return (
                                //<div></div>
                                <GemSelectionCard auction={userGem} key={userGem.id}
                                    onClick={() => {!userGem.auctionIsLive && handleBindGem(selectedPlotId, userGem.id)}}
                                />
                              )
                          })
                        ) : ""
                        }
                    </CardBox>
                </InfiniteScroll> :
                <div>No matching gems found. Check the filter settings</div>
              }
              <GemSelectionFilters unselectedFilters={unselectedFilters}
                                   toggleFilter={(option, optionType) => {
                                       this.addFilterOption(option, optionType)
                                   }}
                                   clearFilters={() => this.deselectAllFilters()}
                                   setDefaultFilters={() => this.setDefaultFilters()}
                                   selectedSort={selectedSort}
                                   toggleSort={(sortOption) => {
                                       this.sortGems(sortOption)
                                   }}>
              </GemSelectionFilters>
          </div>
        );
    }
}


export default compose(
  connect(
    select,
    {
        handleBindGem: bindGem,
    }
  )
)(GemSelectionPopup);