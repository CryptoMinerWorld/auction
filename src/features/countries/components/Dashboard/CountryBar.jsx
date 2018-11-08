import React from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/lib/card';
import Icon from 'antd/lib/icon';
import Avatar from 'antd/lib/avatar';
import flags from '../../../../app/images/flags/in.png';

const CountryBar = ({ countries }) => (
  <div className=" overflow-auto bg-dark-gray" style={{ whiteSpace: 'nowrap' }}>
    {countries
        && countries.map(country => (
          <Card
            key={`${country.name}${Math.random()}`}
            style={{ width: 300 }}
            className="ma4 dib"
            cover={(
              <img
                alt="example"
                src="http://bestabstractwallpapers.com/wp-content/uploads/2017/12/Blank-India-map-images-with-transparent-background.png"
              />
  )}
            actions={[<Icon type="dollar" theme="outlined" />,
            // , <Icon type="gift" theme="outlined" />
            ]}
          >
            <Card.Meta
              avatar={<Avatar src={flags} />}
              title={country.name}
              data-testid="countryCard"
              description="This is the description"
            />
          </Card>
        ))}
  </div>
);

export default CountryBar;

CountryBar.propTypes = {
  countries: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
