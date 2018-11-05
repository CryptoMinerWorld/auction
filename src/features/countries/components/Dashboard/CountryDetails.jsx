import React from 'react';
import PropTypes from 'prop-types';


const CountryDetails = ({ country }) => (
  <div data-testid="countryDetails">
    Details for
    {country && country.name}
  </div>
);

export default CountryDetails;

CountryDetails.propTypes = {
  country: PropTypes.shape({}),
};

CountryDetails.defaultProps = {
  country: { name: 'Portugal' },
};
