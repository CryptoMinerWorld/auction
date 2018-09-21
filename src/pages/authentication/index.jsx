import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Modal from "antd/lib/modal";
import Avatar from "antd/lib/avatar";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
import { createNewUser } from "./authActions";

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
    name: "",
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
          title="Welcome!"
          visible={visible}
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
          <div>
            <Avatar src={imageURL} />
            <p>{name}</p>
          </div>
          <hr />
          <Avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            onClick={() =>
              this.updateImage(
                "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              )
            }
          />
          <Avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            onClick={() =>
              this.updateImage(
                "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              )
            }
          />
          <Avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            onClick={() =>
              this.updateImage(
                "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              )
            }
          />
          <p>Please select an avatar</p>
          <Input
            placeholder="What is your name?"
            onChange={e => this.updateName(e.target.value)}
          />
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
