import React from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/lib/card';
import Icon from 'antd/lib/icon';
import Avatar from 'antd/lib/avatar';
import flags from '../../../../app/images/flags/in.png';

export const CountryCard = ({
  name,
  image,
  miniflags,
  index,
  selectCountry,
  // onSale,
}) => (
  <Card
    onClick={() => selectCountry(index)}
    key={`${name}${Math.random()}`}
    style={{ width: 300 }}
    className="ma4 dib"
    cover={<img alt={name} src={image} />}
    actions={[<Icon type="dollar" theme="outlined" />]}
  >
    <Card.Meta
      avatar={<Avatar src={miniflags} />}
      // style={onSale && { backgroundColor: 'red' }}
      title={name}
      data-testid="countryCard"
      description="This is the description"
    />
  </Card>
);
CountryCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  miniflags: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  selectCountry: PropTypes.func.isRequired,
  // onSale: PropTypes.bool.isRequired,
};

export const CountryBar = ({ countries, selectCountry }) => (
  <div className="overflow-auto bg-off-black mv5 pa0" style={{ whiteSpace: 'nowrap' }}>
    {countries
      && countries.map((country, index) => (
        <CountryCard
          // onSale={country && country.onSale ? country.onSale : false}
          name={country.name}
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
