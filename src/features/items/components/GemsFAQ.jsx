import styled from 'styled-components';
import faqButtonImage from '../../../app/images/darkGreyBlankButton.png';
import React from "react";

const GemsFAQ = () => (
  <Container>
      <Description>
          If you are confused about anything on this page, or if you just want more info, click the button below.
      </Description>
      <div style={{display: "flex", flexWrap: "wrap"}}>
          <a target="_blank" href={"https://cryptominerworld.com/faq/#FAQ-About-Gems"}><FAQButton>More Info on Gems</FAQButton></a>
      </div>
  </Container>
);

export default GemsFAQ;

const Container = styled.div`
    position: absolute;
    bottom: 150px;
    left: -66%;
    right: 100%;
    width: 440px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 115px;
    margin: auto;
    
    @media(max-width: 950px) {
        position: static;
        width: 100%;
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