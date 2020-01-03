import React, {Component} from "react";
import styled from "styled-components";
import PlotsPopup from "./PlotsPopup";
import SelectedPlotsPopup from "./SelectedPlotsPopup";
import SelectedGemsPopup from "./SelectedGemsPopup";
import GemsPopup from "./GemsPopup";
import FilterPopup from "./FilterPopup";
import GemSelectionPopup from "./GemSelectionPopup";
import ProceedCombinePopup from "../../dashboard/components/ProceedCombinePopup";
import ProcessAllPopup from "./ProcessAllPopup";
import GemCombinationPopup from "../../dashboard/components/GemCombinationPopup";

const OctagonLayoutOuter = styled.div`
            max-width: 900px;
            //max-height: 525px;
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
            width: 40%;
            min-width: 200px;
            height: 20px;
            background: #62626B;
            position: relative;
            margin-bottom: 29px;
            padding: 0 4px;
            z-index: 10;
         
         &:before { 
            content: "";
            width: 100%;
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
            //max-height: 525px;
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
            width: 100%;
            height: 20px;
            background: #2a3238;
            position: relative;
            margin-bottom: 29px;
            z-index: 20;
         
         &:before { 
            content: "";
            width: 100%;
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
};

const PlotActionPopup = styled.div`
    width: 300px;
    height: 80px;
    font-size: 16px;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
`;

const CloseButton = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    width: 85px;
    color: #fff;
    font-weight: bold;
    z-index: 20;
    font-size: 20px;
    
    @media(min-width: 801px) {
        display: none;
    }
`;

export class SidebarPopup extends Component {

    generatePopupContent() {
        switch (this.props.type) {
            case "plots-all":
                return <PlotsPopup plots={this.props.plots} setFilterOptions={this.props.setFilterOptions}/>;
            case "plots-selected":
                return <SelectedPlotsPopup plot={this.props.selectedPlot} showAnotherPopup={this.props.showAnotherPopup}
                                           processBlocks={this.props.processBlocks}
                                           stopMining={this.props.stopMining}/>;
            case "gems-all":
                return <GemsPopup gems={this.props.gems} plots={this.props.plots}
                                  goToGemWorkshop={this.props.goToGemWorkshop}
                                  setFilterOptions={this.props.setFilterOptions}
                />;
            case "gems-selected":
                return <SelectedGemsPopup selectedPlot={this.props.selectedPlot}
                                          showAnotherPopup={this.props.showAnotherPopup}
                                          handlePreLoadAuctionPage={this.props.handlePreLoadAuctionPage}
                                          stopMining={this.props.stopMining}/>;
            case "filter":
                return <FilterPopup activeControls={this.props.activeControls} applySort={this.props.applySort}
                                    applyFilter={this.props.applyFilter} filterDefault={this.props.filterDefault}/>;
            case "plot-action-start":
                return <GemSelectionPopup userGems={this.props.userGems} selectedPlot={this.props.selectedPlot}
                                          transactionStartCallback={this.props.closeCallback}
                                          showConfirmPopupCallback={() => this.props.showAnotherPopup("plot-confirm-start")}
                                          updatePlot={(modifiedPlot) => {
                                              this.props.updatePlot(modifiedPlot)
                                          }}/>;
            case "plot-action-stop":
                return <PlotActionPopup>Please confirm the transaction to stop mining</PlotActionPopup>;
            case "plot-confirm-start":
                return <PlotActionPopup>Please confirm the transaction to start mining</PlotActionPopup>;
            case "coming-soon":
                return <PlotActionPopup>Artifacts are coming soon</PlotActionPopup>;
            case "process-all":
                return <ProcessAllPopup plots={this.props.plots} processPlots={this.props.processPlots}/>
            case "gems-combine-choose-asset":
                    return <GemCombinationPopup showGemSelectionPopup={this.props.showGemSelectionPopup}/>
            case "gems-combine-select":
                if (this.props.gemsCombineAsset) {
                    return <GemSelectionPopup combineAsset={this.props.gemsCombineAsset} 
                                    showProceedCombinePopup={this.props.showProceedCombinePopup}
                                    goToMarketAndApplyFilters={this.props.goToMarketAndApplyFilters}/>
                }
            case "gems-combine-proceed": 
                if (this.props.gemsCombineAsset && 
                    this.props.selectedGemsToCombine && 
                    (this.props.selectedGemsToCombine.length === 4)) {
                        return <ProceedCombinePopup combineAsset={this.props.gemsCombineAsset}
                                                    proceedCombine={this.props.proceedCombine}
                                                    showGemSelectionPopup={this.props.showGemSelectionPopup}/>
                } 
        }
    }

    static generatePopupHeader(type) {
        switch (type) {
            case "plots-all":
                return "All of My Plots Info";
            case "plots-selected":
                return "Selected Plot Info";
            case "gems-all":
                return "All of My Gems Info";
            case "gems-selected":
                return "Selected Gem Info";
            case "plot-action-start":
                return "Available Gem Selection";
            case "plot-confirm-start":
                return "Start mining";
            case "filter":
                return "Sort & Filter Menu";
            case "plot-action-stop":
                return "Stop mining";
            case "coming-soon":
                return "Coming Soon";
            case "process-all":
                return "Plots Processing";
            default:
                return "";
        }
    }

    render() {
        console.debug("Props:", this.props);

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
        };

        return (
          <div style={shadowLayerStyle} onClick={() => this.props.closeCallback()}>
              <CloseButton onClick={() => this.props.closeCallback()}>Close X</CloseButton>
              <div style={popupStyle} onClick={(e) => {
                  e.stopPropagation()
              }}>
                {!this.props.hideHeader && 
                <SemiOctagonHeaderOuter>
                    <SemiOctagonHeaderInner>
                        <div style={{
                            fontSize: "20px", color: "#97A8B4", position: "absolute",
                            top: "-11px", width: "100%", textAlign: "center"
                        }}>
                            {SidebarPopup.generatePopupHeader(this.props.type)}
                        </div>
                    </SemiOctagonHeaderInner>
                </SemiOctagonHeaderOuter>
                }
                  <OctagonLayoutOuter>
                      <OctagonLayoutInner>
                          {this.generatePopupContent()}
                      </OctagonLayoutInner>
                  </OctagonLayoutOuter>
              </div>
          </div>
        );
    }


}

export default SidebarPopup;
