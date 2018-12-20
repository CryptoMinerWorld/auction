// @ts-check
import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Auth from '../features/auth';
import RippleButton from './RippleButton/RippleButton';
// @ts-ignore
import img from '../app/images/Profile-Image-Logo-60x60.png';
import Tx from '../features/transactions/index';
import AvatarDropdown from '../features/transactions/components/AvatarDropdown';

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
  upperCaseWalletId: store.app && store.app.currentAccount,
});

const Navbar = ({
  userImage,
  userId,
  userName,
  handleShowSignInModal,
  existingUser,
  signInBox,
  upperCaseWalletId,
}) => (
  <div className="shadow-1 z-9 bg-white w-100">
    {signInBox && <Auth />}
    <nav className="flex wrap jcb aic w-100 border-box pa3 ph4-l bg-white mw9 center">
      <div className="flex aic w-100 w-third-ns jcb">
        <a
          className=" mid-gray link dim mb2 mb0-l dib"
          href="https://cryptominerworld.com/"
          title="Home"
        >
          <img
            src={img}
            className="dib h-auto w3 br-100 pl3 pl0-ns ph2-ns "
            alt="CryptoMiner World"
          />
        </a>
        <Tx auth={existingUser} />
      </div>

      <div className="w-100 w-two-thirds-ns tc tr-ns nowrap overflow-x-auto">
        {/* <a href="https://cryptominerworld.com/" title="Home" className="fl">
          <img src={img} className="dib h2 w-auto br-100 dn-ns mr3" alt="CryptoMiner World" />
        </a> */}
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
          Gem Market
        </NavLink>
        <NavLink
          exact
          to="/map"
          activeStyle={{
            borderBottom: '2px solid purple',
          }}
          className="link dim dark-gray f6 f5-l dib mr3 mr4-l b"
          data-testid="mapLink"
          style={{
            color: 'purple',
          }}
        >
          Country Market
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
          && userName
          && userId && (
            <AvatarDropdown
              to={`/profile/${userId}`}
              userImage={userImage}
              userName={userName}
              // walletId={userId}
              upperCaseWalletId={upperCaseWalletId}
            />
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
  upperCaseWalletId: PropTypes.string,
};

Navbar.defaultProps = {
  userImage: '',
  userId: '',
  userName: '',
  existingUser: false,
  upperCaseWalletId: '',
};
