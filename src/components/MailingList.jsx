import React, { PureComponent } from 'react';
import styled from 'styled-components';
import MailchimpSubscribe from "react-mailchimp-subscribe"
import gemKid from '../images/gemKid.png';

const url = "https://joshpitzalis.us14.list-manage.com/subscribe/post?u=2c6088d1532d8f6a70091ef05&amp;id=1d31a52e03"


class CustomForm extends PureComponent {
  state = {
    email: ''
  }

  handleChange = (event) => this.setState({ email: event.target.value })

  handleSubmit = (subscribe, formData) => (e) => {

    e.preventDefault();

    subscribe({ EMAIL: formData })
  }

  render() {
    const { email } = this.state
    return (
      <MailchimpSubscribe
        url={url}
        render={({ subscribe, status, message }) => (
          <div>
            <form onSubmit={this.handleSubmit(subscribe, email)}>
              <input
                id="email-address"
                className="f6 f5-l input-reset bn fl white bg-dark-gray pa3 lh-solid w-100 w-75-m w-80-l br2-ns br--left-ns"
                placeholder="Your Email Address"
                type="text"
                name="email-address"
                onChange={this.handleChange}
                value={email}
              />

              <input
                className="f6 f5-l button-reset fl pv3 tc bn bg-animate bg-black-70 hover-bg-black white pointer w-100 w-25-m w-20-l br2-ns br--right-ns"
                type="submit"
                value="Subscribe"
              />
            </form>
            <div className='w-100 fl tl' >
              {status === "sending" && <div className='primary'>Sending...</div>}
              {status === "error" && <div className='red'
                dangerouslySetInnerHTML={{ __html: message }}
              />}
              {status === "success" && <div className='primary'>{`${message}`}</div>}</div>

          </ div>
        )}
      />
    )
  }
}

const OverlapOnDesktopView = styled.div`
  @media (min-width: 64em) {
          position: relative;
        top: 7em;
      }
    `;

const MailingList = () =>
  <OverlapOnDesktopView>
    <div className="pa4-l bg-transparent">
      <div className="bg-off-black mw8 center pa2 br2-ns ba b--black-10 flex-ns aic shadow-3">
        <img src={gemKid} alt="gem kid" className="dn dib-ns mh3 h4" />
        <legend className="pa0 f5 f4-ns mb3 white w-50-ns tl-ns tc">
          <p className="f2 mb0">Early bird gets the gem.</p>
          <p className="mt0">Be notified when our next auction starts.</p>
        </legend>
        <fieldset className="bn ma0 pa0 w-50-ns">
          <CustomForm />
        </fieldset>
      </div>
    </div>
  </OverlapOnDesktopView>


export default MailingList;
