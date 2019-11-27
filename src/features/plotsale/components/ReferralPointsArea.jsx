import styled from 'styled-components';
import faqButtonImage from '../../../app/images/darkGreyBlankButton.png';
import React, {useState} from "react";
import {CutEdgesButton} from "../../../components/CutEdgesButton";
import {CopyToClipboard} from 'react-copy-to-clipboard';

export const ReferralPointsArea = ({referralPoints, showInfoPopup, showUsePointsPopup, showWantToBeReferrerPopup ,currentUserId, canBeReferrer}) => {

    const [copied, setCopied] = useState(false)

  return (
  <Container>
    <OctagonLayoutOuter>
        <OctagonLayoutInner>
            <div style={{display: 'flex', padding: "5px"}}>
                <div style={{width: "32px", margin: "5px 5px"}}>
                    <DarkButton edgeSizes={[20, 20]} content={"i"} fontSize={24} onClick={showInfoPopup}/>
                </div>
                <div style={{width: "200px", margin: "5px 5px"}}>
                {canBeReferrer ? 
                    <CopyToClipboard
                    text={"https://game.cryptominerworld.com/plots?refId=" + currentUserId}
                    onCopy={() => setCopied(true)}>
                       <DarkButton edgeSizes={[4, 20]} 
                       backgroundColor={"#2A3238"} 
                       outlineColor={"#DADAE8"}
                       content={copied ? "Copied to clipboard" : "Create Referral Link"}/>
                    </CopyToClipboard>
                    :
                    <DarkButton 
                        onClick={showWantToBeReferrerPopup}
                        edgeSizes={[4, 20]} 
                        backgroundColor={"#62626b"} 
                        outlineColor={"#939393"}
                        content={"Create Referral Link"}/>
                }
                </div>
            </div>
            <div style={{display: 'flex', padding: "0px 5px"}}>
                <div style={{margin: "0px 5px", width: "100%"}}>
                    <DarkButton onClick={showUsePointsPopup} edgeSizes={[3, 20]} 
                    backgroundColor={referralPoints > 0 ? "#2A3238" : "#62626b"} 
                    outlineColor={referralPoints > 0 ? "#DADAE8" : "#939393"}
                    content={`Referral Points: ${referralPoints ? referralPoints : ""}`}/>
                </div>
            </div>
        </OctagonLayoutInner>
    </OctagonLayoutOuter>
  </Container>)
}

const OctagonLayoutOuter = styled.div`
            max-width: 900px;
            max-height: 525px;
            background: #62626B;
            position: relative;
            padding: 0 0 0 4px;
            z-index: 10;
         
         &:after { 
            content: "";
            width: 100%;
            height: 0;
            position: absolute;
            bottom: -19px;
            left: 0;
            border-top: 19px solid #62626B;
            border-left: 19px solid transparent;
       `;

const OctagonLayoutInner = styled.div`
            max-width: 892px;
            max-height: 525px;
            background: #2a3238;
            position: relative;
            z-index: 20;
         
          
         &:after { 
            content: "";
            width: 100%;
            height: 0;
            position: absolute;
            bottom: -15px;
            left: 0;
            border-top: 16px solid #2a3238;
            border-left: 16px solid transparent;
       `;


const Container = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;

    @media(max-width: 800px) {
        padding-left: 0;
    }
`;

const DarkButton = ({content, ...props}) => {
    return (
          <CutEdgesButton outlineColor={"#DADAE8"}
                          backgroundColor={"#2A3238"}
                          outlineWidth={2}
                          height={32}
                          fontSize={16}
                          content={content}
                          otherStyles={"z-index: 1"}
                          {...props}/>
      )
};