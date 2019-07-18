import styled from 'styled-components';
import faqButtonImage from '../../../app/images/darkGreyBlankButton.png';
import React from "react";

const PlotSaleFAQ = () => (
  <Container>
      <Description>
          If you are confused about anything on this page, or if you just want more info, click either of the buttons
          below.
      </Description>
      <div style={{display: "flex", flexWrap: "wrap"}}>
          <a target="_blank" href={"https://cryptominerworld.com/faq/#FAQ-About-Plots"}><FAQButton>More Info on Plots</FAQButton></a>
      </div>
  </Container>
);

export default PlotSaleFAQ;

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-left: 80px;
    border-top: 3px solid #E709B0;
    padding: 30px 0 30px 80px;
    
    @media(max-width: 800px) {
        padding-left: 0;
    }
`;

const Description = styled.div`
  color: #CACED4;
  font-size: 15px;
  max-width: 440px;
  text-align: center;
  font-weight: bold;
`;

const FAQButton = styled.div`
    background-image: url(${faqButtonImage});
    background-position: center center;
    text-align: center;
    background-size: contain;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    cursor: pointer;
    color: #DADAE8;
    margin: 0px 10px;
    width: 260px;
    max-width: 260px;
    min-width: 260px;
    font-size: 20px;
    margin-top: 10px;
    font-weight: bold;
`;