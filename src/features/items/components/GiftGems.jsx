import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { withStateMachine, State } from 'react-automata';
import { Formik, Field, Form } from 'formik';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { db } from '../../../app/utils/firebase';
import { OxToLowerCase } from '../../../app/utils/helpers';
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

export const stateMachine = {
  initial: 'idle',
  states: {
    idle: {
      on: {
        GIFT: 'loading'
      }
    },
    loading: {
      onEntry: 'checkReceiverDetails',
      on: {
        SUCCESS: 'confirm',
        ERROR: 'error'
      }
    },
    confirm: {
      on: {
        TRANSFER: 'transferring',
        CANCEL: 'idle'
      }
    },
    transferring: {
      onEntry: 'transferGem',
      on: {
        SUCCESS: 'done',
        ERROR: 'error'
      }
    },
    done: {
      onEntry: 'redirectToMarket'
    },
    error: {
      on: {
        TRANSFER: 'transferring',
        GIFT: 'loading',
        CANCEL: 'idle'
      }
    }
  }
};

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

  transferOwnershipOnDatabase = async (to, tokenId) => {
    db.doc(`users/${OxToLowerCase(to)}`)
      .get()
      .then(doc => [doc.data().name, doc.data().imageURL])
      .then(([name, image]) =>
        db.doc(`stones/${tokenId}`).update({
          owner: OxToLowerCase(to),
          userName: name,
          userImage: image
        })
      )
      .catch(error => this.props.transition('ERROR', { error }));
  };

  transferGem = () => {
    const {
      gemsContract,
      currentAccountId,
      match,
      walletId,
      transition
    } = this.props;
    const to = walletId;
    const from = currentAccountId;
    const tokenId = match.params.gemId;

    // validate here
    // try using a guard
    console.warn(to, from, tokenId, gemsContract);

    gemsContract.methods
      .safeTransferFrom(from, to, tokenId)
      .send()
      .then(async () => {
        await this.transferOwnershipOnDatabase(from, to, tokenId);
        transition('SUCCESS', { from });
        // history.push(`/profile/${from}`);
      })
      .catch(error => transition('ERROR', { error }));
  };

  redirectToMarket = () =>
    this.props.history.push(`/profile/${this.props.from}`);

  checkReceiverDetails = () => {
    const { walletId, transition } = this.props;
    db.doc(`users/${OxToLowerCase(walletId)}`)
      .get()
      .then(
        doc =>
          doc.exists
            ? transition('SUCCESS', {
                name: doc.data().name,
                image: doc.data().imageURL
              })
            : transition('ERROR', { error: 'No user exists' })
      )
      .catch(err => console.warn(err, 'error finding gift reciver on db'));
  };

  render() {
    const { transition, machineState, match, error } = this.props;
    console.log('machineState', machineState.value);
    return (
      <Formik
        validate={this.validateWalletId}
        initialValues={{
          walletId: ''
        }}
        onSubmit={values => transition('GIFT', { walletId: values.walletId })}
        render={({ errors, touched, isSubmitting }) => (
          <Form className="flex col jcc mt3">
            <State
              is={['idle', 'loading']}
              render={visible =>
                visible ? (
                  <div>
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
                      touched.walletId && (
                        <p className="orange">{errors.walletId}</p>
                      )}
                  </div>
                ) : null
              }
            />

            <State is={['error', 'confirm']}>
              <div>
                {`You sending gem id ${match.params.gemId} to ${
                  this.props.name
                }`}{' '}
                <img
                  src={this.props.image}
                  alt={this.props.name}
                  className="h3 w-auto"
                />
              </div>
              Continue the transfer?
              <Button onClick={() => transition('TRANSFER')}>Transfer</Button>
              <Button onClick={() => transition('CANCEL')}>Cancel</Button>
            </State>

            <State is={['error']}>
              We didn't find a user with that wallet address, would you like to
              send it to that address anyway?{' '}
              <Button onClick={() => transition('TRANSFER')}>Transfer</Button>
              <Button onClick={() => transition('CANCEL')}>Cancel</Button>
            </State>

            <State is={['idle', 'loading']}>
              <div className="pa3 flex jcc">
                <Button
                  htmlType="submit"
                  disabled={isSubmitting}
                  loading={machineState.value === 'loading'}
                >
                  <span role="img" aria-label="gift emoji">
                    🎁
                  </span>
                  Gift
                </Button>
              </div>
            </State>
            {error && <div className="red">{error}</div>}
          </Form>
        )}
      />
    );
  }
}

// const connectedGiftGems = props => (
//   <Subscribe to={[AppContainer]}>
//     {app => (
//       <GiftGems
//         web3={app.state.web3}
//         gemsContract={app.state.gemsContract}
//         currentAccountId={app.state.currentAccountId}
//         {...props}
//       />
//     )}
//   </Subscribe>
// );

// const actions = dispatch => ({
//   handleRemoveGemFromDashboard: tokenId =>
//     dispatch({ type: 'GEM_GIFTED', payload: Number(tokenId) })
// });

const select = store => ({
  web3: store.app.web3,
  gemsContract: store.app.gemsContract,
  currentAccountId: store.app.currentAccountId
});

export default compose(
  connect(select),
  withRouter,
  withStateMachine(stateMachine)
)(GiftGems);

export const TestGiftGems = withStateMachine(stateMachine)(GiftGems);
