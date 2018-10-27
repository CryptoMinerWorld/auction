import React from 'react';
import styled from 'styled-components';
import Avatar from 'antd/lib/avatar';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Auth from '../features/auth';
import RippleButton from './RippleButton/RippleButton';
import img from '../app/images/Profile-Image-Logo-60x60.png';
// import { showSignInModal } from '../features/auth/authActions';
require('antd/lib/avatar/style/css');

const BottomHighlight = styled.div`
  background: linear-gradient(to right, #bc197c, #fc01ca);
  border-radius: 4px 4px 0px 0px;
  height: 3px;
`;

const select = store => ({
  userImage: store.auth.user && store.auth.user.imageURL,
  userId: store.auth.user && store.auth.user.walletId,
  userName: store.auth.user && store.auth.user.name,
  existingUser: store.auth.existingUser,
  signInBox: store.auth.signInBox,
});

const Navbar = ({
  userImage,
  userId,
  userName,
  handleShowSignInModal,
  existingUser,
  signInBox,
}) => (
  <div className="shadow-1 z-9 bg-white w-100">
    {signInBox && <Auth />}
    <nav className="db dt-l w-100 border-box pa3 ph4-l bg-white mw9 center">
      <div className="dn db-ns tc-m">
        <a
          className="dtc-l v-mid mid-gray link dim tl mb2 mb0-l dib"
          href="https://cryptominerworld.com/"
          title="Home"
        >
          <img
            src={img}
            className="dib h-auto w3 br-100 pl3 pl0-ns ph2-ns"
            alt="CryptoMiner World"
          />
        </a>

        <div className="dn-ns fr mt2 ">
          <RippleButton
            onClick={() => {}}
            className="ml4 dib bg-black shadow-1 white br2 pa3 ph4"
            title="FAQ"
          />
        </div>
      </div>

      <div className="db dtc-l v-mid w-75-l tr-l tc nowrap overflow-x-auto mt3-ns mt0-ns">
        <a href="https://cryptominerworld.com/" title="Home" className="fl">
          <img src={img} className="dib h2 w-auto br-100 dn-ns mr3" alt="CryptoMiner World" />
        </a>
        <a
          className="link dim dark-gray f6 f5-l dn dib-ns mr3 mr4-l"
          href="https://cryptominerworld.com/game_info/"
          title="Game Information"
        >
          Game Info
        </a>

        {existingUser ? (
          <NavLink
            className="link dim dark-gray f6 f5-l dib mr3 mr4-l"
            to={`/profile/${userId}`}
            title="Workshop"
            activeStyle={{
              borderBottom: '2px solid purple',
            }}
            data-testid="myWorkshop"
          >
            My Workshop
          </NavLink>
        ) : (
          <div
            className=" dim dark-gray f6 f5-l dib mr3 mr4-l pointer"
            title="Workshop"
            onClick={() => handleShowSignInModal()}
            onKeyPress={() => handleShowSignInModal()}
            role="button"
            tabIndex={0}
            data-testid="signUp"
          >
            Workshop
          </div>
        )}
        <NavLink
          exact
          to="/market"
          activeStyle={{
            borderBottom: '2px solid purple',
          }}
          className="link dim dark-gray f6 f5-l dib mr3 mr4-l"
        >
          Market
        </NavLink>
        <a
          className="link dim dark-gray f6 f5-l dn dib-ns mr3 mr4-l"
          href="https://cryptominerworld.com/world/"
          title="World"
        >
          World
        </a>
        <a
          href="https://cryptominerworld.com/faq/"
          title="Home"
          className="dib dn-ns link dim dark-gray f6 f5-l"
        >
          FAQ
        </a>
        {userImage
          && userName && (
            <NavLink to={`/profile/${userId}`} className="dn dib-ns">
              <div className="dib">
                <Avatar src={userImage} className="dib" />
                <p className="dib">{userName}</p>
              </div>
            </NavLink>
        )}
        <div className="dn dib-ns">
          <RippleButton
            onClick={() => {}}
            href="https://cryptominerworld.com/faq/"
            className="ml4 dib bg-black shadow-1 white br2 pa3 ph4"
            title="FAQ"
          />
        </div>
      </div>
    </nav>
    <BottomHighlight />
  </div>
);

const actions = dispatch => ({
  handleShowSignInModal: () => dispatch({ type: 'SHOW_SIGN_IN_BOX' }),
});

export default connect(
  select,
  actions,
  null,
  { pure: false },
)(Navbar);

Navbar.propTypes = {
  userImage: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  userId: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  userName: PropTypes.string,
  handleShowSignInModal: PropTypes.func.isRequired,
  existingUser: PropTypes.bool,
  signInBox: PropTypes.bool.isRequired,
};

Navbar.defaultProps = {
  userImage: false,
  userId: false,
  userName: null,
  existingUser: false,
};
