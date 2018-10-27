import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from 'antd/lib/modal';
import Avatar from 'antd/lib/avatar';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import Checkbox from 'antd/lib/checkbox';
import { withStateMachine } from 'react-automata';
import { Spring } from 'react-spring';
import stateChart from './statechart';
import { createNewUser, notInterestedInSigningUp } from './authActions';

require('antd/lib/button/style/css');
require('antd/lib/modal/style/css');
require('antd/lib/avatar/style/css');
require('antd/lib/input/style/css');

const images = [
  'https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FAmethyst%20Face%20Emoji.png?alt=media&token=b38e3f31-7711-4e6a-a633-56edac59e6e6',
  'https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FAquamarine%20Face%20Emoji.png?alt=media&token=b759ae07-bb8c-4ec8-9399-d3844d5428ef',
  'https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FDiamond%20Face%20Emoji.png?alt=media&token=204fa183-d35d-4d40-b9a8-4cafcfc2d699',
  'https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FEmerald%20Face%20Emoji.png?alt=media&token=05d192c1-6c23-4e4f-ada6-b30848d9e9c7',
  'https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FGarnet%20Face%20Emoji.png?alt=media&token=09e2d41f-437c-4796-a513-bb55ffeced55',
  'https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FOpal%20Face%20Emoji.png?alt=media&token=1a515351-bd5c-4ff3-9ef9-89ea94526aa0',
  'https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FPearl%20Face%20Emoji.png?alt=media&token=fa3d8e39-3c70-4031-b45f-e6d236ca9daf',
  'https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FPeridot%20Face%20Emoji.png?alt=media&token=4dae6903-407d-495c-9046-ed7a36349237',
  'https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FRuby%20Face%20Emoji.png?alt=media&token=a8602159-0a25-4670-8593-8a35a4fde8e8',
  'https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FSapphire%20Face%20Emoji.png?alt=media&token=5a1214f5-968c-491f-9cfc-a4ef02230afc',
  'https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FTopaz%20Face%20Emoji.png?alt=media&token=5369bf8c-64ec-4a42-9169-6ca09ad2d126',
  'https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FTurquoise%20Face%20Emoji.png?alt=media&token=a7a8d52c-d99f-4b1b-bdd2-fca2bbee2556',
];
const select = store => ({
  currentUser: store.auth.currentUserId,
  web3: store.auth.web3,
});

class Auth extends PureComponent {
  static propTypes = {
    currentUser: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    web3: PropTypes.shape({
      currentProvider: PropTypes.shape({
        publicConfigStore: PropTypes.shape({
          on: PropTypes.func,
        }),
      }),
    }),
    handleCreateNewUser: PropTypes.func.isRequired,
    transition: PropTypes.func.isRequired,
    handleNotInterestedInSigningUp: PropTypes.func.isRequired,
    machineState: PropTypes.shape({}),
  };

  static defaultProps = {
    currentUser: false,
    web3: {},
    machineState: {},
  };

  state = {
    name: '',
    imageURL: '',
    terms: false,
    mailinglist: false,
  };

  static getDerivedStateFromProps(props, state) {
    // update local state based on currentid from metamask
    if (props.currentUser !== state.walletId) {
      return {
        walletId: props.currentUser,
      };
    }
    // Return null if the state hasn't changed
    return null;
  }

  componentWillUnmount() {
    this.setState({
      name: '',
      imageURL: '',
      email: '',
      terms: false,
    });
  }

  updateName = (value) => {
    const CapitalizedAndTrimmedValue = value
      .trim()
      .charAt(0)
      .toUpperCase()
      + value
        .trim()
        .slice(1)
        .toLowerCase();

    this.setState({ name: CapitalizedAndTrimmedValue });
  };

  updateEmail = email => this.setState({ email });

  updateImage = url => this.setState({ imageURL: url });

  handleAuthentication = () => {
    const {
      name, imageURL, email, mailinglist,
    } = this.state;
    const { currentUser, handleCreateNewUser, transition } = this.props;
    const payload = {
      name,
      imageURL,
      email,
      mailinglist,
      walletId: currentUser,
    };
    handleCreateNewUser(payload)
      .then(() => transition('SUCCESS'))
      .catch(() => transition('FAIL'));
  };

  handleRedirect = () => {
    const { handleNotInterestedInSigningUp } = this.props;
    handleNotInterestedInSigningUp();
    // history.push('/');
  };

  render() {
    const {
      imageURL, name, email, terms, mailinglist,
    } = this.state;
    const { currentUser, transition, machineState } = this.props;

    return (
      <div>
        <Modal
          title="Please Create Your Account"
          visible={machineState.value !== 'exit' && machineState.value !== 'authenticated'}
          onCancel={() => transition('CLOSE')}
          footer={[
            <div className="flex ais col" key="AuthDialogueFooterButtons">
              <Checkbox checked={terms} onChange={e => this.setState({ terms: e.target.checked })}>
                <p className="pl3 dib">
                  {' '}
                  I agree to the
                  {' '}
                  <a
                    href="https://drive.google.com/file/d/1oFMszefIhXJz01QXrSbU7vA-f2M92S3G/view?usp=sharing"
                    target="_blank"
                    className="dib"
                    rel="noopener noreferrer"
                  >
                    {' '}
                    Terms & Conditions
                  </a>
                  .
                </p>
              </Checkbox>
              <Checkbox
                checked={mailinglist}
                onChange={e => this.setState({ mailinglist: e.target.checked })}
              >
                <p className="pl3 dib">
                  Join the mailing list. (Don`t worry, we hate spam just like you do.)
                </p>
              </Checkbox>

              <Button
                key="submit"
                type="primary"
                className="w-100"
                loading={machineState.value === 'loading'}
                onClick={() => transition('SUBMIT', { state: this.state })}
              >
                Submit
              </Button>
            </div>,
          ]}
        >
          {name && (
            <div className="flex aic pa3 mb3 ">
              <div>
                <Avatar src={imageURL} size={64} />
              </div>
              <div className="truncate flex col aic w-100">
                <p className="pl4 f2 b pa0 ma0 w-100 ">{name}</p>
              </div>
            </div>
          )}

          <Input value={currentUser} disabled size="large" className="mv3" />
          <Input
            placeholder="Username"
            value={name}
            onChange={e => this.updateName(e.target.value)}
            size="large"
            className="mv3"
            type="text"
          />
          <Input
            placeholder="Email"
            value={email}
            onChange={e => this.updateEmail(e.target.value)}
            size="large"
            type="email"
            required
          />
          <div className="pa3">
            <div className="flex wrap jcb">
              {images.map(url => (
                <Avatar
                  key={url}
                  src={url}
                  onClick={() => this.updateImage(url)}
                  size={64}
                  className="mv2 pointer grow"
                />
              ))}
            </div>

            {machineState.value === 'error' ? (
              <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} delay={200}>
                {styles => (
                  <ul className="red b tl pt3 " style={styles}>
                    <li>Please check that is your wallet id in the top field.</li>
                    <li>Picked a username?</li>
                    <li>Provided a valid email?</li>
                    <li>Selected an avatar?</li>
                    <li>Agreed to the terms and conditions?</li>
                  </ul>
                )}
              </Spring>
            ) : (
              <p className="tc pt3">Please pick an avatar.</p>
            )}
          </div>
        </Modal>
      </div>
    );
  }
}

const actions = {
  handleCreateNewUser: createNewUser,
  handleNotInterestedInSigningUp: notInterestedInSigningUp,
};

export default compose(
  connect(
    select,
    actions,
  ),
  withRouter,
  withStateMachine(stateChart),
)(Auth);
