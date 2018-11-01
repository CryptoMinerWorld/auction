import Card from 'antd/lib/card';
import Icon from 'antd/lib/icon';
import Avatar from 'antd/lib/avatar';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import flags from '../../../../app/images/flags/in.png';

require('antd/lib/avatar/style/css');
require('antd/lib/icon/style/css');
require('antd/lib/card/style/css');

class Countries extends PureComponent {
  static propTypes = {
    countries: PropTypes.arrayOf({}),
  };

  static defaultProps = {
    countries: null,
  };

  state = {
    country: null,
  };

  componentDidMount() {
    const { countries } = this.props;
    this.setState({ country: countries[0] });
  }

  render() {
    const { country } = this.state;
    const { countries } = this.props;
    return (
      <div data-testid="countriesExist">
        <CountryDetails country={country} />
        <CountryBar countries={countries} />
      </div>
    );
  }
}

export default Countries;

const CountryDetails = ({ country }) => (
  <div>
    Details for
    {country && country.name}
  </div>
);

const CountryBar = ({ countries }) => (
  <div className=" overflow-auto bg-dark-gray" style={{ whiteSpace: 'nowrap' }}>
    {countries
      && countries.map(country => (
        <Card
          key={country.key}
          style={{ width: 300 }}
          className="ma4 dib"
          cover={(
            <img
              alt="example"
              src="http://bestabstractwallpapers.com/wp-content/uploads/2017/12/Blank-India-map-images-with-transparent-background.png"
            />
)}
          actions={[<Icon type="dollar" theme="outlined" />, <Icon type="gift" theme="outlined" />]}
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

CountryDetails.propTypes = {
  country: PropTypes.shape({}).isRequired,
};

CountryBar.propTypes = {
  countries: PropTypes.arrayOf({}).isRequired,
};
