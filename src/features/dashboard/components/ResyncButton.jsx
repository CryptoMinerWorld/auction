import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import Button from 'antd/lib/button';
import { withStateMachine } from 'react-automata';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { updateGemDetails } from '../dashboardActions';

export const statechart = {
  initial: 'start',
  states: {
    start: {
      on: {
        SYNC: 'loading'
      }
    },
    loading: {
      onEntry: 'updateGemDetails',
      on: {
        SUCCESS: 'start',
        FAILURE: 'error'
      }
    },
    error: {
      on: {
        SYNC: 'loading'
      }
    }
  }
};

const select = store => ({
  userId: store.auth.currentUserId,
  gemContract: store.app.gemsContractInstance,
  userName: store.auth.user && store.auth.user.name,
  userImage: store.auth.user && store.auth.user.imageURL
});

class ReSync extends PureComponent {
  static propTypes = {};

  updateGemDetails = async () => {
    const {
      handleUpdateGemDetails,
      transition,
      userId,
      gemContract,
      userName,
      userImage
    } = this.props;
    handleUpdateGemDetails(userId, gemContract, userName, userImage)
      .then(() => transition('SUCCESS'))
      .catch(error => transition('FAILURE', { error }));
  };

  render() {
    const {
      transition,
      machineState,
      userId,
      gemContract,
      userName,
      userImage
    } = this.props;
    console.log('this.props.error', this.props.error);
    console.log('machineState.value', machineState.value);
    console.log('this.props.newGems', this.props.newGems);
    return (
      <div className="flex">
        {/* {machineState.value === 'error' &&
          this.props.error && <p className="red pr4">{this.props.error}</p>} */}

        {machineState.value === 'start' &&
          this.props.success && <p className="green pr4">Gems updated.</p>}
        {userId &&
          gemContract &&
          userName &&
          userImage && (
            <Button
              onClick={() => transition('SYNC')}
              loading={machineState.value === 'loading'}
              ghost
            >
              Refresh Gems
            </Button>
          )}
      </div>
    );
  }
}

const actions = {
  handleUpdateGemDetails: updateGemDetails
};

export default compose(
  connect(
    select,
    actions
  ),
  withStateMachine(statechart)
)(ReSync);
