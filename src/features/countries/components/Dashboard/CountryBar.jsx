import React from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/lib/card';
import Icon from 'antd/lib/icon';
import Avatar from 'antd/lib/avatar';
import flags from '../../../../app/images/flags/in.png';

export const CountryCard = ({ name, image, miniflags }) => (
  <Card
    key={`${name}${Math.random()}`}
    style={{ width: 300 }}
    className="ma4 dib"
    cover={<img alt={name} src={image} />}
    actions={[<Icon type="dollar" theme="outlined" />]}
  >
    <Card.Meta
      avatar={<Avatar src={miniflags} />}
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
};

export const CountryBar = ({ countries }) => (
  <div className=" overflow-auto bg-dark-gray" style={{ whiteSpace: 'nowrap' }}>
    {countries
      && countries.map(country => (
        <CountryCard
          name={country.name}
          image={country.image || 'http://bestabstractwallpapers.com/wp-content/uploads/2017/12/Blank-India-map-images-with-transparent-background.png'}
          flags={flags}
        />
      ))}
  </div>
);

CountryBar.propTypes = {
  countries: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
