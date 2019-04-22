import React, {Component} from "react";
import styled from "styled-components";
import buyNowImage from "../../../app/images/pinkBuyNowButton.png";
import stubIcon from "./../../../app/images/icons/gem1.png";
import artifactIcon from "../../../app/images/artifactIcon.png";
import filterIcon from "../../../app/images/filterIcon.png";
import gemIcon from "../../../app/images/gemIcon.png";
import plotIcon from "../../../app/images/plotIcon.png";

class PlotSidebar extends Component {

    state = {
        showSidebarFilters: false,
        selectedTab: "all",
    }

    // showSidebarPopup = (type) => {
    //     this.setState({showSidebarPopup: type})
    // }
    //
    // showSidebarFilters = () => {
    //     this.setState({showSidebarFilters: true})
    // }

    shouldComponentUpdate(props, state) {
        return state.selectedTab !== this.state.selectedTab;
        //return false;
    }

    render() {

        const {applyFilter, applySort, prevPage, nextPage, activeControls, showSidebarPopup} = this.props;

        const SidebarSection = styled.div`
            display: flex;
            flex-direction: column;
            align-items: center;
            color: white;
            background-color: #2B3035;
            margin: 0 0 10px 0px;
            padding: 4px 0px;
            border-radius: ${props => props.selectedTab && props.selectedTab === "selected" ? 
                        "0 0 10px 0" : "0 10px 10px 0"};
        `;


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

        const BuyButton = styled.div`
            flex: 4;
            background-image: url(${buyNowImage});
            //background-color: magenta;
            background-position: center center;
            width: 100%;
            height: 100%;
            text-align: center;
            background-size: contain;
            background-repeat: no-repeat;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            padding: 12px;
            cursor: pointer;
            color: white;
            font-size: 16px
        `;

        const filterStyle = {
            display: "flex",
            flexDirection: "column",
            width: "150px",
            backgroundColor: "#383F45",
            fontSize: "14px",
            padding: "5px",
            alignItems: "stretch",
            position: "relative",
            color: "white",
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

        const SidebarIcon = styled.div`
            background-image: url(${props => props.icon});
            background-position: center center;
            text-align: center;
            background-repeat: no-repeat;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            padding: 50px 40px;
            cursor: pointer;
            color: white;
            font-size: 16px;
            
        `;

        const SidebarTabs = styled.div`
            display: flex;
        `

        const selectedTabStyle = {
            flex: "1",
            backgroundColor: "#2B3035",
            borderRadius: "5px 5px 0 0",
            padding: "5px",
            textAlign: "center",
            fontSize: "12px"
        };
        const tabStyle = {
            cursor: "pointer",
            flex: "1",
            padding: "5px",
            textAlign: "center",
            fontSize: "12px"
        };

        return (
          <div style={filterStyle}>
              <SidebarTabs>
                  <div onClick={() => this.setState({selectedTab: "all"})} style={this.state.selectedTab === "all" ? selectedTabStyle : tabStyle}>ALL</div>
                  <div onClick={() => this.setState({selectedTab: "selected"})} style={this.state.selectedTab === "selected" ? selectedTabStyle: tabStyle}>Selected</div>
              </SidebarTabs>
              <SidebarSection selectedTab={this.state.selectedTab}>
                  <SidebarIcon icon={plotIcon} onClick={() => this.props.showSidebarPopup("plots-"+this.state.selectedTab)}></SidebarIcon>
                  <SidebarIcon icon={gemIcon} onClick={() => this.props.showSidebarPopup("gems-"+this.state.selectedTab)}></SidebarIcon>
                  <SidebarIcon icon={artifactIcon} style={{margin: "10px 0"}}></SidebarIcon>
              </SidebarSection>
              <SidebarSection>
                  <BuyButton>BUY PLOTS</BuyButton>
                  <BuyButton>PROCESS ALL</BuyButton>
              </SidebarSection>
              <SidebarSection>
                  <SidebarIcon icon={filterIcon} onClick={() => this.props.showSidebarPopup("filter")}></SidebarIcon>
              </SidebarSection>
              <SidebarSection>
                  <div>1 of 3</div>
                  <div style={buttonBlockStyle}>
                      <ArrowButton selected={activeControls.includes("page_btn_left")}
                                   onClick={() => prevPage()}>{'<'}</ArrowButton>
                      <ArrowButton selected={activeControls.includes("page_btn_right")}
                                   onClick={() => nextPage()}>{'>'}</ArrowButton>
                  </div>
              </SidebarSection>
              {/*<SidebarPopup type={this.state.showSidebarPopup} closeCallback={() => this.setState({showSidebarPopup: false})}/>*/}
              {/*{this.state.showSidebarFilters ?*/}
                {/*<PlotFilter*/}
                  {/*activeControls={activeControls}*/}
                  {/*applySort={(sortOption) => {*/}
                      {/*applySort(sortOption)*/}
                  {/*}}*/}
                  {/*applyFilter={(filterOption) => applyFilter(filterOption)}*/}
                  {/*nextPage={() => nextPage()}*/}
                  {/*prevPage={() => prevPage()}*/}
                  {/*closeCallback={() => this.setState({showSidebarFilter: false})}*/}
                {/*/> : ""}*/}
          </div>
        )
    }
}

// export class SidebarIcon extends Component {
//
//     shouldComponentUpdate(props, state) {
//         return false;
//     }
//
//     render() {
//
//
//         return (
//           <SidebarIconDiv icon={this.props.icon} onClick={() => this.props.onClick()}>{this.props.text}</SidebarIconDiv>
//         )
//     }
// }



export default PlotSidebar;