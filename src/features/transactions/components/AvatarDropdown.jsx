// @ts-check
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'antd/lib/dropdown';
import Badge from 'antd/lib/badge';
import Avatar from 'antd/lib/avatar';
// import { NavLink } from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import Icon from "antd/lib/icon";
import img from '../../../app/images/Profile-Image-Logo-60x60.png';
import {setTransactionsSeen} from "../txActions";
import styled from "styled-components";
import {TX_CONFIRMED, TX_FAILED, TX_PENDING} from "../txConstants";

require('antd/lib/dropdown/style/css');
require('antd/lib/badge/style/css');
require('antd/lib/menu/style/css');
require('antd/lib/avatar/style/css');


const menuItemContainer = {};

const geodeTypes = {
    '0': 'Small silver geode',
    '1': 'Rotund silver geode',
    '2': 'Goldish silver geode'
};

// const generateMenuItemForTx = tx => {
//     switch (tx.txMethod) {
//         case 'SILVER_SALE':
//             switch (tx.status) {
//                 case 'COMPLETED':
//                     return (
//                       <div>
//                           <p>
//                               Silver received: {tx.receipt.events.Unboxed.returnValues.silver + " "}
//                               {tx.receipt.events.Unboxed.returnValues.gold > 0 ?
//                                 "Gold received:" + tx.receipt.events.Unboxed.returnValues.gold : ""}
//                           </p>
//                           <p>
//                               Cost: {tx.ether} ETH {tx.points > 0 ? ', ' + tx.points + 'referral' +
//                             ' points' : ''}
//                           </p>
//                       </div>
//                     );
//                 case 'PENDING':
//                     return (
//                       <div>
//                           <p>
//                               Cost: {tx.ether} ETH {tx.points > 0 ? ', ' + tx.points + 'referral' +
//                             ' points' : ''}
//                           </p>
//                       </div>
//                     )
//             }
//             break;
//         case 'GEM_UPGRADE':
//             switch (tx.status) {
//                 case 'PENDING':
//                 case 'COMPLETED':
//                     return (
//                       <div>
//                           <p>
//                               From: grade {gradeConverter(tx.gem.gradeType)}, level {tx.gem.level}
//                           </p>
//                           <p>
//                               To: grade {gradeConverter(tx.gem.gradeType + tx.gradeUp)},
//                               level {tx.gem.level + tx.levelUp}
//                           </p>
//                           <p>Cost: {tx.cost} {tx.levelUp > 0 ? 'silver' : 'gold'}</p>
//                       </div>
//                     );
//             }
//             break;
//         case 'COUPON_USE':
//             switch (tx.status) {
//                 case 'COMPLETED':
//                     return (
//                       <div>
//                           <p>
//                               Received: {geodeTypes[tx.receipt.events.CouponConsumed.returnValues.boxType] + " "}
//                           </p>
//                           <p>
//                               {tx.receipt.events.CouponConsumed.returnValues.gold > 0 ?
//                                 "Additional Gold received:" + tx.receipt.events.CouponConsumed.returnValues.gold :
//                                 ""}
//                           </p>
//                           <p>
//                               {tx.receipt.events.CouponConsumed.returnValues.silver > 0 ?
//                                 "Additional Silver received:" + tx.receipt.events.CouponConsumed.returnValues.silver :
//                                 ""}
//                           </p>
//                       </div>
//                     );
//                 case 'PENDING':
//                     return (
//                       <div>
//                           <p>
//                               Code: {tx.code}
//                           </p>
//                       </div>
//                     )
//             }
//             break;
//         case 'PLOT_SALE':
//             switch (tx.status) {
//                 case 'COMPLETED':
//                     console.log('TX::', tx.receipt);
//                     return (
//                       <div>
//                           <p>
//                           </p>
//                           <p>
//                               Cost: {tx.price} ETH
//                           </p>
//                       </div>
//                     );
//                 case 'PENDING':
//                     return (
//                       <div>
//                           <p>
//                               Cost: {tx.price} ETH
//                           </p>
//                       </div>
//                     )
//             }
//             break;
//         default:
//
//             break;
//     }
// };

const LootRow = styled.div`
    margin: 1px 0;
    text-align: left;
    font-size: 10px;
`;

