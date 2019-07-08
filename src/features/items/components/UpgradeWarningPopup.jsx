import styled from "styled-components";
import React from "react";
import gemKid from '../../../app/images/gemKid_w200.png';
import {CutEdgesButton} from "../../../components/CutEdgesButton";
import {
    greenOutlineColor,
    greenPaneColor,
    mrbOutlineColor,
    mrbPaneColor, redOutlineColor, redPaneColor
} from "../../plots/components/propertyPaneStyles";

export const UpgradeWarningPopup = ({
  useEnergyCallback, upgradeCallback
}) => {

    return (
      <OctagonLayoutOuter onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
      }}>
          <OctagonLayoutInner>
              <div style={{
                  fontSize: "20px", color: "#97A8B4",
                  top: "-11px", width: "100%", textAlign: "center",
                  display: 'flex', flexDirection: 'column', padding: '0 10px', alignItems: 'center'
              }}>
                  <WarningContainer>
                      WARNING!!!
                  </WarningContainer>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                      <GemKidImage src={gemKid}/>
                      <WarningDescription>
                          <div>Hey there,</div>
                          <div>{`You have a Gem with a lot of Resting Energy.
                          If you Increase your Grade, all its Energy will be erased.
                          We suggest waiting until after us use all your energy.
                          But if you really want to Up-Grade.
                          Then click the appropriate button below
                          `}</div>
                      </WarningDescription>
                  </div>
                  <CutEdgesButton
                    outlineColor={greenOutlineColor}
                    backgroundColor={greenPaneColor}
                    fontColor={greenOutlineColor}
                    edgeSizes={[4, 20]}
                    outlineWidth={3}
                    fontSize={20}
                    height={55}
                    content={"Don't waste energy, Don't Up-Grade"}
                    otherStyles={"font-weight: bold; margin: 10px 0; width: 380px;"}
                    onClick={() => useEnergyCallback()}
                  />
                  <CutEdgesButton
                    outlineColor={redOutlineColor}
                    backgroundColor={redPaneColor}
                    fontColor={redOutlineColor}
                    edgeSizes={[3, 20]}
                    outlineWidth={3}
                    fontSize={16}
                    height={46}
                    content={"Waste energy and Up-Grade"}
                    otherStyles={"width: 280px; font-weight: bold; margin: 10px 0;"}
                    onClick={() => upgradeCallback()}
                  />
              </div>
          </OctagonLayoutInner>
      </OctagonLayoutOuter>
    )
};

const WarningDescription = styled.div`
    color: white;
    font-size: 15px;
    text-align: left;
    margin-left: 10px;
    line-height: 1.3;
    font-weight: bold;
`;

const GemKidImage = styled.img`
    width: 160px;
    height: 100%;
`;

const WarningContainer = styled.div`
    color: #FF0B29;
    text-stroke: 1px white;
    -webkit-text-stroke: 1px white;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    align-content: center;
    font-size: 46px
    padding: 5px 15px;
    background-color: #24292F;
    clip-path: polygon(4% 0,96% 0,100% 22%,100% 78%,96% 100%,4% 100%,0 78%,0% 22%);
    -webkit-clip-path: polygon(4% 0,96% 0,100% 22%,100% 78%,96% 100%,4% 100%,0 78%,0% 22%);
    margin-bottom: 10px;
    font-weight: bold;
    width: 100%;
`;

const OctagonLayoutOuter = styled.div`
            max-width: 480px
            min-width: 320px;
            max-height: 500px;
            background: #62626B;
            position: relative;
            padding: 0 4px;
            z-index: 10;
            margin: auto;
            cursor: default;
         
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


const OctagonLayoutInner = styled.div`
            max-width: 472px;
            min-width: 312px;
            max-height: 500px;
            background: #383F45;
            position: relative;
            z-index: 20;
         
         &:before { 
            content: "";
            width: 100%;
            height: 0;
            position: absolute;
            top: -26px;
            left: 0;
            border-bottom: 26px solid #383F45;
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
            border-top: 26px solid #383F45;
            border-left: 26px solid transparent;
            border-right: 26px solid transparent;
       `;