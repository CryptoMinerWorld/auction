import React from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/lib/card';
import { Link } from 'react-router-dom';

export const CountryCard = ({
  name,
  image,
  index,
  selectCountry,
}) => (
  <Link to={`#${name}`}>
    <Card
      onClick={() => selectCountry(index)}
      style={{ width: 300, height: 300 }}
      className="ma4 dib bg-off-black shadow-1 bn pa4 pointer"
      cover={<img alt={name} src={image} />}
    >
      <p className="ttu white tc b o-50">{name}</p>
    </Card>
  </Link>
);
CountryCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  selectCountry: PropTypes.func.isRequired,
};

export const CountryBar = ({ countries, selectCountry }) => (
  <div className="overflow-auto bg-off-black mv5 pa0 shadow-2 " style={{ whiteSpace: 'nowrap' }}>
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
