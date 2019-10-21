import React from 'react';
import worldChest from "./../../../app/images/sale/worldChest.png"
import gemstoneChests from "./../../../app/images/sale/chestOctoberOpal800.png"
import foundersChest from "./../../../app/images/sale/foundersChest.png"
import styled from 'styled-components';
import { calculateTimeLeftInDays, calculateTimeLeftInHours } from '../../../app/services/PlotService';

const ChestBarContainer = styled.div`
    display: flex;
    justify-content: center;
    background-color: #383F45;
    color: #D2D8DB;
    position: relative;
    margin-top: 20px;
`;

const ChestBar = styled.div`
    
    max-width: 1650px;
    width: 100%;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`;

const ChestContainer = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    align-content: center;
    align-items: center;
    @media((min-width: 571px) and (max-width: 1200px)) {
        min-width: 450px;
    }
    @media(max-width: 570px) {
        min-width: 320px;
    }
`;

const ChestContainerLink = styled.a`
    display: flex;
    flex: 1;
    color: inherit;
    justify-content: center;
    align-content: center;
    align-items: center;
    @media((min-width: 571px) and (max-width: 1200px)) {
        min-width: 450px;
    }
    @media(max-width: 570px) {
        min-width: 320px;
    }

    &:hover {
        color: inherit !important;
    }
`;


const Pink = styled.span`
    color: #FF00CD;
    font-size: 110%;
`;

const FullWidthLine = styled.div`
    position: absolute;
    background-color: #C51D8C;
    height: 6px;
    width: 100%;
    top: -12px;
    left: 0;
`;

const ChestImg = styled.img`
    @media((min-width: 571px) and (max-width: 1200px)) {
        max-height: 120px;
        height: auto;
        max-width: 140px;
        min-width: 100px;
    }
    @media(max-width: 570px) {
        max-width: 120px;
        height: auto;
    }
    height: 175px;
`;

const ChestValue = styled.div`
    @media((min-width: 571px) and (max-width: 1200px)) {
        font-size: 22px;
    }
    @media(max-width: 570px) {
        font-size: 18px;
    }
    font-size: 26px;
    color: #FF00CD;
`;

const ChestInfo = styled.div`
    @media((min-width: 571px) and (max-width: 1200px)) {
        font-size: 12px;
    }
    @media(max-width: 570px) {
        font-size: 10px;
    }
    font-size: 14px;
    max-width: 290px;
`;

const ChestTitle = styled.div`
    @media((min-width: 571px) and (max-width: 1200px)) {
        font-size: 20px;
    }
    @media(max-width: 570px) {
        font-size: 16px;
    }
    font-size: 24px;
`;

const MonthlyChestNumber = styled.div`
    @media((min-width: 571px) and (max-width: 1200px)) {
        font-size: 20px;
    }
    @media(max-width: 570px) {
        font-size: 16px;
    }
    font-size: 24px;
`;

const ChestDescription = styled.div`
    padding: 0 0 0px 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    line-height: 1.3;
    min-width: 250px;
    @media(max-width: 570px) {
        padding: 0 0 20px 10px;
    }
`;

const MonthlyChestDescription = styled.div`
    @media((min-width: 571px) and (max-width: 1200px)) {
        font-size: 12px;
    }
    @media(max-width: 570px) {
        font-size: 10px;
    }
    font-size: 14px;
    color: #8C9293;
`;

const MonthlyChestInfo = styled.div`
    @media((min-width: 571px) and (max-width: 1200px)) {
        font-size: 14px;
    }
    @media(max-width: 570px) {
        font-size: 12px;
        margin-bottom: 6px;
    }
    font-size: 16px;
    margin-bottom: 10px;
