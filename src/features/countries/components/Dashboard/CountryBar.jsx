import React from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/lib/card';
// import Icon from 'antd/lib/icon';
// import Avatar from 'antd/lib/avatar';
import { Link } from 'react-router-dom';
import flags from '../../../../app/images/flags/in.png';

export const CountryCard = ({
  name,
  image,
  // miniflags,
  index,
  selectCountry,
  // onSale,
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
          image="https://firebasestorage.googleapis.com/v0/b/dev-cryptominerworld.appspot.com/o/flags%2FFlag_map_of_Andorra.svg?alt=media&token=ba5c8487-4d45-4a87-ac7e-9ad93a01130b"
          flags={flags}
        />
      ))}
  </div>
);

CountryBar.propTypes = {
  countries: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectCountry: PropTypes.func.isRequired,
};
