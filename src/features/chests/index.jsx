import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {withRouter} from 'react-router-dom';
import {submitKeys, withdrawKeys, withdrawTreasure} from './chestActions';
import {getFoundersKeysIssued, getKeysSubmitted, getKeysSubmittedByUser, getUserBalance} from "../sale/saleActions";
import styled from 'styled-components';
import chestImage from './../../app/images/sale/foundersChestWithCoins800.png';
import rockBackground from '../../app/images/rockBackground.png';
import actionButtonImage from "../../app/images/noTextGemButton.png";
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
    web3: store.app.web3,
    silverGoldService: store.app.silverGoldService,
    chestContract: store.app.chestContract,
    submittedKeys: store.sale.foundersKeysSubmitted,
    submittedKeysByUser: store.sale.foundersKeysSubmittedByUser
});

const chestId = process.env.REACT_APP_FOUNDERS_CHEST_ID;

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
            match, handleGetUserBalance, foundersKeyContract, handleGetFoundersKeySubmitted, handleGetKeysSubmittedByUser,
            handleGetFoundersKeyIssued, handleGetChestValues, chestFactoryContract, silverGoldService, web3, currentUserId
        } = this.props;

        if (silverGoldService && currentUserId) {
            handleGetUserBalance(currentUserId);
        }
        if (foundersKeyContract) {
            handleGetFoundersKeyIssued();
            handleGetFoundersKeySubmitted(chestId);
        }
        if (chestFactoryContract && currentUserId) {
            handleGetKeysSubmittedByUser(chestId, currentUserId)
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
            match, web3, foundersKeyContract, chestFactoryContract, handleGetFoundersKeySubmitted, handleGetKeysSubmittedByUser,
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
        if (currentUserId && chestFactoryContract && (currentUserId !== prevProps.currentUserId || chestFactoryContract !== prevProps.chestFactoryContract)) {
            handleGetKeysSubmittedByUser(chestId, currentUserId)
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
            handleWithdrawKeys,
            handleWithdrawTreasure,
            totalFoundersKeys,
            submittedKeys,
            handleSubmitKeys,
            submittedKeysByUser
        } = this.props;

        const ethPrice = this.state.ethPrice;
        const chestValue = 19.83;

        const totalSubmittedKeys = submittedKeys ? submittedKeys.reduce((sum, cur) => sum + Number(cur.foundersKeys), 0) : "";
        const winnerAddress = "0x0e9c1bedf18e77a87e61100e5709aea4d0ba83e1";


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
                      <Heading><Blue>1st Gemstone Chest</Blue> Has Been <Yellow>Opened</Yellow>!</Heading>
                      {currentUserId && currentUserId.toLowerCase() === winnerAddress ?
                        <SubmitArea>
                            <HasKeys>
                                <div style={{fontSize: "20px"}}>You WON!!!</div>
                                <SubmitButton onClick={() => handleWithdrawTreasure(chestId)}>
                                    Withdraw ETH
                                </SubmitButton>
                            </HasKeys>
                            <HasKeys>
                                <KeysInfo>
                                    Take your Keys back
                                </KeysInfo>
                                <SubmitButton onClick={() => handleWithdrawKeys(chestId, () => {
                                    this.props.handleGetUserBalance(currentUserId);
                                    this.props.handleGetFoundersKeyIssued();
                                    this.props.handleGetFoundersKeySubmitted(chestId);
                                })}>
                                    Retrieve Keys
                                </SubmitButton>
                            </HasKeys>
                        </SubmitArea> :
                        (
                          <SubmitArea>
                              {(submittedKeysByUser && Number(submittedKeysByUser) > 0) ?
                                <HasKeys>
                                    <KeysInfo>
                                        Take your Keys back
                                    </KeysInfo>
                                    <SubmitButton onClick={() => handleWithdrawKeys(chestId, () => {
                                        this.props.handleGetUserBalance(currentUserId);
                                        this.props.handleGetFoundersKeyIssued();
                                        this.props.handleGetFoundersKeySubmitted(chestId);
                                    })}>
                                        Retrieve Keys
                                    </SubmitButton>
                                </HasKeys>
                                :
                                <HasKeys>
                                    <KeysInfo>
                                        <img
                                          src="https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FAquamarine%20Face%20Emoji.png?alt=media&amp;token=b759ae07-bb8c-4ec8-9399-d3844d5428ef"
                                          width="50"/>
                                        XXX
                                    </KeysInfo>
                                    <div style={{textAlign: "center"}}>had the Key that opened the Chest!</div>
                                </HasKeys>}
                          </SubmitArea>)
                      }
                      <ChestValue>
                          <div style={{width: "170px", padding: "3px 0"}}>
                              {currentUserId && currentUserId.toLowerCase() === winnerAddress ?
                                "You will receive this" :
                                <div>
                                    <img
                                      src="https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FAquamarine%20Face%20Emoji.png?alt=media&amp;token=b759ae07-bb8c-4ec8-9399-d3844d5428ef"
                                      width="30"/>
                                    Proof
                                    <div>received this</div>
                                </div>
                              }
                          </div>
                          <div>
                              {chestValue &&
                              <ValueEth><Pink>{chestValue.toFixed(2)}</Pink> <span style={{fontSize: "20px"}}>ETH</span></ValueEth>}
                              {chestValue && ethPrice &&
                              <ValueUsd><Pink>{(chestValue * ethPrice).toFixed(2)}</Pink> <span
                                style={{fontSize: "16px"}}>USD</span></ValueUsd>}
                          </div>
                      </ChestValue>
                      {((currentUserId && currentUserId.toLowerCase() === winnerAddress)
                        || submittedKeysByUser && Number(submittedKeysByUser) > 0) ? "" :
                        <NoKeys style={{color: "white"}}>Get mining and find Keys so you have a chance of opening the
                            next Chest</NoKeys>
                      }
                      {(currentUserId && currentUserId.toLowerCase() !== winnerAddress
                        && submittedKeysByUser && Number(submittedKeysByUser) > 0) ?
                        <div style={{textAlign: "center", color: "white"}}>
                            Sorry, non of your Keys opened this Chest.<br/>
                            But your Keys could open other Chests.<br/>
                            Take them back and keep trying!<br/>
                            Good luck!!!
                        </div> : ""}
                  </ChestInfo>
              </ChestArea>
              <StatsArea>
                  <KeysSubmitted>
                      <KeysSubmittedValue>
                          <Pink style={{fontSize: "56px"}}>{totalSubmittedKeys}</Pink> OF
                          <Pink style={{fontSize: "56px"}}> {totalFoundersKeys}</Pink> Founder's Keys submitted
                      </KeysSubmittedValue>
                      <KeysSubmittedInfo>There may be more Founder's Keys yet to be mined up.
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
                            <UserKeys>{row.foundersKeys}</UserKeys>
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
    handleGetFoundersKeyIssued: getFoundersKeysIssued,
    handleGetFoundersKeySubmitted: getKeysSubmitted,
    handleWithdrawTreasure: withdrawTreasure,
    handleWithdrawKeys: withdrawKeys,
    handleGetKeysSubmittedByUser: getKeysSubmittedByUser,
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
 0%, 20%, 50%, 80%, 100% {-webkit-transform: translateY(0);} 
 40% {-webkit-transform: translateY(-30px);}
 60% {-webkit-transform: translateY(-15px);}
}
 
@-moz-keyframes bounce {
 0%, 20%, 50%, 80%, 100% {-moz-transform: translateY(0);}
 40% {-moz-transform: translateY(-30px);}
 60% {-moz-transform: translateY(-15px);}
}
 
@-o-keyframes bounce {
 0%, 20%, 50%, 80%, 100% {-o-transform: translateY(0);}
 40% {-o-transform: translateY(-30px);}
 60% {-o-transform: translateY(-15px);}
}
@keyframes bounce {
 0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
 40% {transform: translateY(-30px);}
 60% {transform: translateY(-15px);}
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
    margin: 0px 3px;
    max-width: 86px;
    min-width: 86px;
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
