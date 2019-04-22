import {Component} from "react";
import styled from "styled-components";
import React from "react";
import PlotsPopup from "./PlotsPopup";
import SelectedPlotsPopup from "./SelectedPlotsPopup";
import SelectedGemsPopup from "./SelectedGemsPopup";
import GemsPopup from "./GemsPopup";
import FilterPopup from "./FilterPopup";
import GemSelectionPopup from "./GemSelectionPopup";

export class SidebarPopup extends Component {

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

    static generatePopupContent(props) {
        switch(props.type) {
            case "plots-all":
                return <PlotsPopup/>;
            case "plots-selected":
                return <SelectedPlotsPopup/>;
            case "gems-all":
                return <GemsPopup/>;
            case "gems-selected":
                return <SelectedGemsPopup/>;
            case "filter":
                return <FilterPopup/>;
            case "gem-selection":
                return <GemSelectionPopup userGems={props.userGems}/>
        }
    }

    static generatePopupHeader(type) {
        switch(type) {
            case "plots-all":
                return "All of My Plots Info";
            case "plots-selected":
                return "Selected Plot Info";
            case "gems-all":
                return "All of My Gems Info";
            case "gems-selected":
                return "Selected Gem Info";
            case "gem-selection":
                return "Available Gem Selection";
        }
    }

    render() {
        const OctagonLayoutOuter = styled.div`
            max-width: 900px;
            max-height: 525px;
            background: #62626B;
            position: relative;
            padding: 0 4px;
            z-index: 10;
         
         &:before { 
            content: "";
            width: 100%;
            height: 0;
            position: absolute;
            top: -29px;
            left: 0;
            border-bottom: 29px solid #62626B;
            border-left: 29px solid transparent;
            border-right: 29px solid transparent;
            } 
          
         &:after { 
            content: "";
            width: 100%;
            height: 0;
            position: absolute;
            bottom: -29px;
            left: 0;
            border-top: 29px solid #62626B;
            border-left: 29px solid transparent;
            border-right: 29px solid transparent;
       `;

        const SemiOctagonHeaderOuter = styled.div`
            width: 200px;
            height: 20px;
            background: #62626B;
            position: relative;
            margin-bottom: 29px;
            padding: 0 4px;
            z-index: 10;
         
         &:before { 
            content: "";
            width: 200px;
            height: 0;
            position: absolute;
            top: -18px;
            left: 0;
            border-bottom: 18px solid #62626B;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent; 
            } 
        `;


        const OctagonLayoutInner = styled.div`
            max-width: 892px;
            max-height: 525px;
            background: #2a3238;
            position: relative;
            z-index: 20;
         
         &:before { 
            content: "";
            width: 100%;
            height: 0;
            position: absolute;
            top: -26px;
            left: 0;
            border-bottom: 26px solid #2a3238;
            border-left: 26px solid transparent;
            border-right: 26px solid transparent;
            } 
          
         &:after { 
            content: "";
            width: 100%;
            height: 0;
            position: absolute;
            bottom: -26px;
            left: 0;
            border-top: 26px solid #2a3238;
            border-left: 26px solid transparent;
            border-right: 26px solid transparent;
       `;

        const SemiOctagonHeaderInner = styled.div`
            width: 192px;
            height: 20px;
            background: #2a3238;
            position: relative;
            margin-bottom: 29px;
            z-index: 20;
         
         &:before { 
            content: "";
            width: 192px;
            height: 0;
            position: absolute;
            top: -15px;
            left: 0;
            border-bottom: 15px solid #2a3238;
            border-left: 13px solid transparent;
            border-right: 13px solid transparent; 
            } 
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

        const shadowLayerStyle = {
            position: 'fixed',
            margin: 'auto',
            left: '0',
            right: '0',
            top: '0rem',
            bottom: '0',
            zIndex: '10',
            display: this.props.type ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: 'rgba(101,101,101,0.4)',
        }

        const popupStyle = {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "900px",
            maxHeight: "600px",
            fontSize: "12px",
            padding: "5px",
            alignItems: "center",
            color: "white",
            backgroundColor: 'transparent',
            cursor: "default",
        }


        return (
          <div style={shadowLayerStyle} onClick={() => this.props.closeCallback()}>
              <div style={popupStyle} onClick={(e) => {e.stopPropagation()}}>
                  <SemiOctagonHeaderOuter>
                      <SemiOctagonHeaderInner>
                          <div style={{
                              fontSize: "18px", color: "#97A8B4", position: "absolute",
                              top: "-11px", width: "100%", textAlign: "center"}}>
                              {SidebarPopup.generatePopupHeader(this.props.type)}
                          </div>
                      </SemiOctagonHeaderInner>
                  </SemiOctagonHeaderOuter>
                  <OctagonLayoutOuter>
                      <OctagonLayoutInner>
                          {SidebarPopup.generatePopupContent(this.props)}
                      </OctagonLayoutInner>
                  </OctagonLayoutOuter>
              </div>
          </div>
        );
    }


}

export default SidebarPopup;