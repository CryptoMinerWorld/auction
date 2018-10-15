import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { withStateMachine } from 'react-automata';
import { Formik, Field, Form } from 'formik';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import { Subscribe } from 'unstated';
import AppContainer from '../../../app/containers/App';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { db } from '../../../app/utils/firebase';

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
        onSubmit={
          (values, actions) => this.transferGem(values)

          //   // MyImaginaryRestApiCall(user.id, values).then(
          //   //   updatedUser => {
          //   //     actions.setSubmitting(false);
          //   //     updateUser(updatedUser);
          //   //     onClose();
          //   //   },
          //   //   error => {
          //   //     actions.setSubmitting(false);
          //   //     actions.setErrors(transformMyRestApiErrorsToAnObject(error));
          //   //     actions.setStatus({ msg: 'Set some arbitrary status or data' });
          //   //   }
          //   // );
        }
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

            <div className="pa3 flex jcc">
              <Button
                htmlType="submit"
                disabled={isSubmitting}
                loading={isValidating || isSubmitting}
              >
                <span role="img" aria-label="gift emoji">
                  🎁
                </span>
                Gift
              </Button>
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
