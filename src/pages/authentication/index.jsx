import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Modal from "antd/lib/modal";
import Avatar from "antd/lib/avatar";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
import { createNewUser } from "./authActions";

import amethyst from "../../images/gemProfileImages/Amethyst Face Emoji.png";
import aquamarine from "../../images/gemProfileImages/Aquamarine Face Emoji.png";
import diamond from "../../images/gemProfileImages/Diamond Face Emoji.png";
import emerald from "../../images/gemProfileImages/Emerald Face Emoji.png";
import garnet from "../../images/gemProfileImages/Garnet Face Emoji.png";
import opal from "../../images/gemProfileImages/Opal Face Emoji.png";
import pearl from "../../images/gemProfileImages/Pearl Face Emoji.png";
import peridot from "../../images/gemProfileImages/Peridot Face Emoji.png";
import ruby from "../../images/gemProfileImages/Ruby Face Emoji.png";
import sapphire from "../../images/gemProfileImages/Sapphire Face Emoji.png";
import topaz from "../../images/gemProfileImages/Topaz Face Emoji.png";
import turquoise from "../../images/gemProfileImages/Turquoise Face Emoji.png";

require("antd/lib/button/style/css");
require("antd/lib/modal/style/css");
require("antd/lib/avatar/style/css");
require("antd/lib/input/style/css");

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
    name: "Welcome",
    imageURL: ""
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

  updateName = value => this.setState({ name: value });

  updateImage = url => this.setState({ imageURL: url });

  render() {
    const { visible, loading, imageURL, name } = this.state;
    return (
      <div>
        <Modal
          title="Please create your account"
          visible={visible}
          closable={false}
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
          <hr />
          <div className="flex aic pa3">
            <Avatar src={imageURL} />

            <p className="pl4 f2 b">{name}</p>
          </div>
          <hr />
          <br />
          <br />
          <Input
            placeholder="What is your name?"
            onChange={e => this.updateName(e.target.value)}
          />
          <br />
          <br />
          <Avatar src={amethyst} onClick={() => this.updateImage(amethyst)} />
          <Avatar
            src={aquamarine}
            onClick={() => this.updateImage(aquamarine)}
          />
          <Avatar src={diamond} onClick={() => this.updateImage(diamond)} />
          <Avatar src={emerald} onClick={() => this.updateImage(emerald)} />
          <Avatar src={garnet} onClick={() => this.updateImage(garnet)} />
          <Avatar src={opal} onClick={() => this.updateImage(opal)} />
          <Avatar src={pearl} onClick={() => this.updateImage(pearl)} />
          <Avatar src={peridot} onClick={() => this.updateImage(peridot)} />
          <Avatar src={ruby} onClick={() => this.updateImage(ruby)} />

          <Avatar src={sapphire} onClick={() => this.updateImage(sapphire)} />
          <Avatar src={topaz} onClick={() => this.updateImage(topaz)} />
          <Avatar src={turquoise} onClick={() => this.updateImage(turquoise)} />

          <p>Please select an avatar</p>
        </Modal>
      </div>
    );
  }
}

const actions = {
  handleCreateNewUser: createNewUser
};

export default connect(
  select,
  actions
)(Auth);
