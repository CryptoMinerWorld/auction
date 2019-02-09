// @ts-check
import React from 'react';
import PropTypes from 'prop-types';
import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';
import Badge from 'antd/lib/badge';
import Avatar from 'antd/lib/avatar';
// import { NavLink } from 'react-router-dom';
import connect from "react-redux/es/connect/connect";

require('antd/lib/dropdown/style/css');
require('antd/lib/badge/style/css');
require('antd/lib/menu/style/css');
require('antd/lib/avatar/style/css');


const menuItemContainer = {}

const generateMenuItemForTx = tx => {
    switch (tx.txMethod) {
        case 'SILVER_SALE':
            return (
              <Badge count={tx.unseen ? 1 : 0}>
                  <div>
                      <p>{tx.description}</p>
                      <p>{tx.status}</p>
                      {
                          tx.status === 'COMPLETED' ?
                            <p>
                                Silver received: {tx.receipt.events.Unboxed.returnValues.silver + " "}
                                {tx.receipt.events.Unboxed.returnValues.gold > 0 ?
                                  "Gold received:" + tx.receipt.events.Unboxed.returnValues.gold : ""}
                            </p> : ""
                      }
                  </div>
              </Badge>
            );
        case 'GEM_UPGRADE':

            break;

        case 'COUPON_REDEEM':

            break;
    }
}

const menu = items => (
  <Menu>
      {items.map((tx) => (
        <Menu.Item className="flex aic" key={tx.hash}>
            <a
              href={`https://${process.env.REACT_APP_NETWORK}.io/tx/${tx.hash}`}
              key={tx.hash}
              target="_blank"
              rel="noopener noreferrer"
            >
                {generateMenuItemForTx(tx)}
                {/*<Icon type="link" style={{fontSize: '24px'}} className="pointer blue pl3"/>*/}
            </a>
        </Menu.Item>
      ))}
  </Menu>
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

    // const [visibility, setVisibility] = useState(false);
    // const [penidngTxs, setTxs] = useState([]);
    // useEffect(() => {
    //     const unsubscribe = fetchAnyPendingTransactions(upperCaseWalletId, setTxs);
    //     // console.log('listening');
    //     return () => unsubscribe();
    // }, []);
    // // console.log('walletId', walletId);
    // // console.log('penidngTxs', penidngTxs);
    //

    render() {

        const {userImage, userName, upperCaseWalletId, transactions, unseen} = this.props;

        return (
          <div
            className="dib-ns"
            onMouseEnter={() => this.setState({visibility: true})}
            onMouseLeave={() => this.setState({visibility: false})}
          >
              <Dropdown overlay={menu(transactions)} visible={this.state.visibility}>
                  <>
                      <Badge count={unseen}>
                          <Avatar src={userImage} className="dib"/>
                      </Badge>
                      <p className="dib pl2">
                          {userName}
                      </p>
                  </>
              </Dropdown>
          </div>
        );
    };
}

const select = store => {
    console.log('AVATAR DROPDOWN STORE:', store);
    return {
        transactions: store.tx.transactions || [],
        unseen: store.tx.transactions ? store.tx.transactions.reduce((acc, curTx) => curTx.unseen ? acc + 1 : acc, 0) : 0,
        //hash: store.tx.txHash,
        //txConfirmations: store.tx.txConfirmations,
        //txReceipt: store.tx.txReceipt,
        //txError: store.tx.txError,
        //txCurrentUser: store.tx.txCurrentUser,
        //txMethod: store.tx.txMethod,
        //txTokenId: store.tx.txTokenId,
    }
};

export default connect(select)(AvatarDropdown);

AvatarDropdown.propTypes = {
    // to: PropTypes.string.isRequired,
    userImage: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    // walletId: PropTypes.string,
    upperCaseWalletId: PropTypes.string.isRequired,
};

// AvatarDropdown.defaultProps = {
//   walletId: '',
// };
