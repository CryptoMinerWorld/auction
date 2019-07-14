import styled from 'styled-components';
import React, {useState} from "react";
import actionButtonImage from "../../../app/images/noTextGemButton.png";
import Icon from "antd/lib/icon";

const antarcticaImageLinkMedium = 'https://firebasestorage.googleapis.com/v0/b/cryptominerworld-7afd6.appspot.com/o/flagMap%2FAntarctica_Flag_Map%40307px.png?alt=media&token=e1feac73-a4ea-48e6-a68e-bb21de668380';
const PLOTS_TO_GET_NUMBER = 2;

const FounderPlotsArea = ({founderPlotsBalance, handleGetFounderPlots}) => {
    const [processBuy, setProcessBuy] = useState(false);
    return (
      <BuyFormContainer>
          <BuyFormHeader>
              Get Founder's Plots of Land
          </BuyFormHeader>
          <div>
              <div style={{textAlign: "center"}}>
                  <span style={{color: "white", fontSize: "22px"}}>{founderPlotsBalance || 0}</span>
                  {` Plots of Land in Antarctica`}
              </div>
          </div>
          <div style={{display: "flex"}}>
              <Col style={{flex: 1}}>
                  <SelectedCountryIcon src={antarcticaImageLinkMedium}/>
              </Col>
              <Col style={{flex: 2}}>
                  <BuyButton onClick={() => {
                      setProcessBuy(true);
                      for (let i = 0; i < Math.ceil(founderPlotsBalance/PLOTS_TO_GET_NUMBER); i++) {
                          handleGetFounderPlots(Math.min(PLOTS_TO_GET_NUMBER, founderPlotsBalance - i*PLOTS_TO_GET_NUMBER), () => {
                              setProcessBuy(false);
                          });
                      }
                  }}>{!processBuy ? "Get Now" : (
                    <div className="flex x h2 w-100">
                        <Icon type="loading" theme="outlined"/>
                    </div>)}
                  </BuyButton>
              </Col>
              <Col style={{flex: 1}}>
                  <SelectedCountryIcon src={antarcticaImageLinkMedium}/>
              </Col>
          </div>
          <BuyInfo>{`Please confirm ${Math.ceil(founderPlotsBalance/PLOTS_TO_GET_NUMBER)} transactions to get all plots.
              We can issue only ${PLOTS_TO_GET_NUMBER} plots per transaction`}</BuyInfo>
      </BuyFormContainer>
    );
};

const BuyFormContainer = styled.div`
    width: 100%;
    min-width: 317px;
    max-width: 420px;
    background-color: #383F45;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border: 3px solid #4D5454;
    border-radius: 10px;
    color: #8C9293;
    position: absolute;
    top: 0px;
    right: 10px;
    z-index: 1;
    padding-bottom: 5px;
    
    @media(max-width: 800px) {
        right: 0;
        left: -12px;
        margin: auto;
    }
`;

const BuyFormHeader = styled.div`
    border-bottom: 3px solid #FF00CD;
    background-color: #2A3238;
    color: #D2D8DB;
    font-size: 30px;
    text-align: center;
    border-radius: 8px 8px 0 0;
`;

const SelectedCountryIcon = styled.img`
    width: 80px;
`;

const BuyButton = styled.div`
    background-image: url(${actionButtonImage});
    background-position: center center;
    text-align: center;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    cursor: pointer;
    color: white;
    width: 170px;
    font-size: 26px;
    margin-top: 10px;
`;

const Col = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
`;

const BuyInfo = styled.div`
    font-size: 12px;
    color: white;
    text-align: center;
    padding: 5px;
`;

export default FounderPlotsArea;
