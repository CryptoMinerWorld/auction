import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import img from '../app/images/rockFooter.png';
import rockBackground from '../app/images/rockBackground.png';

import discord from '../app/images/socialMediaIcons/Discord Icon.png';
import facebook from '../app/images/socialMediaIcons/Facebook Icon.png';
import twitter from '../app/images/socialMediaIcons/Twitter Icon.png';
import instagram from '../app/images/socialMediaIcons/Instagram Icon.png';
import medium from '../app/images/socialMediaIcons/Medium Icon.png';
import reddit from '../app/images/socialMediaIcons/Reddit Icon.png';
import telegram from '../app/images/socialMediaIcons/Telegram Icon.png';

const TopHighlight = styled.div`
  background: linear-gradient(to right, #fc01ca, #bc197c);
  border-radius: 4px 4px 0px 0px;
  height: 3px;
  width: 100%;
`;

const RockOverlay = styled.div`
  background-image: url(${rockBackground});
  background-repeat: repeat;
  background-size: contain;
  width: 100%;
`;
const FooterLink = ({ link, title, hover }) => (
  <a href={link} className={`f5 db fw6 pv3 black-70 link dim white ${hover}`} title={title}>
    {title}
  </a>
);

FooterLink.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  hover: PropTypes.string,
};

FooterLink.defaultProps = {
  hover: null,
};

const Footer = () => (
  <div className="bg-footer-black">
    <TopHighlight />
    <RockOverlay className=" center">
      <div className="pa4 bt b--black-10">
        <div className="mb6-l">
          <article className="flex jcb w-75 center mt5 col row-ns tc">
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
            <FooterLink link="https://cryptominerworld.com/workshop/" title="Workshop" />

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
            <FooterLink link="https://cryptominerworld.com/faq/" title="FAQ" hover="hover-gold" />
            <FooterLink
              link="http://www.sophophilia.com/press/sheet.php?p=cryptoMiner_world"
              title="Press Kit"
            />
          </article>

          <div className="flex jcc aic mv5 row-ns col">
            <SocialIcons
              link="https://www.facebook.com/CryptoMinerWorld/"
              title="Cryptominer World on Facebook"
              path={facebook}
            />

            <SocialIcons
              link="https://twitter.com/CryptoMiner_W"
              title="Cryptominer World on Twitter"
              path={twitter}
            />

            <SocialIcons
              link="https://discordapp.com/invite/rHQwfQv"
              title="Cryptominer World on Discord"
              path={discord}
            />

            <SocialIcons
              link="https://www.instagram.com/cryptominerworld/"
              title="Cryptominer World on Instagram"
              path={instagram}
            />

            <SocialIcons
              link="https://medium.com/@CMWorld"
              title="Cryptominer World on Medium"
              path={medium}
            />

            <SocialIcons
              link="https://www.reddit.com/r/CryptoMinerWorld/"
              title="Cryptominer World on Reddit"
              path={reddit}
            />
            <SocialIcons
              link="https://telegram.me/CryptoMinerWorld"
              title="Cryptominer World on Telegram"
              path={telegram}
            />
          </div>
        </div>
        <div className="flex jcc pb5-ns">
          <div className="flex jcc">
            <p className="f7 black-70 dib pr3 mb3 white">Copyright © Cryptominer World 2018</p>
            <p className="f7 black-70 dib pr3 mb3 white">Version 1.2.5</p>
          </div>
        </div>
      </div>
      <img src={img} alt="" className="w-100 h-auto" />
    </RockOverlay>
  </div>
);

export default Footer;

const SocialIcons = ({ link, title, path }) => (
  <a
    href={link}
    className="link dim dib ma2 white grow"
    title={title}
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src={path} alt={title} className="h3 w-auto" />
  </a>
);

SocialIcons.propTypes = {
  link: PropTypes.string,
  title: PropTypes.string,
  path: PropTypes.string,
};

SocialIcons.defaultProps = {
  link: '',
  title: '',
  path: '',
};
