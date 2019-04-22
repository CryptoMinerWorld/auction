import React, {Component} from "react";
import styled from "styled-components";

class PlotFilter extends Component {

    state = {
        showTierFilter: false
    }

    render() {
        const {applyFilter, applySort, prevPage, nextPage, activeControls} = this.props;

        const FilterButton = styled.div`
            margin: 5px 0;
            padding: 5px;
            text-align: center;
            cursor: pointer;
            background-color: #24292F;
            color: ${props => props.selected ? "#eee" : "#4F565D"};
            border: 2px solid ${props => props.selected ? "#4F565D" : "transparent"};
            text-decoration: ${props => props.underlined ? "underline" : "none"};
            text-decoration-color: #ff00ce;
            
            &:hover {
                color: #eee;
                background-color: #24292F;
                border: 2px solid #4F565D;
            }`;

        const plainText = {
            color: "black",
            alignSelf: "center",
            fontWeight: "bold"
        }
        const filterStyle = {
            position: "absolute",
            top: "0",
            left: "0",
            display: "flex",
            flexDirection: "column",
            width: "150px",
            backgroundColor: "#2A3238",
            fontSize: "14px",
            padding: "5px",
            alignItems: "stretch"
        }
        const arrowButtonStyle = {
            display: "block",
            width: "60px",
            height: "60px",
            fontSize: "28px"
        }
        const ArrowButton = styled('a')`
            display: block;
            width: 60px;
            height: 60px;
            font-size: 28px;
            background-color: #24292F;
            color: ${props => props.selected ? "#eee" : "#4F565D"};
            border: 2px solid ${props => props.selected ? "#4F565D" : "transparent"};
            text-align: center;
            
            &:hover {
                color: #eee;
                background-color: #24292F;
                border: 2px solid #4F565D;
            }`;

        const buttonBlockStyle = {
            display: "flex",
            justifyContent: "space-around"
        }

        return (
          <div style={filterStyle}>
              <div style={plainText}>Sort By</div>
              <FilterButton selected={activeControls.includes("time_left")}
                            onClick={() => applySort("time_left")}>
                  Time Left
              </FilterButton>
              <FilterButton selected={activeControls.includes("mined")}
                            onClick={() => applySort("mined")}>
                  % Mined</FilterButton>
              <FilterButton selected={activeControls.includes("dirt")}
                            underlined={activeControls.includes("dirt_filter")}
                            onClick={() => applySort("dirt")}>Dirt</FilterButton>
              <FilterButton selected={activeControls.includes("clay")}
                            underlined={activeControls.includes("clay_filter")}
                            onClick={() => applySort("clay")}>Clay</FilterButton>
              <FilterButton selected={activeControls.includes("limestone")}
                            underlined={activeControls.includes("limestone_filter")}
                            onClick={() => applySort("limestone")}>Limestone</FilterButton>
              <FilterButton selected={activeControls.includes("marble")}
                            underlined={activeControls.includes("marble_filter")}
                            onClick={() => applySort("marble")}>Marble</FilterButton>
              <FilterButton selected={activeControls.includes("obsidian")}
                            underlined={activeControls.includes("obsidian_filter")}
                            onClick={() => applySort("obsidian")}>Obsidian</FilterButton>
              <div style={buttonBlockStyle}>
                  <ArrowButton selected={activeControls.includes("sort_btn_up")}
                               onClick={() => applySort("sort_btn_up")}>∧</ArrowButton>
                  <ArrowButton selected={activeControls.includes("sort_btn_down")}
                               onClick={() => applySort("sort_btn_down")}>∨</ArrowButton></div>

              <div style={plainText}>Show</div>
              <FilterButton selected={activeControls.includes("show_gem_mining")}
                            onClick={() => applyFilter("show_gem_mining")}>Gem Mining</FilterButton>
              <FilterButton selected={activeControls.includes("show_not_mining")}
                            onClick={() => applyFilter("show_not_mining")}>Not Mining</FilterButton>
              <FilterButton selected={activeControls.includes("show_no_gem")}
                            onClick={() => applyFilter("show_no_gem")}>No Gem</FilterButton>
              <FilterButton selected={activeControls.includes("show_completed")}
                            onClick={() => applyFilter("show_completed")}>Completed</FilterButton>
              <FilterButton selected={activeControls.includes("show_tier")}
                            underlined={activeControls.includes("show_tier")}
                            onClick={() => {this.setState({showTierFilter: true})}}>Selected tiers</FilterButton>

              <div style={plainText}>Page</div>
              {this.state.showTierFilter ?
                <FilterPopup activeOptions={activeControls} closeCallback={() => this.setState({showTierFilter: false})}/> : "" }
          </div>
        )
    }
}


export class FilterPopup extends Component {

    state = {
        activeOptions: []
    };

    componentDidMount() {
        this.setState({
            activeOptions: this.props.activeOptions
        });
    }

    addFilterOption = (filterOption) => {
        this.setState({
            activeOptions: this.state.activeOptions.includes(filterOption) ? this.state.activeOptions.filter(e => e !== filterOption) : this.state.activeOptions.concat(filterOption)
        });
    }

    render() {

        const FilterButton = styled.div`
            margin: 5px 0;
            padding: 5px;
            text-align: center;
            cursor: pointer;
            background-color: #24292F;
            color: ${props => props.selected ? "#eee" : "#4F565D"};
            border: 2px solid ${props => props.selected ? "#4F565D" : "transparent"};
            text-decoration: ${props => props.underlined ? "underline" : "none"};
            text-decoration-color: #ff00ce;
            
            &:hover {
                color: #eee;
                background-color: #24292F;
                border: 2px solid #4F565D;
            }`;

        const {activeOptions} = this.state;

        const shadowLayerStyle = {
                position: 'fixed',
                margin: 'auto',
                left: '0',
                right: '0',
                top: '0rem',
                bottom: '0',
                zIndex: '10',
                display: 'flex',
                cursor: 'pointer',
                backgroundColor: 'rgba(101,101,101,0.4)',
        }

        const popupStyle = {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "150px",
            backgroundColor: "#2A3238",
            fontSize: "14px",
            padding: "5px",
            alignItems: "stretch"
        }

        return (
          <div style={shadowLayerStyle} onClick={() => this.props.closeCallback()}>
              <div style={popupStyle}>
                  <FilterButton underlined={activeOptions.includes("dirt_filter")}
                                onClick={() => this.addFilterOption("dirt_filter")}>Dirt</FilterButton>
                  <FilterButton underlined={activeOptions.includes("clay_filter")}
                                onClick={() => this.addFilterOption("clay_filter")}>Clay</FilterButton>
                  <FilterButton underlined={activeOptions.includes("limestone_filter")}
                                onClick={() => this.addFilterOption("limestone_filter")}>Limestone</FilterButton>
                  <FilterButton underlined={activeOptions.includes("marble_filter")}
                                onClick={() => this.addFilterOption("marble_filter")}>Marble</FilterButton>
                  <FilterButton underlined={activeOptions.includes("obsidian_filter")}
                                onClick={() => this.addFilterOption("obsidian_filter")}>Obsidian</FilterButton>
                  <div>Confirm</div>
              </div>
          </div>
        );
    }


}


export default PlotFilter;