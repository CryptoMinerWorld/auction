import React, {Component} from "react";
import styled from "styled-components";
import {compose} from "redux";
import connect from "react-redux/es/connect/connect";
import gemCombinationImage from "../../../app/images/dashboard/gemCombinationIcon350.png"
import goldBorder from "../../../app/images/dashboard/goldBorder.png"
import silverBorder from "../../../app/images/dashboard/silverBorder.png"
import silverAmounts from "../../../app/images/dashboard/silverAmountsReceived.png"
import goldAmounts from "../../../app/images/dashboard/goldAmountsReceived.png"
import silverButton from "../../../app/images/sale/silverButtonNoText.png"
import goldButton from "../../../app/images/sale/goldButtonWithoutText.png"
import GemSelectionCard from "../../plots/components/GemSelectionCard";
import {
    typePaneColors, 
    typePaneOutlineColors 
} from "./propertyPaneStyles";
import { CutEdgesButton } from "../../../components/CutEdgesButton";
import { SET_DEFAULT_GEM_SELECTION_FILTERS } from "../dashboardConstants";
import ApproveGemBurnPopup from "./ApproveGemBurnPopup";
import { approveGemBurn } from "../dashboardActions";
import SidebarPopup from "../../plots/components/SidebarPopup";

const select = store => ({
    selectedGems: store.dashboard.selectedGems
});

export class ProceedCombinePopup extends Component {

    state = {
        showApproveGemBurnPopup: false
    };

    calculateAssetAmount() {
        const goldAmounts = [1, 2, 4, 9, 33, 69];
        const silverAmounts = [1100, 2800, 7700, 20000, 80000];
        const {selectedGems, combineAsset} = this.props;
        
        if (selectedGems.length === 4) {
            if (combineAsset === "silver" && selectedGems.every(gem => gem.level === selectedGems[0].level)) {
                return silverAmounts[selectedGems[0].level - 1]
            } else if (combineAsset === "gold" && selectedGems.every(gem => gem.gradeType === selectedGems[0].gradeType)) {
                return goldAmounts[selectedGems[0].gradeType - 1]
            }
        }
        return 0;
    }

    render() {
        const {selectedGems, combineAsset, proceedCombine, showGemSelectionPopup,
             handleSetDefaultFilters, handleApproveGemBurn} = this.props;
        const {showApproveGemBurnPopup} = this.state;
        return (
          <PopupContainer>
              <Row style={{margin: "0"}}>
                    <div style={{fontSize: "26px"}}><Pink>Gem Combination</Pink></div>
              </Row>
              <Row style={{textAlign: "center", marginTop: "20px"}}>
                    You have selected these 4 Gems. They will now be sacrificed... Shhh. 
                    They will now go on a fantastical vacation that is something they totally want to do. 
                    They will be gone forever, in return you will get something shiny!
              </Row>
              <Row style={{flexWrap: "wrap"}}>
                  {selectedGems.map(gem => 
                    <div key={gem.id} style={{width: "160px", margin: "0 5px"}}>
                        <GemSelectionCard 
                            backgroundColor={typePaneColors(gem.color)} 
                            outlineColor={typePaneOutlineColors(gem.color)} 
                            auction={gem}
                            available={true}
                            onClick={() => {}}
                        />
                    </div>
                  )}
              </Row>
              <Row>
                  Are you sure you want to go through with this? I mean, nothing bad happens to your Gems... 
                  It is relatively painless... You will never see these Gems ever again... 😬
              </Row>
              <Row style={{width: "100%", justifyContent: "space-evenly"}}>
                    <ProceedCombineSection>
                        {combineAsset === "silver" ? 
                        <CreateSilverButton onClick={() => proceedCombine(
                            () => this.setState({showApproveGemBurnPopup: true})
                        )}>
                            Create {this.calculateAssetAmount()} Silver
                        </CreateSilverButton> : ""}
                        {combineAsset === "gold" ? 
                        <CreateGoldButton onClick={() => proceedCombine(
                            () => this.setState({showApproveGemBurnPopup: true})
                        )}>
                            Create {this.calculateAssetAmount()} Gold
                        </CreateGoldButton> : ""}
                    </ProceedCombineSection>
                    <CancelCombineSection>
                              <CutEdgesButton outlineColor={"white"}
                                              fontColor={"#dedede"}
                                              backgroundColor={"black"}
                                              edgeSizes={[5, 10]}
                                              outlineWidth={3}
                                              height={72}
                                              fontSize={20}
                                              content={"No, I want to \\A spare them!"}
                                              onClick={() => {
                                                handleSetDefaultFilters()
                                                showGemSelectionPopup(null)
                                              }}/>
                    </CancelCombineSection>
              </Row>
            {showApproveGemBurnPopup ? 
                <SidebarPopup
                    type={"approve-gem-burn"}
                    hideHeader={true}
                    onApprovedCallback={proceedCombine}
                    confirmApprove={() => {
                        handleApproveGemBurn({
                            onTransactionSent: () => this.setState({proceedStatus: "sent"}),
                            onApproveCallback: () => {
                                this.setState({showApproveGemBurnPopup: false})
                                proceedCombine()
                            },
                            hidePopup: () => this.setState({showApproveGemBurnPopup: false})
                        })
                    }}
                    cancelApprove={() => this.setState({showApproveGemBurnPopup: false})}
                    closeCallback={() => this.setState({showApproveGemBurnPopup: false})}
                /> : ""
            }
          </PopupContainer>
        );
    }
}

const ProceedCombineSection = styled.div`

`;

const CancelCombineSection = styled.div`
    width: 200px;
    margin: 10px 20px;
`;

const CreateSilverButton = styled.div`
    background-image: url(${silverButton});
    background-size: contain;
    background-repeat: no-repeat;
    width: 280px;
    height: 100px;
    padding: 26px 0;
    text-align: center;
    color: #5d5d5d;
    font-size: 24px;
    cursor: pointer;
`;

const CreateGoldButton = styled.div`
    background-image: url(${goldButton});
    background-size: contain;
    background-repeat: no-repeat;
    width: 280px;
    height: 120px;
    padding: 36px 0;
    text-align: center;
    color: #5d5d5d;
    font-size: 26px;
    cursor: pointer;
`;

const PopupContainer = styled.div`
            @media (max-width: 600px) {
                font-size: 12px;
            }
        
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            padding: 0 1%;
            font-size: 15px;
            font-weight: bold;
            min-width: 320px;
            max-width: 720px;
        `;

const Row = styled.div`
            display: flex;
            align-items: center;
            margin: 10px 0;
`

const Pink = styled.span`
    color: #FF00CD;
`;

export default compose(
  connect(
    select,
    {
        handleSetDefaultFilters: () => ({type: SET_DEFAULT_GEM_SELECTION_FILTERS}),
        handleApproveGemBurn: approveGemBurn
    }
  )
)(ProceedCombinePopup);