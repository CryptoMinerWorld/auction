import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createNewUser } from "./authActions";

const select = store => ({
  currentUser: store.auth.currentUserId,
  web3: store.auth.web3
});

class Auth extends Component {
  static propTypes = {
    // currentUser: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    web3: PropTypes.shape({
      currentProvider: PropTypes.shape({
        publicConfigStore: PropTypes.shape({
          on: PropTypes.func
        })
      })
    })
  };

  static defaultProps = {
    // currentUser: false,
    web3: {}
  };

  state = {};

  render() {
    // const { currentUser } = this.props;
    return <div>{/* <p>{currentUser}</p> */}</div>;
  }
}

const actions = {
  handleCreateNewUser: createNewUser
};

export default connect(
  select,
  actions
)(Auth);
