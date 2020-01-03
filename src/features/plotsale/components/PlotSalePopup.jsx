import React, {Component, useState} from "react";
import styled from "styled-components";
import InfoBackground from "../../../app/images/plots/RefSysInfoBackground.png"
import InfoTable from "../../../app/images/plots/RefSysInfoTable.png"
import actionButtonImage from "../../../app/images/pinkBuyNowButton.png";
import faqButtonImage from '../../../app/images/darkGreyBlankButton.png';
import {CutEdgesButton} from "../../../components/CutEdgesButton";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import gemKid from '../../../app/images/gemKid.png';

export const PlotSalePopup = (props) => {

    const shadowLayerStyle = {
        position: 'fixed',
        margin: 'auto',
        left: '0',
        right: '0',
        top: '0rem',
        bottom: '0',
        zIndex: '10',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    };

    return <div style={shadowLayerStyle} onClick={() => props.handleClosePopup()}>
        <OctagonLayoutOuter onClick={(e) => {e.stopPropagation()}}>
            <OctagonLayoutInner>
            {generatePopupContent(props)}
            </OctagonLayoutInner>
        </OctagonLayoutOuter>
    </div>

}

const OctagonLayoutOuter = styled.div`
            max-width: 900px;
            max-height: 525px;
            background: #62626B;
            position: relative;
            padding: 0 4px;
            z-index: 10;
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

const PopupContainer = styled.div`
            @media (max-width: 600px) {
                font-size: 12px;
            }
        
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            font-size: 18px;
            min-width: 320px;
        `;

const ReferralSystemInfo = () => {
    return <div style={{width: "600px", padding: "0 10px", display: "flex", flexDirection: "column", alignItems: "center"}}>
    <div style={{fontSize: "26px", textAlign: "center", marginBottom: "20px"}}>
        Referral System for Plot of Land sale!
        </div>
    <TextRow style={{margin: "0"}}>The rundown on the referral system:</TextRow>
    <TextRow style={{margin: "0"}}><Pink>1.</Pink> Click “Create Referral Link”. That copies your link to your clipboard</TextRow>
    <TextRow style={{margin: "0"}}><Pink>2.</Pink> Are you sure you do not want to get any referral points?!</TextRow>
    <TextRow style={{margin: "0"}}><Pink>3.</Pink> Share that code with your friends, enemies and anyone else you want.</TextRow>
    <TextRow style={{margin: "0"}}><Pink>4.</Pink> When people use your link they will earn both themselves and you,
        Referral Points from their ﬁrst purchase of Plots of Land.</TextRow>
    
    <div style={{
        backgroundImage: `url(${InfoBackground})`,
        backgroundSize: "contain",
        display: "flex",
        width: "540px",
        height: "182px",
        padding: "17px",
        margin: "15px 0 30px",
        alignItems: "center"
    }}>
        <div style={{
            width: "280px",
            fontSize: "24px",
            lineHeight: "100%",
            marginRight: "10px"
        }}>
        For every <Pink>5</Pink> Plots they buy
        you will earn <Pink>2</Pink> points,
        they will earn <Pink>1</Pink> point.
        </div>
        <img src={InfoTable}/>
    </div>

    <TextRow style={{fontSize: "22px"}}>
        Every <Pink>4</Pink> Referral Points will get you <br/>
        <Pink> 1</Pink> FREE Plot of Land in the Bermuda Triangle!
    </TextRow>
</div>
}

const ConfirmReferredBuy = ({handleBuy, handleClose}) => {
    return <div style={{width: "600px", padding: "0 10px", display: "flex", flexDirection: "column", alignItems: "center"}}>
        <div style={{fontSize: "24px", textAlign: "center"}}>
            <img src={gemKid} width={50}/>
            Welcome to CryptoMiner World!!!
            <img src={gemKid} width={50} style={{marginLeft: "15px"}}/>
            </div>
        <TextRow>You were referred here, for every <Pink>5</Pink> Plots you buy you will
            receive <Pink>1</Pink> referral point and the person that referred you gets <Pink>2</Pink>!
        </TextRow>
        <TextRow>You selected less that <Pink>5</Pink> Plots of Land. You only can receive referral
            points for your first purchase in the game.
        </TextRow>
        <TextRow style={{fontSize: "20px"}}>Are you sure you do not want to get any referral points?!</TextRow>
        <div style={{display: "flex", justifyContent: "space-evenly", width: "100%"}}>
            <div style={{width: "140px"}}>
                <DarkButton edgeSizes={[4, 10]} height={52} fontSize={13} content={"Go back to get\\a myself more plots!!!"} onClick={handleClose}/>
            </div>
            <div style={{width: "140px"}}>
                <DarkButton edgeSizes={[4, 10]} height={52} fontSize={13} content={"I only want a few plots,\\a leave me alone!"} onClick={handleBuy}/>
            </div>
        </div>
        <div style={{marginTop: "15px"}}><Pink>4</Pink> referral points gets you <Pink>1</Pink> FREE Plot of Land!</div>
    </div>
}

const UseReferralPoints = ({pointsAvailable, handleBuy, currentUserId}) => {

    const [copied, setCopied] = useState(false)

    const plotsNumberToGet = Math.floor(pointsAvailable / 4);
    return <div style={{width: "600px", padding: "0 10px", display: "flex", flexDirection: "column", alignItems: "center"}}>
        <TextRow style={{fontSize: "24px"}}>Use your Referral Points for Plots of Land</TextRow>
        <TextRow><Pink>4</Pink> Referral Points for <Pink>1</Pink> Plot of Land in the Bermuda Triangle!</TextRow>
        <TextRow style={{fontSize: "22px"}}>You have: <Pink>{pointsAvailable}</Pink> Referral Points</TextRow>
        {pointsAvailable > 4 ?
        <TextRow style={{marginTop: "5px"}}>Want to use <Pink>{plotsNumberToGet * 4}</Pink> Referral Points to get <Pink>{plotsNumberToGet}</Pink> Plots Of Land?</TextRow>
        :
        <TextRow style={{marginTop: "5px"}}>Use you Referral Link to earn more points!</TextRow> 
        }
        {pointsAvailable > 4 ? 
            <BuyButton onClick={() => handleBuy(plotsNumberToGet)}>
                Use Referral Points
            </BuyButton> :
            <div style={{width: "300px"}}>
                <CopyToClipboard
                    text={"https://game.cryptominerworld.com/plots?refId=" + currentUserId}
                    onCopy={() => setCopied(true)}>
                    <DarkButton edgeSizes={[2, 15]} 
                        backgroundColor={"#2A3238"} 
                        outlineColor={"#DADAE8"}
                        fontSize={24}
                        content={copied ? "Copied to clipboard" : "Create Referral Link"}/>
                </CopyToClipboard>
            </div>
        }
        {pointsAvailable > 4 ? 
            <div style={{width: "400px", marginTop: "10px"}}>
                <DarkButton edgeSizes={[3, 30]} content={"I only want to get 1 plot of land (4 Referral Points)"} 
                onClick={() => handleBuy(1)}/>
            </div> : ""
        }
    </div>
}

const TryCreateReferralLink = () => {
    return <div style={{width: "600px", padding: "0 10px", display: "flex", flexDirection: "column", alignItems: "center"}}>
        <TextRow style={{fontSize: "26px"}}>Thanks for trying to create a Referral Link!</TextRow>
        <TextRow style={{fontSize: "20px", marginTop: "20px"}}>Unfortunately you can not do that just yet. 
        To refer people you need to have bought a Gem or a Plot of Land. After you buy either you will be able to create referral links.
        </TextRow>
        <TextRow style={{fontSize: "20px", marginTop: "0"}}>Thanks!</TextRow>
        
    </div>
}

const BuyButton = styled.div`
    background-image: url(${actionButtonImage});
    background-position: center center;
    text-align: center;
    background-size: contain;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px 0px 20px;
    cursor: pointer;
    color: white;
    width: 230px;
    font-size: 22px;
    margin: 0 0 10px;
