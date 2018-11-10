import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CountryDetails from './CountryDetails';
import { CountryBar } from './CountryBar';
import { handleResell } from '../../helpers';

require('antd/lib/avatar/style/css');
require('antd/lib/icon/style/css');
require('antd/lib/card/style/css');

class Countries extends PureComponent {
  static propTypes = {
    countries: PropTypes.arrayOf(PropTypes.shape({})),
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
        {country && (
          <CountryDetails
            name={country.name}
            lastBought={country.lastBought}
            description={country.description}
            totalPlots={country.totalPlots}
            plotsBought={country.plotsBought}
            plotsMined={country.plotsMined}
            plotsAvailable={country.plotsAvailable}
            image={country.image}
            lastPrice={country.lastPrice}
            roi={country.roi}
            handleResell={handleResell}
          />
        )}
        <CountryBar countries={countries} />
      </div>
    );
  }
}

export default Countries;
