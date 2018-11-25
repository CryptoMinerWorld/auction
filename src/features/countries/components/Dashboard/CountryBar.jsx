import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export const CountryCard = ({
  name, image, index, selectCountry,
}) => (
  <Link to={`#${name}`}>
    {' '}
    <div
      onClick={() => selectCountry(index)}
      onKeyDown={() => selectCountry(index)}
      role="button"
      tabIndex={index}
      className="bg-dark-gary white w5 ma4 grow pointer"
    >
      <figure className="ma0 pa0 flex aic col">
        <img src={image} alt="gem" className="ma0 pa3 pb0 h5 w-auto" />
        <figcaption hidden>{name}</figcaption>
      </figure>

      <div className="tc">
        <p className="ttu white tc b o-50">{name}</p>
      </div>
    </div>
  </Link>
);
CountryCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  selectCountry: PropTypes.func.isRequired,
};

export const CountryBar = ({ countries, selectCountry }) => (
  <div
    className="overflow-auto bg-off-black mv5 pa0 shadow-2 flex"
    style={{ whiteSpace: 'nowrap' }}
  >
    {countries
      && countries.map((country, index) => (
        <CountryCard
          name={country.name}
          key={country.name}
          index={index}
          selectCountry={selectCountry}
          image={country.imageLinkMedium}
        />
      ))}
  </div>
);

CountryBar.propTypes = {
  countries: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectCountry: PropTypes.func.isRequired,
};
