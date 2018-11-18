import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { Transition } from 'react-spring';
import Button from 'antd/lib/button';
import CountryDetails from './CountryDetails';
import { CountryBar } from './CountryBar';
import { handleResell } from '../../helpers';

require('antd/lib/avatar/style/css');
require('antd/lib/icon/style/css');
require('antd/lib/card/style/css');

const smoothScroll = {
  timer: null,
  stop() {
    clearTimeout(this.timer);
  },

  scrollTo(id, callback) {
    const settings = {
      duration: 1000,
      easing: {
        outQuint(x, t, b, c, d) {
          // eslint-disable-next-line
          return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
      },
    };
    let percentage;
    let startTime;
    const node = document.getElementById(id);
    const nodeTop = node.offsetTop;
    const nodeHeight = node.offsetHeight;
    // eslint-disable-next-line
    const body = document.body;
    const html = document.documentElement;
    const height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
    );
    const windowHeight = window.innerHeight;
    const offset = window.pageYOffset;
    const delta = nodeTop - offset;
    const bottomScrollableY = height - windowHeight;
    const targetY = bottomScrollableY < delta
      ? bottomScrollableY - (height - nodeTop - nodeHeight + offset)
      : delta;

    // eslint-disable-next-line
    startTime = Date.now();
    percentage = 0;

    if (this.timer) {
      clearInterval(this.timer);
    }

    function step() {
      let yScroll;
      const elapsed = Date.now() - startTime;

      if (elapsed > settings.duration) {
        clearTimeout(this.timer);
      }

      percentage = elapsed / settings.duration;

      if (percentage > 1) {
        clearTimeout(this.timer);

        if (callback) {
          callback();
        }
      } else {
        yScroll = settings.easing.outQuint(0, elapsed, offset, targetY, settings.duration);
        window.scrollTo(0, yScroll);
        this.timer = setTimeout(step, 10);
      }
    }

    this.timer = setTimeout(step, 10);
  },
};

class Countries extends Component {
  static propTypes = {
    countries: PropTypes.arrayOf(PropTypes.shape({})),
    userId: PropTypes.string.isRequired,
    // DutchContract: PropTypes.shape({}).isRequired,
    // CountryERC721: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    countries: null,
  };

  state = {
    index: 0,
    selected: false,
  };

  componentDidMount() {
    // if there is a country name hash in the url open the workshop page on that country
    const { countries } = this.props;
    const country = window.location.hash.substring(1);

    if (countries && country) {
      const index = countries.findIndex(nation => nation.name === country);
      this.setState({ index, selected: true });
    }
  }

  selectCountry = (index) => {
    smoothScroll.scrollTo('top');
    this.setState({ index, selected: true });
    // window.scrollTo(0, 0);
  };

  render() {
    const { index, selected } = this.state;
    const {
      countries,
      // CountryERC721, DutchContract,
      userId,
    } = this.props;

    return (
      <div data-testid="countriesExist" id="top" className="pa0 ">
        <Transition
          items={countries[index]}
          from={{ transform: 'translate3d(0,-40px,0)' }}
          enter={{ transform: 'translate3d(0,0px,0)' }}
          leave={{ transform: 'translate3d(0,-40px,0)' }}
        >
          {item => selected
            && item
            && countries && (
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
                // sellMethod={CountryERC721 && CountryERC721.methods}
                // countrySaleContractId={process.env.REACT_APP_DUTCH_AUCTION}
                userId={userId}
                countryId={countries[index].countryId}
                onSale={countries[index].onSale}
                // erc721CountryContract={process.env.REACT_APP_COUNTRY_ERC721}
                // dutchContractMethods={DutchContract && DutchContract.methods}
              />
          )
          }
        </Transition>

        <CountryBar countries={countries} selectCountry={this.selectCountry} />
        <div className="tc center mv5">
          <Button
            type="dashed"
            icon="plus"
            ghost
            onClick={() => {}}
            className="hover-blue white ml3 w-75 mv3 ttu center"
          >
            Show Stats for all
          </Button>
        </div>
      </div>
    );
  }
}

// const selection = store => ({
//   CountryERC721: store.app.countryContractInstance,
//   DutchContract: store.app.dutchContractInstance,
// });

export default Countries;
