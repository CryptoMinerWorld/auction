import {Component} from "react";
import styled from "styled-components";
import React from "react";
import actionButtonImage from "../app/images/noTextGemButton.png";

const ActionButton = styled.div`
            background-image: url(${actionButtonImage});
            background-position: center center;
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
            font-size: 18px;
            margin-top: 10px;
            position: absolute;
            bottom: -20px;
            z-index: 30;
            width: 100px;
        `;

const OctagonLayoutOuter = styled.div`
            max-width: 900px;
            max-height: 525px;
            background: #62626B;
            position: relative;
            padding: 0 4px;
            z-index: 30;
         
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
            z-index: 30;
         
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
            max-height: 525px;
            background: #2a3238;
            position: relative;
            z-index: 40;
         
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
            z-index: 40;
         
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

const LootContainer = styled.div`

    @media(min-width: 500px) {
        width: 500px
    }
    
    width: 320px;
    min-height: 80px;
    display: flex;
    padding: 0px 5px 15px;
    font-size: 18px;
    color: #CFCFD3;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
`;

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

const LootMessage = styled.div`
    font-size: 20px;
    color: #939399;
    text-align: center;
`;

const LootRow = styled.div`
    margin: 3px 0;
    text-align: center;
`;

export class LootPopup extends Component {

    componentDidMount() {
        // this.setState({
        //     activeOptions: this.props.activeOptions
        // });
    }

    generateLootModal = (lootFound, lootEmpty) => {
        console.log("GENERATE LOOT MODAL", lootFound);
        const lootArray = lootFound['loot'];

        if (lootEmpty) {
            return <LootContainer>
                <div>Nothing was found</div>
                <ActionButton onClick={this.props.onClose}>Close</ActionButton>
            </LootContainer>
        }
        else {
            return (<LootContainer>
                {lootFound['plotState'] && <LootMessage>{`After Processing the ${lootFound['blocksProcessed']} Blocks ${' '}
                of ${lootFound['plotsProcessed']} plots your Gems mined, You Found:`}</LootMessage>}
                {!lootFound['plotState'] && <LootMessage>{`Your Gem used its Resting Energy!
                    It mined as deep as it could. Below is what it found. It is now returning back to the workshop.`}</LootMessage>}
                {Number(lootArray[0]) > 0 && <LootRow>{lootArray[0]} Level 1 Gem{Number(lootArray[0]) > 1 ? "s" : ""}</LootRow>}
                {Number(lootArray[1]) > 0 && <LootRow>{lootArray[1]} Level 2 Gem{Number(lootArray[1]) > 1 ? "s" : ""}</LootRow>}
                {Number(lootArray[2]) > 0 && <LootRow>{lootArray[2]} Level 3 Gem{Number(lootArray[2]) > 1 ? "s" : ""}</LootRow>}
                {Number(lootArray[3]) > 0 && <LootRow>{lootArray[3]} Level 4 Gem{Number(lootArray[3]) > 1 ? "s" : ""}</LootRow>}
                {Number(lootArray[4]) > 0 && <LootRow>{lootArray[4]} Level 5 Gem{Number(lootArray[4]) > 1 ? "s" : ""}</LootRow>}
                {Number(lootArray[5]) > 0 && <LootRow>{lootArray[5]} Piece{Number(lootArray[5]) > 1 ? "s" : ""} of Silver</LootRow>}
                {Number(lootArray[6]) > 0 && <LootRow>{lootArray[6]} Piece{Number(lootArray[6]) > 1 ? "s" : ""} of Gold</LootRow>}
                {Number(lootArray[7]) > 0 && <LootRow>{lootArray[7]} Artifacts</LootRow>}
                {Number(lootArray[8]) > 0 && <LootRow>{lootArray[8]} Key{Number(lootArray[8]) > 1 ? "s" : ""}</LootRow>}

                <ActionButton onClick={this.props.onClose}>Close</ActionButton>
            </LootContainer>)
        }
    }

    render() {
        const shadowLayerStyle = {
            position: 'fixed',
            margin: 'auto',
            left: '0',
            right: '0',
            top: '0rem',
            bottom: '0',
            zIndex: '30',
            display: this.props.visible ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: 'rgba(101,101,101,0.4)',
        }

        console.log("Loot event:: ", this.props.lootFound);
        const lootFound = this.props.lootFound;
        const lootEmpty = !(lootFound['loot'].find(el => Number(el) > 0));
        return (
          <div style={shadowLayerStyle} onClick={this.props.onClose}>
              <div style={popupStyle} onClick={(e) => {e.stopPropagation()}}>
                  <SemiOctagonHeaderOuter>
                      <SemiOctagonHeaderInner>
                          <div style={{
                              fontSize: "20px", color: "#97A8B4", position: "absolute",
                              top: "-11px", width: "100%", textAlign: "center"}}>
                              {lootEmpty ? "No Loot" : "Loot Found"}
                          </div>
                      </SemiOctagonHeaderInner>
                  </SemiOctagonHeaderOuter>
                  <OctagonLayoutOuter>
                      <OctagonLayoutInner>
                          {this.generateLootModal(lootFound, lootEmpty)}
                      </OctagonLayoutInner>
                  </OctagonLayoutOuter>
              </div>
          </div>
        );
    }


}

export default LootPopup;
