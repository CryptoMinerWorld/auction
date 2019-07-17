// @ts-check
import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {NavLink} from 'react-router-dom';
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

const select = store => {

    console.warn('----------> Nav starts <----------');
    const res = {
        user: store.auth.user,
        //userImage: store.auth.user && store.auth.user.imageURL,
        //userId: store.auth.user && store.auth.user.walletId,
        //userName: store.auth.user && store.auth.user.name,
        existingUser: store.auth.existingUser,
        signInBox: store.auth.signInBox,
        upperCaseWalletId: store.app && store.app.currentAccount,
    };
    console.log('NAV store: ', res);
    return res;
};

const Navbar = ({
                    //userImage,
                    //userId,
                    //userName,
                    user,
                    handleShowSignInModal,
                    existingUser,
                    signInBox,
                    upperCaseWalletId,
                }) => (
  <div className="shadow-1 z-9 bg-white w-100">
      {signInBox && <Auth/>}
      <Nav className="flex wrap jcb aic w-100 border-box ph4-l bg-white mw9 center">
          <div style={{width: '20%'}} className="flex aic jcb">
              <a
                className=" mid-gray link dim mb0 mb0-l dib"
                href="https://cryptominerworld.com/"
                title="Home"
              >
                  <img
                    src={img}
                    className="dib h-auto w-70 br-100 pl3 pl0-ns ph2-ns "
                    alt="CryptoMiner World"
                  />
              </a>
              <Tx auth={existingUser}/>
          </div>

          <div style={{width: '80%',  }} className="flex aic flex-nowrap tc tr-ns nowrap overflow-x-auto">
              {/* <a href="https://cryptominerworld.com/" title="Home" className="fl">
          <img src={img} className="dib h2 w-auto br-100 dn-ns mr3" alt="CryptoMiner World" />
        </a> */}


              {existingUser ? (
                <NavLink
                  className="link dim dark-gray f6 f5-l dib mr3 mr4-l"
                  to={`/profile/${user.walletId}`}
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
              <NavLink
                exact
                to="/plots"
                activeStyle={{
                    borderBottom: '2px solid purple',
                }}
                className="link dim dark-gray f6 f5-l dib mr3 mr4-l b"
                data-testid="mapLink"
                style={{
                    color: 'purple',
                }}
              >
                  Plots of Land
              </NavLink>
              <NavLink
                exact
                to="/S_and_G_Sale"
                activeStyle={{
                    borderBottom: '2px solid purple',
                }}
                className="link dim dark-gray f6 f5-l dib mr3 mr4-l"
                data-testid="mapLink"
                style={{
                    color: 'purple',
                }}
              >
                  Silver and Gold
              </NavLink>
              {user && (
                <AvatarDropdown
                  //to={`/profile/${user.walletId}`}
                  user={user}
                  upperCaseWalletId={upperCaseWalletId}
                />
              )}
              <div className="dib">
                  <RippleButton
                    onClick={() => {
                    }}
                    href="https://cryptominerworld.com/faq/"
                    className="ml3 dib shadow-1 white br2 pa2 ph3 b"
                    title="How To Play"
                  />
              </div>
          </div>
      </Nav>
      <BottomHighlight/>
  </div>
);

const actions = dispatch => ({
    handleShowSignInModal: () => dispatch({type: 'SHOW_SIGN_IN_BOX'}),
});

export default connect(
  select,
  actions,
  null,
  {pure: false},
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

const Nav = styled.nav`
    @media(max-width: 800px) {
        padding: 0.25rem;
        padding-bottom: 0;
    }
    @media(min-width: 800px) {
        padding: 1rem;
    }
    `;