`;

const ChestsBar = ({worldChestValue, monthlyChestValue, foundersChestValue}) => {

    const chestTossTimestampSeconds = 1572102000; //1.5 days from now.
    const timeLeft = chestTossTimestampSeconds -  new Date().getTime()/1000; 
    const timeLeftInHours = Math.floor((timeLeft % (60 * 60 * 24)) / (60 * 60));
    const timeLeftInDays = Math.floor(timeLeft / (60 * 60 * 24));

    return (
      <ChestBarContainer>
          <FullWidthLine/>
          <ChestBar>
              <ChestContainer>
                  <ChestImg src={worldChest}/>
                  <ChestDescription>
                      <ChestValue>{worldChestValue && worldChestValue.toFixed(2)} ETH</ChestValue>
                      <ChestTitle>In The World Chest!</ChestTitle>
                      <ChestInfo>
                          {`Once the last plot of land is bought, one key will be able to open the World Chest`}
                      </ChestInfo>
                  </ChestDescription>
              </ChestContainer>
              <ChestContainerLink href="/chest">
                  <BounceChestImage src={gemstoneChests}/>
                  <ChestDescription>
                      <ChestTitle style={{fontSize:"22px", lineHeight:"110%"}}>A <Pink>10 ETH</Pink> Gemstone Chest is accepting Keys now!</ChestTitle>
                      <ChestTitle>Click <Pink>HERE</Pink> to try to open it!</ChestTitle>
                      <MonthlyChestDescription>
                          <Pink>{timeLeftInDays} </Pink>days
                          <Pink> {timeLeftInHours} </Pink>hours
                          {` until it will be opened!.`}</MonthlyChestDescription>
                      <MonthlyChestInfo>
                          <Pink>{monthlyChestValue && monthlyChestValue.toFixed(2)} ETH </Pink>
                          {`is in the next Gemstone Chest`}
                          </MonthlyChestInfo>
                  </ChestDescription>
              </ChestContainerLink>
              <ChestContainer>
                  <ChestImg src={foundersChest}/>
                  <ChestDescription>
                      <ChestValue>19.83 ETH</ChestValue>
                      <ChestTitle>In The Founder's Chest!</ChestTitle>
                      <MonthlyChestDescription>
                          <img src="https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FAquamarine%20Face%20Emoji.png?alt=media&amp;token=b759ae07-bb8c-4ec8-9399-d3844d5428ef"
                        width="30"/> Proof opened the chest on <Pink>8-23-19</Pink></MonthlyChestDescription>
                        <div>
                            <a target="_blank" href="https://etherscan.io/tx/0xbf2675b585ab7f5d4cba9565c2b1c9163b03cd1aba75c0260b987802a50b9703"
                            style={{color: "white"}}>
                                Click here to see Etherscan record</a>
                        </div>
                  </ChestDescription>
              </ChestContainer>
          </ChestBar>
      </ChestBarContainer>
    )
};

export default ChestsBar

const BounceChestImage = styled.img`

@media((min-width: 571px) and (max-width: 1200px)) {
    max-height: 120px;
    height: auto;
    max-width: 140px;
    min-width: 100px;
}
@media(max-width: 570px) {
    max-width: 120px;
    height: auto;
}
height: 175px;

 animation: bounce 2s infinite;
 -webkit-animation: bounce 2s infinite;
 -moz-animation: bounce 2s infinite;
 -o-animation: bounce 2s infinite;
}
 
@-webkit-keyframes bounce {

 0% {-webkit-transform: translateY(0);}
 
 20% {-webkit-transform: rotate(5deg);}
 25% {-webkit-transform: rotate(-5deg);}
 30% {-webkit-transform: rotate(5deg);}
 35% {-webkit-transform: rotate(-5deg);}
 40% {-webkit-transform: rotate(0deg);}
 
 50% {-webkit-transform: translateY(-30px);}
 
 60% {-webkit-transform: translateY(0);}
 
 70% {-webkit-transform: translateY(-15px);}
 100% {-webkit-transform: translateY(0);}
}
 
@-moz-keyframes bounce {
 0% {-moz-transform: translateY(0);}
 
 20% {-moz-transform: rotate(5deg);}
 25% {-moz-transform: rotate(-5deg);}
 30% {-moz-transform: rotate(5deg);}
 35% {-moz-transform: rotate(-5deg);}
 40% {-moz-transform: rotate(0deg);}
 
 55% {-moz-transform: translateY(-30px);}
 
 65% {-moz-transform: translateY(0);}
 
 75% {-moz-transform: translateY(-15px);}
 100% {-moz-transform: translateY(0);}
}
 
@-o-keyframes bounce {
 0%, 20%, 50%, 80%, 100% {-o-transform: translateY(0);}
 40% {-o-transform: translateY(-30px);}
 60% {-o-transform: translateY(-15px);}
}
@keyframes bounce {
 
 0% {transform: translateY(0);}
 
 20% {transform: rotate(5deg);}
 25% {transform: rotate(-5deg);}
 30% {transform: rotate(5deg);}
 35% {transform: rotate(-5deg);}
 40% {transform: rotate(0deg);}
 
 50% {transform: translateY(-30px);}
 
 60% {transform: translateY(0);}
 
 70% {transform: translateY(-15px);}
 100% {transform: translateY(0);}
}
`