import React, {Component} from "react";
import styled from "styled-components";
import buyNowImage from "../../../app/images/pinkBuyNowButton.png";
import stubIcon from "./../../../app/images/icons/gem1.png";
import artifactIcon from "../../../app/images/artifactIcon.png";
import filterIcon from "../../../app/images/filterIcon.png";
import gemIcon from "../../../app/images/gemIcon.png";
import plotIcon from "../../../app/images/plotIcon.png";

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
    }
    
    @media(min-width: 600px) {
        flex-direction: column;    
        width: 150px;
        align-items: stretch;
    }

    display: flex;
    background-color: #383F45;
    font-size: 14px;
    padding: 5px;
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
        return state.selectedTab !== this.state.selectedTab;
    }

    render() {
        return (
          <Sidebar>
              <SidebarTabs>
                  <SidebarTab onClick={() => this.setState({selectedTab: "all"})}
                              selected={this.state.selectedTab === "all"}>
                      ALL
                  </SidebarTab>
                  <SidebarTab onClick={() => this.setState({selectedTab: "selected"})}
                              selected={this.state.selectedTab === "selected"}>
                      Selected
                  </SidebarTab>
              </SidebarTabs>
              <SidebarSection selectedTab={this.state.selectedTab} mobileFlex={4} mobileDirection={"row"}>
                  <SidebarIcon icon={plotIcon} onClick={() => this.props.showSidebarPopup("plots-"+this.state.selectedTab)}></SidebarIcon>
                  <SidebarIcon icon={gemIcon} onClick={() => this.props.showSidebarPopup("gems-"+this.state.selectedTab)}></SidebarIcon>
                  <SidebarIcon icon={artifactIcon} style={{margin: "10px 0"}}></SidebarIcon>
              </SidebarSection>
              <SidebarSection mobileFlex={3} mobileDirection={"column"}>
                  <BuyButton>BUY PLOTS</BuyButton>
                  <BuyButton>PROCESS ALL</BuyButton>
              </SidebarSection>
              <SidebarSection mobileFlex={1} mobileDirection={"row"}>
                  <SidebarIcon icon={filterIcon} onClick={() => this.props.showSidebarPopup("filter")}></SidebarIcon>
              </SidebarSection>
          </Sidebar>
        )
    }
}

export default PlotSidebar;