import React, { PureComponent } from 'react';
import styled from 'styled-components';
import RippleButton from './RippleButton/RippleButton';

const BottomHighlight = styled.div`
  background: linear-gradient(to right, #bc197c, #fc01ca);
  border-radius: 4px 4px 0px 0px;
  height: 3px;
`;

class Navbar extends PureComponent {
  static propTypes = {};

  render() {
    return (
      <div className="shadow-1 z-9 bg-white w-100">
        <nav className="db dt-l w-100 border-box pa3 ph5-l bg-white mw9 center">
          <div>
            <a
              className="dtc-l v-mid mid-gray link dim tl mb2 mb0-l dib"
              href="#"
              title="Home"
            >
              <img
                src={require('../images/Profile-Image-Logo-60x60.png')}
                className="dib w3 h-auto br-100 pl3"
                alt="CryptoMiner World"
              />
            </a>

            <div className="dn-ns fr mt2">
              <RippleButton
                onClick={() => {}}
                className="ml4 dib bg-black shadow-1 white br2 pa3 ph4"
                title="FAQ"
              />
            </div>
          </div>
          <div className="db dtc-l v-mid w-75-l tr-l tc nowrap overflow-x-auto mt3 mt0-ns">
            <a
              className="link dim dark-gray f6 f5-l dib mr3 mr4-l"
              href="#"
              title="Home"
            >
              Game Info
            </a>
            <a
              className="link dim dark-gray f6 f5-l dib mr3 mr4-l"
              href="#"
              title="How it Works"
            >
              Founder's Geode Pre-Sale
            </a>
            <a
              className="link dim dark-gray f6 f5-l dib mr3 mr4-l"
              href="#"
              title="Blog"
            >
              Workshop
            </a>
            <a
              className="link dim dark-gray f6 f5-l dib mr3 mr4-l"
              href="#"
              title="Press"
            >
              Market
            </a>
            <a
              className="link dim dark-gray f6 f5-l dib"
              href="#"
              title="Contact"
            >
              World
            </a>
            <div className="dn dib-ns">
              <RippleButton
                onClick={() => {}}
                className="ml4 dib bg-black shadow-1 white br2 pa3 ph4"
                title="FAQ"
              />
            </div>
          </div>
        </nav>
        <BottomHighlight />
      </div>
    );
  }
}

export default Navbar;
