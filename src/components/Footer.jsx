import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import img from '../app/images/rockFooter.png';
import rockBackground from '../app/images/rockBackground.png';

const TopHighlight = styled.div`
  background: linear-gradient(to right, #fc01ca, #bc197c);
  border-radius: 4px 4px 0px 0px;
  height: 3px;
`;

const RockOverlay = styled.div`
  background-image: url(${rockBackground});
  background-repeat: repeat;
  background-size: contain;
`;
const FooterLink = ({ link, title, hover }) => (
  <a
    href={link}
    className={`f5 db fw6 pv3 black-70 link dim white ${hover}`}
    title={title}
  >
    {title}
  </a>
);

FooterLink.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
};

const Footer = () => (
  <div className="bg-footer-black">
    <TopHighlight />
    <RockOverlay className="mw9 center">
      <div className="pa4 bt b--black-10">
        <div className="mb6-l">
          <article className="flex jcb w-75 center mt5">
            <FooterLink
              link="https://cryptominerworld.com/"
              title="Home"
              hover="
              hover-light-purple"
            />

            <FooterLink
              link="https://cryptominerworld.com/game_info/"
              title="Game Info"
              hover="hover-gold"
            />
            <FooterLink
              link="https://cryptominerworld.com/workshop/"
              title="Workshop"
            />

            <FooterLink
              link="https://cryptominerworld.com/market/"
              title="Market"
              hover="
              hover-light-purple"
            />
            <FooterLink
              link="https://cryptominerworld.com/world/"
              title="World"
              hover="hover-green"
            />
            <FooterLink
              link="https://cryptominerworld.com/faq/"
              title="FAQ"
              hover="hover-gold"
            />
            <FooterLink
              link="http://www.sophophilia.com/press/sheet.php?p=cryptoMiner_world"
              title="Press Kit"
            />
          </article>

          <div className="flex jcc mt5">
            <SocialIcons
              link="https://www.facebook.com/CryptoMinerWorld/"
              title="Cryptominer World on Facebook"
              path="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
            />

            <SocialIcons
              link="https://twitter.com/CryptoMiner_W"
              title="Cryptominer World on Twitter"
              path="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
            />
          </div>
        </div>

        <div className="flex jcc pb5-ns">
          <div className="flex jcc">
            <p className="f7 black-70 dib pr3 mb3 white">
              Copyright © Cryptominer World 2018
            </p>
            <p className="f7 black-70 dib pr3 mb3 white">Version 0.1.12</p>
          </div>
        </div>
        <div className="db dn-ns">
          <p className="f7 white mt4 tc">Copyright © Cryptominer World 2018</p>
        </div>
      </div>
      <img src={img} alt="" className="w-100 h-auto" />
    </RockOverlay>
  </div>
);

export default Footer;

const SocialIcons = ({ link, title, path }) => (
  <a href={link} className="link dim dib mr3 white" title={title}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  </a>
);

SocialIcons.propTypes = {
  link: PropTypes.string,
  title: PropTypes.string,
  path: PropTypes.string
};

SocialIcons.defaultProps = {
  link: '',
  title: '',
  path: ''
};
