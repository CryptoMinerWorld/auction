import React from 'react';
import styled from 'styled-components';
import img from '../images/footer_geodes.png';

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

const Footer = () =>    
      <div className="bg-footer-black">
        <TopHighlight />
        <div className="mw9 center">
          <BackgroundImage className="pa4 pa6-l bt b--black-10  ">
            <div className="mb4-l cf">
              <article className="fl w-50 dib-ns w-auto-ns mr4-m mr5-l mb4 pr2 pr0-ns white">
                <a
                href="https://cryptominerworld.com/"
                  className="f5 db fw6 pv3 black-70 link dim white"
                  title="Home"
                >
                  Home
                </a>
                <a
                href="https://cryptominerworld.com/game_info/"
                  className="f5 db fw6 pv3 black-70 link dim white"
                  title="Game Info"
                >
                  Game Info
                </a>
                <a
               href="https://cryptominerworld.com/founders_geode_pre-sale/"
               title="Geode Pre-Sale"
                  className="f5 db fw6 pv3 black-70 link dim white"
                
                >
                  Founder Geode Pre-Sale
                </a>
                <a
            
                  className="f5 db fw6 pv3 black-70 link dim white"
                  href="https://cryptominerworld.com/workshop/"
                  title="Workshop"
                >
                  Workshop
                </a>
                <a
             
                  className="f5 db fw6 pv3 black-70 link dim white"
                  href="https://cryptominerworld.com/market/"
                  title="Market"
                >
                  Market
                </a>
                <a
             
                  className="f5 db fw6 pv3 black-70 link dim white"
                  href="https://cryptominerworld.com/world/"
                  title="World"
                >
                  World
                </a>
              </article>
              <article
                className="fl-ns w-50-ns
          db w-100 dib-ns w-auto-ns mr4-m mr5-l mb4 pr2 pr0-ns"
              >
                <a
               href="https://cryptominerworld.com/faq/"
                  className="f5 db fw6 pv3 black-70 link dim white"
                  title="FAQ"
                >
                  FAQ
                </a>
              
              </article>
              <div className="cf dn-ns" />


              <article className="fr w-50-ns w-100 dib-ns w-auto-ns mr4-m mr5-l mb4 pr2 pr0-ns ">
                <div className="db dtc-ns tc tr-ns v-mid">
                  <a
                    href="https://www.facebook.com/CryptoMinerWorld/"

                    className="link dim dib mr3 white"
                    title="Cryptominer World on Facebook"
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                  </a>
                  <a
                    href="https://twitter.com/CryptoMiner_W"
                    className="link dim dib mr3 white"
                    title="Cryptominer World on Twitter"
                  >
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-twitter"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>
                  </a>
                </div>
              </article>
            </div>

            <div className="dt dt--fixed w-100">
              <div className="dn dtc-ns v-mid">
                <p className="f7 black-70 dib pr3 mb3 white">
                  Copyright © Cryptominer World 2018
                </p>
                <p className="f7 black-70 dib pr3 mb3 white">Version 0.0.10</p>
              </div>
            </div>
            <div className="db dn-ns">
              <p className="f7 white mt4 tl">Copyright © Cryptominer World 2018</p>
            </div>
          </BackgroundImage>
        </div>
      </div>


export default Footer;
