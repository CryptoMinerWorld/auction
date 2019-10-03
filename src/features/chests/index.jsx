import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {withRouter} from 'react-router-dom';
import {submitKeys} from './chestActions';
import {getKeysIssued, getKeysSubmitted, getUserBalance} from "../sale/saleActions";
import styled from 'styled-components';
import chestImage from './../../app/images/sale/chestSeptemberSapphire800.png';
import rockBackground from '../../app/images/rockBackground.png';
import actionButtonImage from "../../app/images/noTextGemButton.png";
import {CutEdgesButton} from "../../components/CutEdgesButton";
import playerNameImage from "../../app/images/PlayerName.png";
import keysSubmittedImage from "../../app/images/KeysSubmitted.png";
import {getChestValues} from "../plotsale/plotSaleActions";
import axios from 'axios';

const select = store => ({
    dataLoaded: {
        plots: store.plots.plotsLoaded,
        gems: store.dashboard.gemsLoaded,
    },
    chestFactoryContract: store.app.chestFactoryContract,
    foundersKeyContract: store.app.foundersKeyContract,
    chestValue: store.plotSale.monthlyChestValue,
    dataRefreshed: store.dashboard.dataRefreshed,
    currentUser: store.auth.user,
    userExists: store.auth.existingUser,
    userBalance: store.sale.balance,
    currentUserId: store.auth.currentUserId,
    totalFoundersKeys: store.sale.foundersKeysIssued,
    totalChestKeys: store.sale.chestKeysIssued,
    web3: store.app.web3,
    silverGoldService: store.app.silverGoldService,
    chestContract: store.app.chestContract,
    submittedKeys: store.sale.foundersKeysSubmitted,
});

const chestId = process.env.REACT_APP_FACTORY_CHEST_ID;

class Chest extends Component {

    state = {};

    // clearSubscriptions = () => {
    //     this.state.eventSubscriptions.forEach((subscription) => {
    //         console.log("subscription unsubscribe:", subscription);
    //         subscription.unsubscribe();
    //     })
    // };

    // componentWillUnmount() {
    //     this.clearSubscriptions();
    // }

    async componentDidMount() {
        const {
            match, handleGetUserBalance, foundersKeyContract, handleGetFoundersKeySubmitted,
            handleGetFoundersKeyIssued, handleGetChestValues, chestFactoryContract, silverGoldService, web3, currentUserId
        } = this.props;

        if (silverGoldService && currentUserId) {
            handleGetUserBalance(currentUserId);
        }
        if (foundersKeyContract) {
            handleGetFoundersKeyIssued();
            handleGetFoundersKeySubmitted(chestId);
        }
        if (chestFactoryContract) {
            handleGetChestValues();
        }
        if (chestFactoryContract) {
        }

        const res = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD');
        this.setState({ethPrice: res.data['USD']});

        // res => {
        //     const cryptos = res.data;
        //     console.log(cryptos);
        //     this.setState({cryptos: cryptos});
        // })

    }

    async componentDidUpdate(prevProps) {
        const {
            match, web3, foundersKeyContract, chestFactoryContract, handleGetFoundersKeySubmitted,
            handleGetFoundersKeyIssued, handleGetChestValues, silverGoldService, handleGetUserBalance, currentUserId,
        } = this.props;

        if (silverGoldService && currentUserId &&
          (silverGoldService !== prevProps.silverGoldService || currentUserId !== prevProps.currentUserId)) {
            handleGetUserBalance(currentUserId);
        }
        if (foundersKeyContract !== prevProps.foundersKeyContract) {
            handleGetFoundersKeyIssued();
            handleGetFoundersKeySubmitted(chestId);
        }
        if (chestFactoryContract !== prevProps.chestFactoryContract) {
            handleGetChestValues();
        }
        if (chestFactoryContract !== prevProps.chestFactoryContract) {
        }
    }