`;

const Pink = styled.span`color: #ff00cd`;

const TextRow = styled.div`
    text-align: center;
    margin: 0 0 20px 0;
    line-height: 110%;
`

const DarkButton = ({content, ...props}) => {
    return (
          <CutEdgesButton outlineColor={"#DADAE8"}
                          backgroundColor={"#282d33"}
                          outlineWidth={2}
                          height={34}
                          fontSize={16}
                          content={content}
                          otherStyles={"z-index: 1"}
                          {...props}/>
      )
};


const generatePopupContent = ({referrer, pointsAvailable, plotsChosen, showInfo, usePoints, handleClosePopup, handleBuy, currentUserId, wantToBeReferrer}) => {
    if (usePoints && pointsAvailable > 0) {
        return <PopupContainer>
            <UseReferralPoints handleBuy={(count) => handleBuy(count, handleClosePopup)} pointsAvailable={pointsAvailable} currentUserId={currentUserId}/>
        </PopupContainer>
    }
    if (showInfo) {
        return <PopupContainer>
            <ReferralSystemInfo/>
        </PopupContainer>
    }
    if (plotsChosen < 5 && referrer) {
        return <PopupContainer>
            <ConfirmReferredBuy handleBuy={() => handleBuy(handleClosePopup)} handleClose = {handleClosePopup}/>
        </PopupContainer>
    }
    if (wantToBeReferrer) {
        return <PopupContainer>
            <TryCreateReferralLink handleClose = {handleClosePopup}/>
        </PopupContainer>
    }
    return "";
}
