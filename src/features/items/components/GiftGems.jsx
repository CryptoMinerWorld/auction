import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { withStateMachine } from 'react-automata';
import styled from 'styled-components';
import { Formik, Field, Form } from 'formik';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import { Subscribe } from 'unstated';
import AppContainer from '../../../app/containers/App';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { db } from '../../../app/utils/firebase';

import button from '../../../app/images/pinkBuyNowButton.png';

const ColourButton = styled.button`
  background-image: url(${button});
  background-position: center top;
  width: 100%;
  height: 100%;
  text-align: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-color: transparent;
  border: none;
  color: white;
  text-transform: uppercase;
  cursor: pointer;
`;

// export const stateMachine = {
//   initial: 'idle',
//   states: {
//     idle: {
//       on: {
//         GIFT: 'loading'
//       }
//     },
//     loading: {
//       onEntry: 'checkReceiverDetails',
//       on: {
//         SUCCEED: 'confirm',
//         ERROR: 'error'
//       }
//     },
//     confirm: {
//       on: {
//         TRANSFER: 'transferring'
//       }
//     },
//     transferring: {
//       onEntry: 'transferOwnership',
//       on: {
//         SUCCEED: 'done',
//         ERROR: 'error'
//       }
//     },
//     done: {
//       onEntry: 'redirectToMarket'
//     },
//     error: {
//       on: {
//         GIFT: 'loading'
//       }
//     }
//   }
// };

class GiftGems extends Component {
  //   static propTypes = {
  //     web3:
  //   };

  validateWalletId = values => {
    let errors = {};
    if (values.walletId === '') {
      errors.walletId = 'Please enter an ethereum wallet address.';
      return errors;
    }

    if (!this.props.web3.utils.isAddress(values.walletId)) {
      errors.walletId = 'Not a valid ethereum wallet address.';
      return errors;
    }
  };

  transferOwnershipOnDatabase = async (from, to, tokenId) => {
    const toUserIdToLowerCase = to
      .split('')
      .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
      .join('');

    const fromUserIdToLowerCase = from
      .split('')
      .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
      .join('');

    db.doc(`users/${toUserIdToLowerCase}`)
      .get()
      .then(doc => [doc.data().name, doc.data().imageURL])
      .then(([name, image]) =>
        db.doc(`stones/${tokenId}`).update({
          owner: toUserIdToLowerCase,
          userName: name,
          userImage: image
        })
      )
      .catch(err => console.warn(err, 'error on db when gifting gem'));
  };

  transferGem = values => {
    const {
      gemsContract,
      currentAccountId,
      match,
      history,
      handleRemoveGemFromDashboard
    } = this.props;
    const to = values.walletId;
    const from = currentAccountId;
    const tokenId = match.params.gemId;

    // validate here
    console.warn(to, from, tokenId, gemsContract);

    gemsContract.methods
      .safeTransferFrom(from, to, tokenId)
      .send()
      .then(async () => {
        await this.transferOwnershipOnDatabase(from, to, tokenId);
        history.push(`/profile/${from}`);
      });
  };

  render() {
    return (
      <Formik
        validate={this.validateWalletId}
        initialValues={{
          walletId: ''
        }}
        onSubmit={(values, actions) => this.transferGem(values)}
        render={({ errors, touched, isSubmitting, isValidating, status }) => (
          <Form className="flex col jcc mt3">
            <Field type="text" name="walletId">
              {({ field }) => (
                <Input
                  type="text"
                  {...field}
                  placeholder="Send this gem to someone"
                />
              )}
            </Field>
            {errors.walletId &&
              touched.walletId && <p className="orange">{errors.walletId}</p>}

            {/* <div className="pa3 flex jcc"> */}
            <div className="w-100 w5-ns h3 center mt4">
              <ColourButton
                htmlType="submit"
                disabled={isSubmitting}
                loading={isValidating || isSubmitting}
                className="b"
              >
                <span role="img" aria-label="gift emoji">
                  🎁
                </span>
                Gift
              </ColourButton>
            </div>
            {status && status.msg && <div>{status.msg}</div>}
          </Form>
        )}
      />
    );
  }
}

const connectedGiftGems = props => (
  <Subscribe to={[AppContainer]}>
    {app => (
      <GiftGems
        web3={app.state.web3}
        gemsContract={app.state.gemsContract}
        currentAccountId={app.state.currentAccountId}
        {...props}
      />
    )}
  </Subscribe>
);

const actions = dispatch => ({
  handleRemoveGemFromDashboard: tokenId =>
    dispatch({ type: 'GEM_GIFTED', payload: Number(tokenId) })
});

export default compose(
  connect(
    null,
    actions
  ),
  withRouter
)(connectedGiftGems);

// export default withStateMachine(stateMachine)(connectedGiftGems);
