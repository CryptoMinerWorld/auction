import React from 'react';
import worldChest from "./../../../app/images/sale/worldChest.png"
import gemstoneChests from "./../../../app/images/sale/gemstoneChests.png"
import foundersChest from "./../../../app/images/sale/foundersChest.png"
import styled from 'styled-components';

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
    padding: 0 0 20px 20px;
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
              <ChestContainer>
                  <ChestImg src={gemstoneChests}/>
                  <ChestDescription>
                      <ChestValue>{monthlyChestValue && (monthlyChestValue % 10).toFixed(2)} ETH</ChestValue>
                      <MonthlyChestInfo>
                          {`In the current Gemstone Chest`}
                          </MonthlyChestInfo>
                      <MonthlyChestDescription>{`Gemstone Chest opens after `}<Pink>10 ETH</Pink>{` fills it.`}</MonthlyChestDescription>
                      <MonthlyChestDescription><Pink>{(monthlyChestValue || Number(monthlyChestValue) >= 0) ? (10 - (monthlyChestValue % 10).toFixed(2)) : ""}</Pink>
                          {` until this one can be opened!.`}</MonthlyChestDescription>
                      <MonthlyChestInfo><Pink
                        style={{fontSize: "150%"}}>{(monthlyChestValue || Number(monthlyChestValue) >= 0) ? Math.floor(monthlyChestValue / 10) : ""}</Pink>
                          {` Gemstone Chests Opened so far! `}
                      </MonthlyChestInfo>
                  </ChestDescription>
              </ChestContainer>
              <ChestContainer>
                  <ChestImg src={foundersChest}/>
                  <ChestDescription>
                      <ChestValue>19.83 ETH</ChestValue>
                      <ChestTitle>In The Founder's Chest!</ChestTitle>
                      <MonthlyChestDescription>
                          <img src="https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FAquamarine%20Face%20Emoji.png?alt=media&amp;token=b759ae07-bb8c-4ec8-9399-d3844d5428ef"
                        width="30"/> Proof opened the chest on <Pink>8-23-19</Pink></MonthlyChestDescription>
                  </ChestDescription>
              </ChestContainer>
          </ChestBar>
      </ChestBarContainer>
    )
};

export default ChestsBar