const generateMenuItemForTx = tx => {
    switch (tx.event) {

        case 'Updated':
            const lootArray = tx.returnValues['loot'] || [0, 0, 0, 0, 0, 0, 0, 0, 0];
            const lootEmpty = !(lootArray.find(el => Number(el) > 0));
            return (
              <div>
                  <p>Plot {tx.returnValues['plotId']} was mined.</p>
                  <p>From {tx.returnValues['offsetFrom']} to {tx.returnValues['offsetTo']}</p>
                  {!lootEmpty && <div>Loot found:</div>}
                  {Number(lootArray[0]) > 0 &&
                  <LootRow>{lootArray[0]} Level 1 Gem{Number(lootArray[0]) > 1 ? "s" : ""}</LootRow>}
                  {Number(lootArray[1]) > 0 &&
                  <LootRow>{lootArray[1]} Level 2 Gem{Number(lootArray[1]) > 1 ? "s" : ""}</LootRow>}
                  {Number(lootArray[2]) > 0 &&
                  <LootRow>{lootArray[2]} Level 3 Gem{Number(lootArray[2]) > 1 ? "s" : ""}</LootRow>}
                  {Number(lootArray[3]) > 0 &&
                  <LootRow>{lootArray[3]} Level 4 Gem{Number(lootArray[3]) > 1 ? "s" : ""}</LootRow>}
                  {Number(lootArray[4]) > 0 &&
                  <LootRow>{lootArray[4]} Level 5 Gem{Number(lootArray[4]) > 1 ? "s" : ""}</LootRow>}
                  {Number(lootArray[5]) > 0 &&
                  <LootRow>{lootArray[5]} Piece{Number(lootArray[5]) > 1 ? "s" : ""} of Silver</LootRow>}
                  {Number(lootArray[6]) > 0 &&
                  <LootRow>{lootArray[6]} Piece{Number(lootArray[6]) > 1 ? "s" : ""} of Gold</LootRow>}
                  {Number(lootArray[7]) > 0 && <LootRow>{lootArray[7]} Artifacts</LootRow>}
                  {Number(lootArray[8]) > 0 &&
                  <LootRow>{lootArray[8]} Key{Number(lootArray[8]) > 1 ? "s" : ""}</LootRow>}
              </div>
            );
        case 'Bound':
            return (
              <div>
                  <p>Gem {tx.returnValues['gemId']} was bound to the plot {tx.returnValues['plotId']}</p>
              </div>
            );
        case 'Released':
            return (
              <div>
                  <p>Gem was released from the Plot {tx.returnValues['plotId']}</p>
              </div>
            );
        default:
            break;
    }
};

const DropdownContainer = styled.div`
    min-width: 320px;
    max-height: 500px;
    overflow: hidden auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: white;
    margin-top: 20px;
`;

const TxRecordContainer = styled.div`
    position: relative;
    background-color: #ececec;
    margin: 22px 2px;
    padding: 5px 0px;
    
    &:hover {
        background-color: #e0e0e0;
        &:after {
            background-color: #e0e0e0;
        }
        &:before {
            background-color: #e0e0e0;
        }
    }
   
    &:before {
        width: 100%;
        display: block;
        height: 20px;
        clip-path: polygon(5% 0, 95% 0, 100% 100%, 0 100%);
        top: -20px;
        left: 0;
        right: 0;
        position: absolute;
        background-color: #ececec;
        content: "";
    }
    
    &:after {
        width: 100%;
        display: block;
        height: 20px;
        clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%);
        bottom: -20px
        left: 0;
        right: 0;    
        position: absolute;
        background-color: #ececec;
        content: "show events";
        font-size: 10px;
        color: grey;
        text-align: center;
    }
`;

const TxHeader = styled.div`
`;

const TxStatus = styled.div`
    background-color: ${props => {
    switch (props.status) {
        case TX_PENDING:
            return "#fdcd14";
        case TX_CONFIRMED:
            return "green";
        case TX_FAILED:
            return "red";
    }
}};
    color: ${props => {
    switch (props.status) {
        case TX_PENDING:
            return "black";
        case TX_CONFIRMED:
            return "white";
        case TX_FAILED:
            return "white";
    }
}};
    margin: 2px 0;
    padding: 2px 5px;
    font-size: 10px;
    border-radius: 3px;
    width: 65px;
    text-align: center;
    
`;

const TxDescription = styled.div`
`;

const TxInfo = styled.div`
    padding: 5px 10px 0;
    margin-top: -12px;  
`;

const TxContractEvents = styled.div`
    display: ${props => props.expanded ? "block" : "none"};
    min-height: 30px;
    background-color: #e0e0e0;
    color: #333333;
    padding: 2px 10px;
    border-radius: 2px;
    font-size: 13px;
`;

const TxConfirmedRecord = ({tx}) => {

    const [expanded, setExpanded] = useState(false);

    return (
      <TxRecordContainer style={{cursor: "pointer"}} onClick={() => setExpanded(!expanded)}>
          <TxInfo>
              <Badge count={tx.unseen ? 1 : 0}>
                  <TxHeader>{tx.type}</TxHeader>
              </Badge>
              <TxStatus status={TX_CONFIRMED}>Confirmed</TxStatus>
              <TxDescription>{tx.description}</TxDescription>
          </TxInfo>
          <TxContractEvents expanded={expanded}>
              {tx.events && tx.events.map((event, i) => {
                  return <div style={{width: '100%'}} key={i}>{event['event']}</div>
              })}
          </TxContractEvents>
          <a
            href={`https://${process.env.REACT_APP_NETWORK}.io/tx/${tx.transactionHash}`}
            key={tx.transactionHash}
            target="_blank"
            rel="noopener noreferrer"
          >
              <Icon type="link" style={{fontSize: '24px', position: 'absolute', top: '20px', right: '0px'}}
                    className="pointer blue"/>
          </a>
      </TxRecordContainer>)
};

