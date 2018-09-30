import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import img from "../app/images/footer_geodes.png";

const TopHighlight = styled.div`
  background: linear-gradient(to right, #fc01ca, #bc197c);
  border-radius: 4px 4px 0px 0px;
  height: 3px;
`;

const BackgroundImage = styled.footer`
  background-image: url(${img});
  background-size: contain;
  background-position: bottom;
  background-repeat: no-repeat;
`;

const FooterLink = ({ link, title }) => (
  <a
    href={link}
    className="f5 db fw6 pv3 black-70 link dim white"
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
    <div className="mw9 center">
      <BackgroundImage className="pa4 bt b--black-10">
        <div className="mb6-l cf">
          <article className="fl w-50 dib-ns w-auto-ns mr4-m mr5-l mb4 pr2 pr0-ns white">
            <FooterLink link="https://cryptominerworld.com/" title="Home" />
            <FooterLink
              link="https://cryptominerworld.com/game_info/"
              title="Game Info"
            />
            <FooterLink
              link="https://cryptominerworld.com/founders_geode_pre-sale/"
              title="Founder Geode Pre-Sale"
            />
            <FooterLink
              link="https://cryptominerworld.com/workshop/"
              title="Workshop"
            />
            <FooterLink
              link="https://cryptominerworld.com/market/"
              title="Market"
            />
            <FooterLink
              link="https://cryptominerworld.com/world/"
              title="World"
            />
          </article>
          <article
            className="fl-ns w-50-ns
          db w-100 dib-ns w-auto-ns mr4-m mr5-l mb4 pr2 pr0-ns"
          >
            <FooterLink link="https://cryptominerworld.com/faq/" title="FAQ" />
          </article>
          <div className="cf dn-ns" />

          <article className="fr w-50-ns w-100 dib-ns w-auto-ns mr4-m mr5-l mb4 pr2 pr0-ns ">
            <div className="db dtc-ns tc tr-ns v-mid">
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
          </article>
        </div>

        <div className="dt dt--fixed w-100">
          <div className="dn dtc-ns v-mid">
            <p className="f7 black-70 dib pr3 mb3 white">
              Copyright © Cryptominer World 2018
            </p>
            <p className="f7 black-70 dib pr3 mb3 white">Version 0.1.6</p>
          </div>
        </div>
        <div className="db dn-ns">
          <p className="f7 white mt4 tl">Copyright © Cryptominer World 2018</p>
        </div>
      </BackgroundImage>
    </div>
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
  link: "",
  title: "",
  path: ""
};
