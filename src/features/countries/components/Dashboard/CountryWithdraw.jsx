import styled from 'styled-components';
import React from "react";
import actionButtonImage from "../../../../app/images/thickAndWidePinkButton.png";

export const CountryWithdraw = ({
                                totalNotWithdrawn, totalWithdrawn, withdrawEth, isWithdrawing
                            }) => (
 <Container>
   <LeftContainer>
        <WithdrawButton onClick={() => {!isWithdrawing && withdrawEth()}}>
            {isWithdrawing ? "WITHDRAWING ETH..." : "WITHDRAW ETH"}
        </WithdrawButton>
        <span>Total Not Withdrawn: </span>
        <PinkText>
            {!isNaN(totalNotWithdrawn) && totalNotWithdrawn.toFixed(3)} ETH
        </PinkText>
   </LeftContainer>
   <RightContainer>
        <span>Total Withdrawn: </span>
       <PinkText>
           {!isNaN(totalWithdrawn) && totalWithdrawn.toFixed(3)} ETH
       </PinkText>
   </RightContainer>
 </Container>
);

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    color: white;
    font-weight: bold;
`;

const LeftContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    align-content: center;
    padding: 0px 5px 5px;
    background-color: #24292F;
    clip-path: polygon(4% 0,96% 0,100% 22%,100% 78%,96% 100%,4% 100%,0 78%,0% 22%);
    -webkit-clip-path: polygon(4% 0,96% 0,100% 22%,100% 78%,96% 100%,4% 100%,0 78%,0% 22%);
    margin: 2px 5px;
`;

const RightContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    min-width: 225px;
    align-items: center;
    align-content: center;
    padding: 5px 10px;
    margin: 2px 5px;
    background-color: #24292F;
    clip-path: polygon(8% 0,92% 0,100% 22%,100% 78%,92% 100%,8% 110%,0 78%,0% 22%);
    -webkit-clip-path: polygon(8% 0,92% 0,100% 22%,100% 78%,92% 100%,8% 110%,0 78%,0% 22%);
`;

const WithdrawButton = styled.div`
      background-image: url(${actionButtonImage});
    background-position: center center;
    text-align: center;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px 8px;
    cursor: pointer;
    color: white;
    width: 160px;
    font-size: 16px;
    margin-right: 10px;
    font-weight: bold;
`;

const PinkText = styled.span`
    color: #FF00CD;
    margin-left: 5px;
`;