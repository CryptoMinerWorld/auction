import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/lib/button';
import { withStateMachine } from 'react-automata';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Icon from 'antd/lib/icon';
//import { updateGemDetails } from '../dashboardActions';

export const statechart = {
  initial: 'start',
  states: {
    start: {
      on: {
        SYNC: 'loading',
      },
    },
    loading: {
      onEntry: 'updateGemDetails',
      on: {
        SUCCESS: 'start',
        FAILURE: 'error',
      },
    },
    error: {
      on: {
        SYNC: 'loading',
      },
    },
  },
};

const select = store => ({
  userId: store.auth.currentUserId,
  gemContract: store.app.gemsContractInstance,
  userName: store.auth.user && store.auth.user.name && store.auth.user.name,
  userImage: store.auth.user && store.auth.user.imageURL && store.auth.user.imageURL,
});

class ReSync extends PureComponent {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    gemContract: PropTypes.shape({}).isRequired,
    userName: PropTypes.string,
    userImage: PropTypes.string,
    success: PropTypes.bool,
    error: PropTypes.string,
  };

  static defaultProps = {
    error: '',
    success: false,
    userImage: '',
    userName: '',

  };

  // updateGemDetails = async () => {
  //   const {
  //     handleUpdateGemDetails,
  //     transition,
  //     userId,
  //     gemContract,
  //     userName,
  //     userImage,
  //   } = this.props;
  //
  //   handleUpdateGemDetails(userId, gemContract, userName, userImage)
  //     .then(result => transition('SUCCESS', { success: result }))
  //     .catch(error => transition('FAILURE', {
  //       // eslint-disable-next-line
  //         error: error.message_ || error,
  //     }));
  // };

  render() {
    const {
      userId,
      gemContract,
      userName,
      userImage,
      success,
      error,
    } = this.props;

    return (
      <div className="flex aic">
        {/*<div className="flex aic">*/}
          {/*{machineState.value === 'error' && error && <p className="red pr4 ma0">{error}</p>}*/}
          {/*{machineState.value === 'start' && success && <p className="green pr4 ma0">{success}</p>}*/}
        {/*</div>*/}
        {userId
          && gemContract
          && userName
          && userImage && (
            <Button
              onClick={() => transition('SYNC')}
              loading={machineState.value === 'loading'}
              ghost
            >
              <Icon type="sync" />
              Refresh
            </Button>
        )}
      </div>
    );
  }
}

const actions = {
  //handleUpdateGemDetails: updateGemDetails,
};

export default compose(
  connect(
    select,
    actions,
  ),
  //withStateMachine(statechart),
)(ReSync);

export const TestReSync = withStateMachine(statechart)(ReSync);
