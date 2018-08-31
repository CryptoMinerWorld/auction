import React, { PureComponent } from 'react';
import styled from 'styled-components';
import gemKid from '../images/gemKid.png';

const OverlapOnDesktopView = styled.div`
  @media (min-width: 64em) {
    position: relative;
    top: 7em;
  }
`;

class MailingList extends PureComponent {
  static propTypes = {};

  render() {
    return (
      <OverlapOnDesktopView>
        <div className="pa4-l bg-transparent">
          <form className="bg-off-black mw8 center pa2 br2-ns ba b--black-10 flex-ns aic shadow-3">
            <img src={gemKid} alt="gem kid" className="dn dib-ns mh3 h4" />
            <legend className="pa0 f5 f4-ns mb3 white w-50-ns tl-ns tc">
              <p className="f2 mb0">Early bird gets the gem.</p>
              <p className="mt0">Be notified when our next auction starts.</p>
            </legend>
            <fieldset className="bn ma0 pa0 w-50-ns">
              <div className="">
                <label className="clip" htmlFor="email-address">
                  Email Address
                </label>
                <input
                  className="f6 f5-l input-reset bn fl white bg-dark-gray pa3 lh-solid w-100 w-75-m w-80-l br2-ns br--left-ns"
                  placeholder="Your Email Address"
                  type="text"
                  name="email-address"
                  value=""
                  id="email-address"
                />
                <input
                  className="f6 f5-l button-reset fl pv3 tc bn bg-animate bg-black-70 hover-bg-black white pointer w-100 w-25-m w-20-l br2-ns br--right-ns"
                  type="submit"
                  value="Subscribe"
                />
              </div>
            </fieldset>
          </form>
        </div>
      </OverlapOnDesktopView>
    );
  }
}

export default MailingList;
