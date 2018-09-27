import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Modal from "antd/lib/modal";
import Avatar from "antd/lib/avatar";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
import { withRouter, Redirect } from "react-router-dom";
import { compose } from "redux";
import { createNewUser } from "./authActions";

require("antd/lib/button/style/css");
require("antd/lib/modal/style/css");
require("antd/lib/avatar/style/css");
require("antd/lib/input/style/css");

const images = [
  "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FAmethyst%20Face%20Emoji.png?alt=media&token=b38e3f31-7711-4e6a-a633-56edac59e6e6",
  "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FAquamarine%20Face%20Emoji.png?alt=media&token=b759ae07-bb8c-4ec8-9399-d3844d5428ef",
  "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FDiamond%20Face%20Emoji.png?alt=media&token=204fa183-d35d-4d40-b9a8-4cafcfc2d699",
  "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FEmerald%20Face%20Emoji.png?alt=media&token=05d192c1-6c23-4e4f-ada6-b30848d9e9c7",
  "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FGarnet%20Face%20Emoji.png?alt=media&token=09e2d41f-437c-4796-a513-bb55ffeced55",
  "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FOpal%20Face%20Emoji.png?alt=media&token=1a515351-bd5c-4ff3-9ef9-89ea94526aa0",
  "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FPearl%20Face%20Emoji.png?alt=media&token=fa3d8e39-3c70-4031-b45f-e6d236ca9daf",
  "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FPeridot%20Face%20Emoji.png?alt=media&token=4dae6903-407d-495c-9046-ed7a36349237",
  "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FRuby%20Face%20Emoji.png?alt=media&token=a8602159-0a25-4670-8593-8a35a4fde8e8",
  "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FSapphire%20Face%20Emoji.png?alt=media&token=5a1214f5-968c-491f-9cfc-a4ef02230afc",
  "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FTopaz%20Face%20Emoji.png?alt=media&token=5369bf8c-64ec-4a42-9169-6ca09ad2d126",
  "https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/avatars%2FTurquoise%20Face%20Emoji.png?alt=media&token=a7a8d52c-d99f-4b1b-bdd2-fca2bbee2556"
];
const select = store => ({
  currentUser: store.auth.currentUserId,
  web3: store.auth.web3,
  newUser: store.auth.newUser
});

class Auth extends PureComponent {
  static propTypes = {
    currentUser: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    web3: PropTypes.shape({
      currentProvider: PropTypes.shape({
        publicConfigStore: PropTypes.shape({
          on: PropTypes.func
        })
      })
    }),
    handleCreateNewUser: PropTypes.func.isRequired
  };

  static defaultProps = {
    currentUser: false,
    web3: {}
  };

  state = {
    visible: true,
    loading: false,
    name: "",
    imageURL: "",
    redirectHome: false
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.visible !== nextProps.newUser) {
      return {
        visible: nextProps.newUser
      };
    }
    // Return null to indicate no change to state.
    return null;
  }

  showModal = () => {
    this.setState({
      visible: true,
      loading: false
    });
  };

  handleOk = () => {
    const { name, imageURL } = this.state;
    const { currentUser, handleCreateNewUser } = this.props;
    const payload = {
      name,
      imageURL,
      walletId: currentUser
    };
    handleCreateNewUser(payload);
  };

  updateName = value => {
    const CapitalizedAndTrimmedValue =
      value
        .trim()
        .charAt(0)
        .toUpperCase() +
      value
        .trim()
        .slice(1)
        .toLowerCase();

    this.setState({ name: CapitalizedAndTrimmedValue });
  };

  updateImage = url => this.setState({ imageURL: url });

  handleCancel = () =>
    this.setState({
      redirectHome: true
    });

  render() {
    const { visible, loading, imageURL, name, redirectHome } = this.state;
    const { currentUser } = this.props;
    if (redirectHome) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <Modal
          title="Please Create Your Account"
          visible={visible}
          closable
          onCancel={this.handleCancel}
          footer={[
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.handleOk}
              disabled={!(name && imageURL)}
            >
              Submit
            </Button>
          ]}
        >
          {name && (
            <div className="flex aic pa3">
              <Avatar src={imageURL} />
              <p className="pl4 f2 b">{name}</p>
            </div>
          )}
          <Input value={currentUser} disabled size="large" />
          <Input
            placeholder="Username"
            value={name}
            onChange={e => this.updateName(e.target.value)}
            size="large"
            className="mv3"
          />
          <div className="pa3">
            <p className="center">Please select an avatar</p>
            <div className="flex wrap jcb">
              {images.map(url => (
                <Avatar
                  src={url}
                  onClick={() => this.updateImage(url)}
                  size={64}
                  className="mv2"
                />
              ))}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const actions = {
  handleCreateNewUser: createNewUser
};

export default compose(
  connect(
    select,
    actions
  ),
  withRouter
)(Auth);
