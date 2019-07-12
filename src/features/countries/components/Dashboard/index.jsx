import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CountryDisplay from './CountryDisplay';
import {graphql} from 'react-apollo';
import {MAP_COUNTRY_DATA} from "../../queries";
import {COUNTRY_PLOTS_DATA} from "../../../plotsale/country_plots_data";
import Loading from "../../../../components/Loading";
import {CountryWithdraw} from "./CountryWithdraw";

class CountryDashboard extends Component {
    static propTypes = {
        userId: PropTypes.string.isRequired,
    };

    static defaultProps = {
        userCountryIdList: [],
    };

    state = {userCountries: null};

    componentDidMount() {
        const {userCountryIdList, data, handleGetAvailableCountryPlots} = this.props;
        let totalEarned = 0;
        let userCountries = [];
        if (data && data.mapCountries && userCountryIdList.length > 0) {
            console.log("data map Countries", data.mapCountries, userCountryIdList);
            userCountries = data.mapCountries.filter((country =>
                userCountryIdList.includes(country.countryId)
            ));
            userCountries.forEach(async (country) => {
                const availablePlots = await handleGetAvailableCountryPlots(country.countryId);
                country.plotsBought = COUNTRY_PLOTS_DATA[country.countryId - 1] - availablePlots;
                country.plotsMined = 0;
                country.plotsAvailable = availablePlots;
                country.totalPlots = country.plots;
                country.lastPrice = country.price;
                totalEarned += country.plotsBought * 0.002;
            });
            this.setState({userCountries, totalEarned});
        }
    }

    componentDidUpdate(prevProps) {
        const {data, userCountryIdList, handleGetAvailableCountryPlots} = this.props;
        console.log('COUNTRY DASHBOARD PROPS', this.props, this.state);
        let userCountries = [];
        let totalEarned = 0;
        if (data && (userCountryIdList !== prevProps.userCountryIdList || prevProps.data.mapCountries !== data.mapCountries)) {
            let userCountries = [];
            if (data && data.mapCountries && userCountryIdList.length > 0) {
                console.log("data map Countries", data.mapCountries, userCountryIdList);
                userCountries = data.mapCountries.filter((country =>
                    userCountryIdList.includes(country.countryId)
                ));
                userCountries.forEach(async (country) => {
                    console.log("COUNTRY::", country);
                    const availablePlots = await handleGetAvailableCountryPlots(country.countryId);
                    country.plotsBought = COUNTRY_PLOTS_DATA[country.countryId - 1] - availablePlots;
                    country.plotsMined = 0;
                    country.plotsAvailable = availablePlots;
                    country.totalPlots = country.plots;
                    country.lastPrice = country.price;
                    totalEarned += country.plotsBought * 0.002;
                });
                this.setState({userCountries, totalEarned});
            }
        }
    }

    render() {
        const {userId, totalNotWithdrawn, withdrawEth, isWithdrawing, currentUserId} = this.props;
        const {userCountries, totalEarned} = this.state;
        console.log("user Countries: ", userCountries);
        const isOwner = currentUserId && userId && currentUserId.toLowerCase() === userId.toLowerCase();
        return (
          userCountries ? (
              userCountries.length > 0 ?
                (
                  <div className="pa0">
                      {isOwner &&
                      <CountryWithdraw
                        totalNotWithdrawn={parseFloat(totalNotWithdrawn)}
                        totalWithdrawn={!isNaN(parseFloat(totalNotWithdrawn)) && !isNaN(parseFloat(totalEarned)) ? parseFloat(totalEarned) - parseFloat(totalNotWithdrawn) : null}
                        isWithdrawing={isWithdrawing}
                        withdrawEth={withdrawEth}
                      />}
                      <CountryDisplay countries={userCountries} showForOwner={isOwner}/>
                  </div>
                ) :
                (
                  <div style={{textAlign: 'center'}}>No countries found</div>
                )
            ) :
            (
              <div style={{width: '100%', height: "100px", position: 'relative'}}>
                  <div style={{textAlign: 'center'}}>Countries are loading..</div>
                  <Loading/>
              </div>
            )
        );
    }
}

export default graphql(MAP_COUNTRY_DATA)(CountryDashboard);
