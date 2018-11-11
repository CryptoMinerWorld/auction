import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CountryDetails from './CountryDetails';
import { CountryBar } from './CountryBar';
import { handleResell } from '../../helpers';

require('antd/lib/avatar/style/css');
require('antd/lib/icon/style/css');
require('antd/lib/card/style/css');

class Countries extends Component {
  static propTypes = {
    countries: PropTypes.arrayOf(PropTypes.shape({})),
    userId: PropTypes.string.isRequired,
    DutchContract: PropTypes.shape({}).isRequired,
    CountryERC721: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    countries: null,
  };

  state = {
    index: 0,
  };

  selectCountry = (index) => {
    this.setState({ index });
  };

  render() {
    const { index } = this.state;
    const {
      countries, CountryERC721, DutchContract, userId,
    } = this.props;

    console.log('countries', countries);
    return (
      <div data-testid="countriesExist">
        <CountryDetails
          name={countries[index].name}
          lastBought={countries[index].lastBought}
          description={countries[index].description}
          totalPlots={countries[index].totalPlots}
          plotsBought={countries[index].plotsBought}
          plotsMined={countries[index].plotsMined}
          plotsAvailable={countries[index].plotsAvailable}
          image={countries[index].image}
          lastPrice={countries[index].lastPrice}
          roi={countries[index].roi}
          handleResell={handleResell}
          sellMethod={CountryERC721 && CountryERC721.methods}
          countrySaleContractId={process.env.REACT_APP_DUTCH_AUCTION}
          userId={userId}
          countryId={countries[index].countryId}
          onSale={countries[index].onSale}
          erc721CountryContract={process.env.REACT_APP_COUNTRY_ERC721}
          dutchContractMethods={DutchContract && DutchContract.methods}
        />
        <CountryBar countries={countries} selectCountry={this.selectCountry} />
      </div>
    );
  }
}

const selection = store => ({
  CountryERC721: store.app.countryContractInstance,
  DutchContract: store.app.dutchContractInstance,
});

export default connect(selection)(Countries);
