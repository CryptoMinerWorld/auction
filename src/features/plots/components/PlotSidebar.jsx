import React, {Component} from "react";
import styled from "styled-components";
import buyNowImage from "../../../app/images/pinkBuyNowButton.png";
import stubIcon from "./../../../app/images/icons/gem1.png";
import artifactIcon from "../../../app/images/artifactIcon.png";
import filterIcon from "../../../app/images/filterIcon.png";
import gemIcon from "../../../app/images/gemIcon.png";
import plotIcon from "../../../app/images/plotIcon.png";
import {Link} from "react-router-dom";

const SidebarSection = styled.div`
    @media(max-width: 599px) {
        height: 80px;
        margin: 0;
        flex: ${props => props.mobileFlex ? props.mobileFlex : "1"};
        flex-direction: ${props => props.mobileDirection ? props.mobileDirection : "row"};
        justify-content: space-evenly;
    }
    
    @media(min-width: 600px) {
        margin: 0 0 10px 0px;
        flex-direction: column;
        border-radius: ${props => props.selectedTab && props.selectedTab === "selected" ? "0 0 10px 0" : "0 10px 10px 0"};
    }
    
    display: flex;
    align-items: center;
    color: white;
    background-color: #2B3035;
    padding: 4px 0px;
`;

const BuyButton = styled.div`
    @media(max-width: 599px) {
        font-size: 11px;
        padding: 0;
    }

    flex: 4;
    background-image: url(${buyNowImage});
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

const Sidebar = styled.div`
    @media(max-width: 599px) {
        width: 100%;
        flex-wrap: wrap;
        bottom: 0;
        flex-direction: row;
        position: fixed;
        padding: 0px;
        z-index: 15;
    }
    
    @media(min-width: 600px) {
        flex-direction: column;    
        width: 150px;
        align-items: stretch;
    }

    display: flex;
    background-color: #383F45;
    font-size: 14px;
    padding: 5px 5px 5px 0;
    position: relative;
    color: white
`;

const SidebarIcon = styled.div`

    @media(max-width: 599px) {
        padding: 29px 15px;
        background-size: contain;
        
        &:nth-child(2) {
            padding: 29px 22px;
        }
        
        &:only-child {
            padding: 29px 20px;
        }
    }

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
    opacity: ${props => props.disabled ? "0.25" : "1"};       
`;

const SidebarTabs = styled.div`
   @media(max-width: 599px) {
        width: 100%;
        font-size: 14px;
   }
   display: flex;
`;

const SidebarTab = styled.div`
    flex: 1;
    ${props => props.selected ? 'background-color: #2B3035;' : ''}
    ${props => props.selected ? 'border-radius: 5px 5px 0 0;' : ''}
    padding: 5px;
    text-align: center;
    font-size: 12px;
    cursor: pointer;
`;


class PlotSidebar extends Component {

    state = {
        showSidebarFilters: false,
        selectedTab: "all",
    }

    shouldComponentUpdate(props, state) {
        return state.selectedTab !== this.state.selectedTab || props.plotSelected !== this.props.plotSelected || props.isOwner !== this.props.isOwner;
    }

    componentDidUpdate(prevProps) {
        if (this.props.plotSelected && this.props.plotSelected !== prevProps.plotSelected) {
            this.setState({selectedTab: "selected"});
        }
    }

    render() {
        const {plotSelected, isOwner} = this.props;
        const {selectedTab} = this.state;
        const disableSidebarIcons = ((selectedTab === "selected") && !plotSelected) || !isOwner;
        const disableSidebarGemIcon = ((selectedTab === "selected") && (!plotSelected || (plotSelected && !plotSelected.gemMines))) || !isOwner;
        return (
          <Sidebar>
              <SidebarTabs>
                  <SidebarTab onClick={() => this.setState({selectedTab: "all"})}
                              selected={selectedTab === "all"}>
                      ALL
                  </SidebarTab>
                  <SidebarTab onClick={() => this.setState({selectedTab: "selected"})}
                              selected={selectedTab === "selected"}>
                      Selected
                  </SidebarTab>
              </SidebarTabs>
              <SidebarSection selectedTab={selectedTab} mobileFlex={4} mobileDirection={"row"}>
                  <SidebarIcon disabled={disableSidebarIcons} icon={plotIcon} onClick={() => !disableSidebarIcons && this.props.showSidebarPopup("plots-"+selectedTab)}/>
                  <SidebarIcon disabled={disableSidebarGemIcon} icon={gemIcon} onClick={() => !disableSidebarGemIcon && this.props.showSidebarPopup("gems-"+selectedTab)}/>
                  <SidebarIcon disabled={true} icon={artifactIcon} style={{margin: "10px 0"}}
                               onClick={() => this.props.showSidebarPopup("coming-soon")}
                  />
              </SidebarSection>
              <SidebarSection mobileFlex={3} mobileDirection={"column"}>
                  <BuyButton><a style={{width: "100%", color: "white"}} href={'/plots'}>BUY PLOTS</a></BuyButton>
                  <BuyButton onClick={() => this.props.showSidebarPopup("process-all")}>PROCESS ALL</BuyButton>
              </SidebarSection>
              <SidebarSection mobileFlex={1} mobileDirection={"row"}>
                  <SidebarIcon icon={filterIcon} onClick={() => this.props.showSidebarPopup("filter")}/>
              </SidebarSection>
          </Sidebar>
        )
    }
}

export default PlotSidebar;