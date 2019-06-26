import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CountryDisplay from './CountryDisplay';
import {graphql} from 'react-apollo';
import {MAP_COUNTRY_DATA} from "../../queries";
import {getAvailableCountryPlots} from "../../../plotsale/plotSaleActions";
import {COUNTRY_PLOTS_DATA} from "../../../plotsale/country_plots_data";

class CountryDashboard extends Component {
    static propTypes = {
        userId: PropTypes.string.isRequired,
    };

    static defaultProps = {
        userCountryIdList: [],
    };

    state = {userCountries: []};

    componentDidMount() {
        const {userCountryIdList, data} = this.props;

        let userCountries = [];
        if (data && data.mapCountries && userCountryIdList.length > 0) {
            console.log("data map Countries", data.mapCountries, userCountryIdList);
            userCountries = data.mapCountries.filter((country =>
                userCountryIdList.includes(country.countryId)
            ));
            userCountries.forEach( async (country) => {
                const availablePlots = country.plots; //await handleGetAvailableCountryPlots(country.countryId);
                country.plotsBought = COUNTRY_PLOTS_DATA[country.countryId - 1] - availablePlots;
                //country.plotsMined = 0;
                country.plotsAvailable = availablePlots;
                country.totalPlots = country.plots;
                country.lastPrice = country.price;
            })
            this.setState({userCountries});
        }
    }

    componentDidUpdate(prevProps) {
        const {data, userCountryIdList} = this.props;
        console.log('COUNTRY DASHBOARD PROPS', this.props, this.state);
        let userCountries = [];
        if (data && (userCountryIdList !== prevProps.userCountryIdList || prevProps.data.mapCountries !== data.mapCountries)) {
            let userCountries = [];
            if (data && data.mapCountries && userCountryIdList.length > 0) {
                console.log("data map Countries", data.mapCountries, userCountryIdList);
                userCountries = data.mapCountries.filter((country =>
                    userCountryIdList.includes(country.countryId)
                ));
                userCountries.forEach(async (country) => {
                    console.log("COUNTRY::", country);
                    const availablePlots = country.plots;
                    country.plotsBought = COUNTRY_PLOTS_DATA[country.countryId - 1] - availablePlots;
                    //country.plotsMined = 0;
                    country.plotsAvailable = availablePlots;
                    country.totalPlots = country.plots;
                    country.lastPrice = country.price;
                })
                this.setState({userCountries});
            }
        }
    }

    render() {
        const {userId} = this.props;
        const {userCountries} = this.state;
        console.log("user Countries: ", userCountries);
        return (
          <div className="pa0">
              <CountryDisplay countries={userCountries} userId={userId}/>
          </div>
        );
    }
}

export default graphql(MAP_COUNTRY_DATA)(CountryDashboard);