    render() {

        const {
            currentUserId,
            //     match,
            userBalance,
            chestValue,
            totalFoundersKeys,
            submittedKeys,
            handleSubmitKeys
        } = this.props;

        const ethPrice = this.state.ethPrice;

        const totalSubmittedKeys = submittedKeys ? submittedKeys.reduce((sum, cur) => sum + Number(cur.keys), 0) : "";

        // const userBalance = {keys: 3};
        // const chestValue = 19.65;
        // const totalKeys = 6;
        // const submittedKeys = 0;

        return (
          <div className="bg-off-black white card-container chests" data-testid="profile-page">
              <ChestArea>
                  <ChestContainer>
                      <ChestImage src={chestImage}/>
                  </ChestContainer>
                  <ChestInfo>
                      <Heading>1st <Blue>Gemstone Chest</Blue> is Now Accepting <Yellow>Keys</Yellow>!</Heading>
                      {/*<Info>The Winning Key will open the Chest on <Date><Pink>August 23 2019</Pink> at <Pink>1:00</Pink></Date>pm (GMT)</Info>*/}
                      <ChestValue>
                          <div style={{width: "170px", padding: "3px 0"}}>
                              Owner of the Winning Key will receive this!!!
                          </div>
                          <div>
                              {chestValue &&
                              <ValueEth><Pink>{chestValue.toFixed(2)}</Pink> <span style={{fontSize: "20px"}}>ETH</span></ValueEth>}
                              {chestValue && ethPrice &&
                              <ValueUsd><Pink>{(chestValue * ethPrice).toFixed(2)}</Pink> <span
                                style={{fontSize: "16px"}}>USD</span></ValueUsd>}
                          </div>
                      </ChestValue>
                      <SubmitArea>
                          {userBalance && Number(userBalance.foundersKeys) > 0 && Number(userBalance.chestKeys) > 0 ?
                            <HasKeys>
                                <KeysInfo>
                                    You have <Pink style={{fontSize: "26px"}}>{userBalance.foundersKeys + userBalance.chestKeys}</Pink> Keys!
                                </KeysInfo>
                                <SubmitButton onClick={() => handleSubmitKeys(Number(userBalance.foundersKeys), Number(userBalance.chestKeys), chestId, () => {
                                    this.props.handleGetUserBalance(currentUserId);
                                    this.props.handleGetFoundersKeyIssued();
                                    this.props.handleGetFoundersKeySubmitted(chestId);
                                })}>
                                    Submit Keys
                                </SubmitButton>
                            </HasKeys>
                            :
                            <NoKeys>You don't have any keys. You still have time to get some!</NoKeys>
                          }
                      </SubmitArea>
                      {userBalance && (Number(userBalance.foundersKeys) + Number(userBalance.chestKeys) > 0) &&
                      <SecondarySubmit>
                          <SecondarySubmitInfo>
                              All available Keys are submitted by default. There will never be more than one Chest
                              accepting Keys at one time.
                              If you would like to submit less than all of your Keys, click this button to submit one
                              key at a time.
                          </SecondarySubmitInfo>
                          <div style={{display: "flex", flexDirection: "column"}}>
                          {Number(userBalance.foundersKeys > 0) &&
                          <SecondarySubmitButton>
                              <CutEdgesButton content={"Submit 1 Founder's Key"}
                                              backgroundColor={"#2a3238"}
                                              outlineColor={"#6e7c89"}
                                              outlineWidth={1}
                                              edgeSizes={[5, 20]}
                                              otherStyles={"height: 28px"}
                                              onClick={() => handleSubmitKeys(1, 0, chestId, () => {
                                                  this.props.handleGetUserBalance(currentUserId);
                                                  this.props.handleGetFoundersKeyIssued();
                                                  this.props.handleGetFoundersKeySubmitted(chestId);
                                              })}
                              />
                          </SecondarySubmitButton>}
                          {Number(userBalance.chestKeys > 0) &&
                          <SecondarySubmitButton>
                              <CutEdgesButton content={"Submit 1 Chest Key"}
                                              backgroundColor={"#2a3238"}
                                              outlineColor={"#6e7c89"}
                                              outlineWidth={1}
                                              edgeSizes={[5, 20]}
                                              otherStyles={"height: 28px"}
                                              onClick={() => handleSubmitKeys(0, 1, chestId, () => {
                                                  this.props.handleGetUserBalance(currentUserId);
                                                  this.props.handleGetFoundersKeyIssued();
                                                  this.props.handleGetFoundersKeySubmitted(chestId);
                                              })}
                              />
                          </SecondarySubmitButton>}
                          </div>
                      </SecondarySubmit>}
                  </ChestInfo>
              </ChestArea>
              <StatsArea>
                  <KeysSubmitted>
                      <KeysSubmittedValue>
                          <Pink style={{fontSize: "56px"}}>{totalSubmittedKeys}</Pink> OF
                          <Pink style={{fontSize: "56px"}}> {totalFoundersKeys}</Pink> Keys have been submitted
                      </KeysSubmittedValue>
                      <KeysSubmittedInfo>There may be more Keys burried! Get mining!!!
                          This is just how many have been submitted out of what has been discovered so far.
                      </KeysSubmittedInfo>
                  </KeysSubmitted>
                  <UserBoard>
                      <HeadingRow>
                          <ColumnName style={{marginRight: "200px"}}>
                              <img src={playerNameImage}/>
                          </ColumnName>
                          <ColumnName>
                              <img src={keysSubmittedImage}/>
                          </ColumnName>
                      </HeadingRow>
                      {submittedKeys && submittedKeys.map((row, ind) =>
                        <UserBoardRow key={ind}>
                            {row.userName ? <UserName>
                                  <img width={50} src={row.userImageUrl}/> {row.userName}
                              </UserName> :
                              <UserName>
                                  {row.userAddress}
                              </UserName>}
                            <UserKeys>{row.keys}</UserKeys>
                        </UserBoardRow>
                      )}
                  </UserBoard>
              </StatsArea>
          </div>
        );
    }
}

