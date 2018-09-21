import React from "react";
import styled from "styled-components";
import Avatar from "antd/lib/avatar";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import RippleButton from "./RippleButton/RippleButton";
import img from "../images/Profile-Image-Logo-60x60.png";

require("antd/lib/avatar/style/css");

const BottomHighlight = styled.div`
  background: linear-gradient(to right, #bc197c, #fc01ca);
  border-radius: 4px 4px 0px 0px;
  height: 3px;
`;

const select = store => ({
  userImage: store.auth.user && store.auth.user.imageURL,
  userId: store.auth.user && store.auth.user.walletId
});

const Navbar = ({ userImage, userId }) => (
  <div className="shadow-1 z-9 bg-white w-100">
    <nav className="db dt-l w-100 border-box pa3 ph5-l bg-white mw9 center">
      <div className="dn db-ns">
        <a
          className="dtc-l v-mid mid-gray link dim tl mb2 mb0-l dib"
          href="https://cryptominerworld.com/"
          title="Home"
        >
          <img
            src={img}
            className="dib h-auto w3 br-100 pl3"
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
        <a href="https://cryptominerworld.com/" title="Home">
          <img
            src={img}
            className="dib h2 w-auto br-100 dn-ns mr3"
            alt="CryptoMiner World"
          />
        </a>
        <a
          className="link dim dark-gray f6 f5-l dib mr3 mr4-l"
          href="https://cryptominerworld.com/game_info/"
          title="Game Information"
        >
          Game Info
        </a>
        <a
          className="link dim dark-gray f6 f5-l dib mr3 mr4-l"
          href="https://cryptominerworld.com/founders_geode_pre-sale/"
          title="Geode Pre-Sale"
        >
          Founder Geode Pre-Sale
        </a>
        <a
          className="link dim dark-gray f6 f5-l dib mr3 mr4-l"
          href="https://cryptominerworld.com/workshop/"
          title="Workshop"
        >
          Workshop
        </a>
        <NavLink
          to="/market"
          activeStyle={{
            borderBottom: `2px solid purple`
          }}
          className="link dim dark-gray f6 f5-l dib mr3 mr4-l"
        >
          Market
        </NavLink>
        <a
          className="link dim dark-gray f6 f5-l dib mr3 mr4-l"
          href="https://cryptominerworld.com/world/"
          title="World"
        >
          World
        </a>
        <a
          href="https://cryptominerworld.com/faq/"
          title="Home"
          className="dib  dn-ns link dim dark-gray f6 f5-l"
        >
          FAQ
        </a>
        {userImage && (
          <NavLink
            to={`/profile/${userId}`}
            activeStyle={{
              borderBottom: `2px solid purple`,
              padding: `1rem`
            }}
          >
            <Avatar src={userImage} />
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

export default connect(select)(Navbar);

Navbar.propTypes = {
  userImage: PropTypes.oneOf([PropTypes.bool, PropTypes.string]),
  userId: PropTypes.string
};

Navbar.defaultProps = {
  userImage: false,
  userId: false
};
