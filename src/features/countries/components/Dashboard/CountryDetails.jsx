import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { GIFT_COUNTRY_MUTATION } from '../../mutations';

const CountryDetails = ({ country, handleGiftFormSubmit }) => {
  const [visible, show] = useState(false);
  const [giftReceiverUserId, setValue] = useState('');

  return (
    <Mutation
      mutation={GIFT_COUNTRY_MUTATION}
      variables={{
        id: country && country.name,
        newOwnerId: giftReceiverUserId
          .split('')
          .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
          .join(''),
        gift: true,
        timeOfGifting: 1541129757489,
      }}
    >
      {giftCountryMutation => (
        <div data-testid="countryDetails">
          <form
            className="gift-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleGiftFormSubmit(show, giftCountryMutation);
            }}
          >
            <fieldset>
              <label htmlFor="countryGiftInput">
                Gift A Country
                <input
                  type="text"
                  name="countryGiftInput"
                  id="countryGiftInput"
                  className="black"
                  value={giftReceiverUserId}
                  onChange={e => setValue(e.target.value)}
                />
              </label>
            </fieldset>
            <button type="submit" className="black" data-testid="giftSubmit">
              Gift
              {country && country.name}
            </button>
          </form>
          {visible && <p className="green">Your form has been submitted!</p>}
        </div>
      )}
    </Mutation>
  );
};

export default CountryDetails;

CountryDetails.propTypes = {
  country: PropTypes.shape({}),
  handleGiftFormSubmit: PropTypes.func.isRequired,
};

CountryDetails.defaultProps = {
  country: { name: 'Portugal' },
};