const actions = {
    handleGetUserBalance: getUserBalance,
    handleSubmitKeys: submitKeys,
    handleGetChestValues: getChestValues,
    handleGetFoundersKeyIssued: getKeysIssued,
    handleGetFoundersKeySubmitted: getKeysSubmitted
};

export default compose(
  withRouter,
  connect(
    select,
    actions,
  ),
)(Chest);

const ChestArea = styled.div`
    width: 100%;
    display: flex;
    background-image: url(${rockBackground});
    background-repeat: repeat;
    background-size: contain;
    justify-content: center;
    flex-wrap: wrap;
    padding-top: 50px;
    color: #8c9292;
  `;
const ChestContainer = styled.div`
    max-width: 420px;
    padding: 0 20px;
  `;
const ChestImage = styled.img`

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



`;
const ChestInfo = styled.div`
    max-width: 400px;
    padding: 0 20px;
  `;
const Heading = styled.div`
    font-size: 36px;
    line-height: 130%;
    text-align: center;
    max-width: 360px;
    color: #d2d8db;
  `;
const Yellow = styled.span`
color: #fae36d`;
const Blue = styled.span`
color: #72a2ff
`;
const Pink = styled.span`color: #ff00cd`;

const Info = styled.div`
color: #8c9292;
font-size: 18px;
text-align: center;
  `;
const Date = styled.span`font-size: 20px;`;

const ChestValue = styled.div`
    line-height: 130%;
    display: flex;
    justify-content: space-evenly;
    border: 1px solid gray;
    border-radius: 10px;
    margin: 7px 10px;
    padding: 5px 0;
  `;
const ValueEth = styled.div`
  font-size: 28px;
  line-height: 1;
  `;
const ValueUsd = styled.div`
  line-height: 1;
  font-size: 20px;
  `;
const SubmitArea = styled.div`
  background-color: #383f45;
  border: 1px solid #8c9292;
  margin: 10px 10px;
  padding: 5px 0;
  border-radius: 10px;
  color: white;
  `;
const HasKeys = styled.div`
  display: flex;
  padding: 5px 20px;
  align-items: center;
  `;
const KeysInfo = styled.div`
    font-size: 22px;
    width: 110px;
    line-height: 120%;
  `;
const SubmitButton = styled.div`
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
    font-size: 22px;
    margin-left: 20px;
    
    transition: all .2s ease-in-out;
    &:hover { transform: scale(1.1); }    
  `;
const NoKeys = styled.div`
  padding: 5px 20px;
  text-align: center;
  font-size: 18px;
  line-height: 130%;
  `;
const SecondarySubmit = styled.div`
    margin-top: 50px;
    display: flex;
    align-items: center;
  `;
const SecondarySubmitInfo = styled.div`
    font-size: 11px;
    line-height: 120%;
  `;
const SecondarySubmitButton = styled.div`
    margin: 3px 3px;
    max-width: 120px;
    min-width: 120px;
    font-size: 10px;
    font-weight: bold;
    display: flex;
  `;
const StatsArea = styled.div`
    color: #8c9292;
    border-top: 6px solid #c51d8c;
    margin-top: 15px;
  `;
const KeysSubmitted = styled.div`
    margin: 5px 0;
    background-color: #383f45;
    padding: 15px 0;
  `;
const KeysSubmittedValue = styled.div`
    text-align: center;
    font-size: 36px;
`;
const KeysSubmittedInfo = styled.div`
font-size: 14px;
max-width: 500px;
margin: auto;
text-align: center;
line-height: 130%;
`;
const UserBoard = styled.div`
background-color: #24292f;
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
  `;
const HeadingRow = styled.div`
    max-width: 800px;
    display: flex;
    flex-wrap: wrap;
  `;
const UserBoardRow = styled.div`
    max-width: 800px;
    display: flex;
    flex-wrap: wrap;
  `;
const ColumnName = styled.div`
    width: 200px;
  `;

const UserName = styled.div`
    padding-top: 6px;
    min-width: 380px;
`;

const UserKeys = styled.div`
    font-size: 26px;
    width: 200px;
    text-align: center;
    float: right;
`;
