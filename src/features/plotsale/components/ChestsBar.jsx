import React from 'react';
import worldChest from "./../../../app/images/sale/worldChest.png"
import monthlyChests from "./../../../app/images/sale/monthlyChests.png"
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
    
    max-width: 1450px;
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
    min-width: 500px;
   
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
    @media(max-width: 1200px) {
        height: 150px;
    }
    height: 175px;
`

const ChestValue = styled.div`
    @media(max-width: 1200px) {
        font-size: 22px;
    }
    font-size: 26px;
    color: #FF00CD;
`

const ChestInfo = styled.div`
    @media(max-width: 1200px) {
        font-size: 12px;
    }
    font-size: 14px;
    max-width: 290px;
`

const ChestTitle = styled.div`
    @media(max-width: 1200px) {
        font-size: 20px;
    }
    font-size: 24px;
`

const MonthlyChestNumber = styled.div`
    @media(max-width: 1200px) {
        font-size: 20px;
    }
    font-size: 24px;
`

const ChestDescription = styled.div`
    padding: 0 0 20px 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    line-height: 1.3;
`

const MonthlyChestDescription = styled.div`
    @media(max-width: 1200px) {
        font-size: 12px;
    }
    font-size: 14px;
    color: #8C9293;
`;

const ChestsBar = ({worldChestValue, monthlyChestsValue}) => {
    return (
      <ChestBarContainer>
          <FullWidthLine/>
          <ChestBar>
              <ChestContainer>
                  <ChestImg src={worldChest}/>
                  <ChestDescription>
                      <ChestValue>123.89 ETH</ChestValue>
                      <ChestTitle>In The World Chest!</ChestTitle>
                      <ChestInfo>Once the last plot of land is bought, one key will be able to open the
                          World Chest
                      </ChestInfo>
                  </ChestDescription>
              </ChestContainer>
              <ChestContainer>
                  <ChestImg src={monthlyChests}/>
                  <ChestDescription>
                      <MonthlyChestNumber><Pink style={{fontSize: "150%"}}>5</Pink> Monthly Chests so far!</MonthlyChestNumber>
                      <div style={{marginBottom: "10px", fontSize: "16px"}}><Pink>2.47 ETH</Pink> Until the next Chest is found!</div>
                      <MonthlyChestDescription>Every <Pink>10 ETH</Pink> stored, creates a new Chest.</MonthlyChestDescription>
                      <MonthlyChestDescription><Pink>57.53 ETH</Pink> Stored just this month!</MonthlyChestDescription>
                  </ChestDescription>
              </ChestContainer>
          </ChestBar>
      </ChestBarContainer>
    )
}

export default ChestsBar
