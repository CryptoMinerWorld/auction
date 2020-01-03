import React, {Component} from "react";
import styled from "styled-components";
import {compose} from "redux";
import connect from "react-redux/es/connect/connect";
import gemCombinationImage from "../../../app/images/dashboard/gemCombinationIcon350.png"
import goldBorder from "../../../app/images/dashboard/goldBorder.png"
import silverBorder from "../../../app/images/dashboard/silverBorder.png"
import silverAmounts from "../../../app/images/dashboard/silverAmountsReceived.png"
import goldAmounts from "../../../app/images/dashboard/goldAmountsReceived.png"
import createSilverButton from "../../../app/images/dashboard/createSilverButton.png"
import createGoldButton from "../../../app/images/dashboard/createGoldButton.png"

const select = store => ({

});

export class GemCombinationPopup extends Component {

    state = {
        
    };

    componentDidMount() {
        
    }

    // componentDidUpdate(prevProps) {
    //     const {handleProcessPlots, unprocessedPlotIds} = this.props;
    //     if (!prevProps.unprocessedPlotIds && unprocessedPlotIds !== prevProps.unprocessedPlotIds) {
    //         for (let i = 0; i < Math.ceil(unprocessedPlotIds.length / 20); i++) {
    //             handleProcessPlots(unprocessedPlotIds.slice(i*20 + Math.min((i+1)*20, unprocessedPlotIds.length)));
    //         }
    //     }
    // }

    render() {
        
        return (
          <PopupContainer>
              <Row>
                  <GemCombinationImage src={gemCombinationImage} />
                  <div>
                    <div style={{fontSize: "26px"}}><Pink>Gem Combination</Pink></div>
                    <div>
                        You can tell your Gem buddies to combine 
                        together to create some <Silver>Silver</Silver> or <Gold>Gold</Gold> for you!
                        This only works if the Gems are the same {ColorText()}...
                        No no no, it is not racism it just has to do with 
                        the lightwaves combining to create the right 
                        environment... Okay there is a bit of colorism 
                        issue in the Gem community...
                    </div>
                  </div>
              </Row>
              <Row style={{textAlign: "center", marginTop: "20px"}}>
                    <div>
                        The way it works: You always need <Pink>4</Pink> Gems of the same {ColorText()} (Type).<br />
                        Then you need to decide if you want to generate <Silver>Silver</Silver> or <Gold>Gold</Gold>.<br />
                        <Silver>Silver</Silver> requires that all <Pink>4</Pink> Gems have to be the same <Orange>Level</Orange>.<br />
                        <Gold>Gold</Gold> requires that all <Pink>4</Pink> Gems have to be the same <Blue>Grade</Blue>.<br />
                        All Gems {ColorText()}s create the same amount of <Silver>Silver</Silver> and <Gold>Gold</Gold>.<br />
                        They just need to be <Pink>4</Pink> of the same.
                    </div>
              </Row>
              <Row>
                    <GoldSection>
                        <div style={{fontSize: "26px"}}><Gold>Gold</Gold></div>
                        <div style={{padding: "0 5px"}}>4 same {ColorText()} & <Blue>Grade</Blue> creates this much <Gold>Gold</Gold></div>
                        <img src={goldAmounts}/>
                        <CreateGoldButton onClick={() => this.props.showGemSelectionPopup("gold")}/>
                    </GoldSection>
                    <SilverSection>
                        <div style={{fontSize: "24px"}}><Silver>Silver</Silver></div>
                        <div style={{padding: "0 5px"}}>4 same {ColorText()} & <Orange>Level</Orange> creates this much <Silver>Silver</Silver></div>
                        <img src={silverAmounts}/>
                        <CreateSilverButton onClick={() => this.props.showGemSelectionPopup("silver")}/>
                    </SilverSection>
              </Row>
          </PopupContainer>
        );
    }
}

const ColorText = () => (<span>
    <span style={{color: "#f3857c"}}>C</span>
    <span style={{color: "#c592cf"}}>o</span>
    <span style={{color: "#cce86f"}}>l</span>
    <span style={{color: "#fbeb7b"}}>o</span>
    <span style={{color: "#8bd8d8"}}>r</span>
</span>)

const GemCombinationImage = styled.img`
    min-width: 175px;
    width: 175px;
    margin-right: 10px;
`

const CreateSilverButton = styled.div`
    background-image: url(${createSilverButton});
    background-size: contain;
    background-repeat: no-repeat;
    width: 231px;
    height: 83px;
    cursor: pointer;
`;

const CreateGoldButton = styled.div`
    background-image: url(${createGoldButton});
    background-size: contain;
    background-repeat: no-repeat;
    width: 235px;
    height: 101px;
    cursor: pointer;
`;

const SilverSection = styled.div`
    background-image: url(${silverBorder});
    background-size: contain;
    background-repeat: no-repeat;
    display: flex;
    width: 266px;
    height: 325px;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: space-between;
    padding: 8px 2px 20px 2px;
    text-align: center;
    margin: 10px 5px 0px;
    font-size: 18px;
`;

const GoldSection = styled.div`
    background-image: url(${goldBorder});
    background-size: contain;
    background-repeat: no-repeat;
    display: flex;
    width: 285px;
    height: 325px;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 10px 3px 15px 3px;
    text-align: center;
    margin: 10px 5px 0px;
    font-size: 18px;
`;

const PopupContainer = styled.div`
            @media (max-width: 600px) {
                font-size: 12px;
            }
        
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            padding: 0 1%;
            font-size: 15px;
            font-weight: bold;
            min-width: 320px;
            max-width: 580px;
        `;

const Row = styled.div`
            display: flex;
            align-items: center;
`

const Pink = styled.span`color: #FF00CD;`;
const Silver = styled.span`color: #bcc9d8;`
const Gold = styled.span`color: #faeb61;`
const Blue = styled.span`color: #a4c7ec;`
const Orange = styled.span`color: #fbc17c;`

export default compose(
  connect(
    select,
    null
  )
)(GemCombinationPopup);