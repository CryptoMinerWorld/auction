import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CountryDisplay from './CountryDisplay';
import {graphql} from 'react-apollo';
import {MAP_COUNTRY_DATA} from "../../queries";

// const statechart = {
//   initial: 'noMetamask',
//   states: {
//     noMetamask: {
//       on: {
//         COUNTRIES: 'countries',
//         NO_COUNTRIES: 'noCountries',
//         NO_ACCOUNT: 'noAccount',
//         NO_METAMASK: 'noMetamask',
//       },
//     },
//     countries: {
//       on: {
//         COUNTRIES: 'countries',
//         NO_COUNTRIES: 'noCountries',
//         NO_ACCOUNT: 'noAccount',
//         NO_METAMASK: 'noMetamask',
//       },
//     },
//     noCountries: {
//       on: {
//         COUNTRIES: 'countries',
//         NO_COUNTRIES: 'noCountries',
//         NO_ACCOUNT: 'noAccount',
//         NO_METAMASK: 'noMetamask',
//       },
//     },
//     noAccount: {
//       on: {
//         COUNTRIES: 'countries',
//         NO_COUNTRIES: 'noCountries',
//         NO_ACCOUNT: 'noAccount',
//         NO_METAMASK: 'noMetamask',
//       },
//     },
//   },
// };

class CountryDashboard extends Component {
    static propTypes = {
        userId: PropTypes.string.isRequired,
    };

    static defaultProps = {
        userCountryIdList: [],
    };

    componentDidMount() {
        const {
        } = this.props;

        // if (!countries || countries.length === 0) {
        //   transition('NO_COUNTRIES');
        // } else {
        //   transition('COUNTRIES');
        // }
    }

    componentDidUpdate(prevProps) {
        const {data, userCountryIdList, userCountries, transition} = this.props;
        console.log('COUNTRY DASHBOARD PROPS', this.props);

        // if (data && (userCountryIdList !== prevProps.userCountryIdList || prevProps.data.mapCountries !== data.mapCountries)) {
        //     let userCountries = [];
        //
        //     this.setState({
        //         userCountries: userCountries,
        //     })
        // }

        // if (prevProps.countries !== countries) {
        //   if (!countries || countries.length === 0) {
        //     transition('NO_COUNTRIES');
        //   } else {
        //     transition('COUNTRIES');
        //   }
        // }
    }

    render() {
        const {userCountryIdList, userId, data} = this.props;

        let userCountries = [];
        if (data && data.mapCountries && userCountryIdList.length > 0) {
            userCountries = data.mapCountries.filter((country =>
                userCountryIdList.includes(country.countryId)
            ))
            userCountries.forEach((country) => {
                country.plotsBought = 0;
                country.plotsMined = 0;
                country.plotsAvailable = country.plots;
                country.totalPlots = country.plots;
                country.lastPrice = country.price;
            })
        }

        return (
          <div className="pa0">
              <CountryDisplay countries={userCountries} userId={userId}/>
          </div>
        );
    }
}

export default graphql(MAP_COUNTRY_DATA)(CountryDashboard);