const menu = ({transactionHistory, pendingTransactions, failedTransactions}) => (

  <DropdownContainer>

      {!transactionHistory || !pendingTransactions || !failedTransactions ||
      (failedTransactions.length === 0 && transactionHistory.length === 0 && pendingTransactions.length === 0)
      && <div>No recent transactions</div>}
      {failedTransactions && failedTransactions.map((tx) => (
        tx.hash ?
          <TxRecordContainer key={tx.hash + 'failed'}>
              <TxInfo>
                  <Badge count={1}>
                      <TxHeader>{tx.type}</TxHeader>
                  </Badge>
                  <TxStatus status={TX_FAILED}>Failed</TxStatus>
                  <TxDescription>{tx.description}</TxDescription>
              </TxInfo>
              <a
                href={`https://${process.env.REACT_APP_NETWORK}.io/tx/${tx.hash}`}
                key={tx.hash}
                target="_blank"
                rel="noopener noreferrer"
              >
                  <Icon type="link" style={{fontSize: '24px', position: 'absolute', top: '20px', right: '0px'}}
                        className="pointer blue"/>
              </a>
          </TxRecordContainer> : ""
      ))}
      {pendingTransactions && pendingTransactions.map((tx) => (
        tx.hash ?
          <TxRecordContainer key={tx.hash + 'pending'}>
              <TxInfo>
                  <Badge count={tx.unseen ? 1 : 0}>
                      <TxHeader>{tx.type}</TxHeader>
                  </Badge>
                  <TxStatus status={TX_PENDING}>Pending</TxStatus>
                  <TxDescription>{tx.description}</TxDescription>
              </TxInfo>
              <a
                href={`https://${process.env.REACT_APP_NETWORK}.io/tx/${tx.hash}`}
                key={tx.hash}
                target="_blank"
                rel="noopener noreferrer"
              >
                  <Icon type="link" style={{fontSize: '24px', position: 'absolute', top: '20px', right: '0px'}}
                        className="pointer blue"/>
              </a>
          </TxRecordContainer> : ""
      ))}
      {transactionHistory && transactionHistory.map((tx) => (
        (tx && tx.transactionHash) ?
          <TxConfirmedRecord tx={tx} key={tx.transactionHash + 'confirmed'}/> : ""
      ))}
  </DropdownContainer>
);

/**
 * @param {{
 * to: string,
 * userImage: string
 * userName: string
 * upperCaseWalletId: string
 * }} AvatarDropdownProps
 */
class AvatarDropdown extends React.Component {

    state = {
        visibility: false,
    };

    render() {
        const {user, failedTransactions, transactionHistory, pendingTransactions} = this.props;
        const unseen = ((transactionHistory && transactionHistory.length > 0 )? Math.min(transactionHistory.findIndex(tx => tx && !tx.unseen), transactionHistory.length): 0) + +(failedTransactions ? failedTransactions.length : 0);

        return (
          user && (
            user.name && user.imageURL && user.walletId &&
            <div
              className="dib-ns"
              onMouseEnter={() => this.setState({visibility: true})}
              onMouseLeave={() => {
                  this.setState({visibility: false})
              }}
            >
                <Dropdown overlay={menu({transactionHistory, pendingTransactions, failedTransactions})}
                          visible={this.state.visibility}>
                    <>
                        <Badge count={unseen}>
                            <Avatar src={user.imageURL} className="dib h-auto v-super" size="small"/>
                        </Badge>
                        <span className="dib pl2 mb0 v-top">
                            {user.name}
                        </span>
                    </>
                </Dropdown>
            </div>
            || (user.name === 'Guest' && !user.imageURL && !user.walletId) &&
            //<Dropdown overlay={<></>} visible={this.state.visibility}>
            <div className="dib-ns">
                <Avatar src={img} className="dib"/>
                <p className="dib pl2">Guest</p>
            </div>
            //</Dropdown>
          ))
    };
}

const select = store => {
    console.log('AVATAR DROPDOWN STORE:', store);
    return {
        transactions: store.tx.transactions || [],
        unseen: store.tx.transactions ? store.tx.transactions.reduce((acc, curTx) => curTx.unseen ? acc + 1 : acc, 0) : 0,
        transactionHistory: store.tx.transactionHistory,
        pendingTransactions: store.tx.pendingTransactions,
        failedTransactions: store.tx.failedTransactions,
        //hash: store.tx.txHash,
        //txConfirmations: store.tx.txConfirmations,
        //txReceipt: store.tx.txReceipt,
        //txError: store.tx.txError,
        //txCurrentUser: store.tx.txCurrentUser,
        //txMethod: store.tx.txMethod,
        //txTokenId: store.tx.txTokenId,
    }
};

const actions = {
    handleSetTransactionsSeen: setTransactionsSeen,
};

export default connect(select)(AvatarDropdown);

AvatarDropdown.propTypes = {
    // to: PropTypes.string.isRequired,
    //userImage: PropTypes.string.isRequired,
    //userName: PropTypes.string.isRequired,
    // walletId: PropTypes.string,
    upperCaseWalletId: PropTypes.string.isRequired,
};

// AvatarDropdown.defaultProps = {
//   walletId: '',
// };
