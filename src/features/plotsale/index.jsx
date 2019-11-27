import React, {Component} from 'react';
import Icon from 'antd/lib/icon';
import {db, rtdb} from '../../app/utils/firebase';
import Map from './components/Map';
import geoData from '../../app/maps/world-50m-with-population.json';
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import ChestsBar from "./components/ChestsBar";
import BuyForm from "./components/BuyForm";
import arrowDownActive from "../../app/images/arrowDownActive.png";
import styled from "styled-components";
import queryString from "query-string";
import UserService from "./../../app/services/UserService"
import {
    buyPlots,
    getAvailableCountryPlots,
    getChestValues,
    getFounderPlots,
    getFounderPlotsNumber,
    getPlots
} from "./plotSaleActions";
import {getUserBalance} from "../sale/saleActions";
import rockBackground from '../../app/images/rockBackground.png';
import FounderPlotsArea from "./components/FounderPlotsArea";
import PlotSaleFAQ from "./components/PlotSaleFAQ";
import { USER_REFERRER_EXIST } from '../auth/authConstants';
import {PlotSalePopup} from './components/PlotSalePopup';
import {ReferralPointsArea} from './components/ReferralPointsArea';
import { number } from 'prop-types';

const select = store => ({
    plotService: store.app.plotService,
    countryService: store.app.countryService,
    silverGoldService: store.app.silverGoldService,
    worldChestValue: store.plotSale.worldChestValue,
    monthlyChestValue: store.plotSale.monthlyChestValue,
    foundersChestValue: store.plotSale.foundersChestValue,
    web3: store.app.web3,
    currentUserId: store.auth.currentUserId,
    currentUser: store.auth.user,
    isNewUser: store.auth.newUser,
    foundersPlotsBalance: store.plotSale.foundersPlotsBalance,
    foundersPlotsContract: store.app.foundersPlotsContract,
    userBalance: store.sale.balance,
});

let plot1;
let plot2;
let plot16;
let plot31;
let plot46;

if (window.innerWidth > 800) {
    if (window.innerWidth <= 1280) {
        plot1 = require('../../app/images/plots/1plot_new_1280w.png');
        plot2 = require('../../app/images/plots/2-15_new_1280w.png');
        plot16 = require('../../app/images/plots/16-30_new_1280w.png');
        plot31 = require('../../app/images/plots/31-45_new_1280w.png');
        plot46 = require('../../app/images/plots/46-60_new_1280w.png')
    } else if (window.innerWidth <= 1920) {
        plot1 = require('../../app/images/plots/1plot_new_1920w.png');
        plot2 = require('../../app/images/plots/2-15_new_1920w.png');
        plot16 = require('../../app/images/plots/16-30_new_1920w.png');
        plot31 = require('../../app/images/plots/31-45_new_1920w.png');
        plot46 = require('../../app/images/plots/46-60_new_1920w.png')
    } else if (window.innerWidth >= 3500) {
        plot1 = require('../../app/images/plots/1plot_new_3500w.png');
        plot2 = require('../../app/images/plots/2-15_new_3500w.png');
        plot16 = require('../../app/images/plots/16-30_new_3500w.png');
        plot31 = require('../../app/images/plots/31-45_new_3500w.png');
        plot46 = require('../../app/images/plots/46-60_new_3500w.png')
    }
}


class PlotSale extends Component {

    state = {
        countryData: [],
        countryList: [],
        searchCountryList: [],
        zoom: 1,
        coordinates: [0, 20],
        countryIdHovered: 9999,
        selection: {
            name: '',
            plots: '500k',
            price: 0,
            roi: 0,
            countryId: '',
        },
        cart: [],
        mapIsShown: false,
        searchCountryValue: "",
        numberOfPlots: 20,
        plotImage: plot16,
        showPlotSaleInfoPopup: false,
        showBuyReferredPopup: false,
        showUsePointsPopup: false,
        processBuy: false
    };

    async componentDidMount() {
        const {countryService, handleGetChestValues, web3, currentUserId, handleGetFounderPlotsBalance, foundersPlotsContract, 
            handleGetUserBalance, plotService, silverGoldService, userService, currentUser, location, isNewUser } = this.props;
        if (!countryService) {
            console.log('No service')
        }
        if (countryService) {
            this.rtdbListen();
        }
        if (web3) {
            handleGetChestValues();
        }
        if (currentUserId && foundersPlotsContract) {
            handleGetFounderPlotsBalance(currentUserId);
        }
        if (currentUserId && silverGoldService && location) {
            let referrer = currentUser ? currentUser.referrer : null;
            if (!referrer) {
                let params = queryString.parse(location.search);
                if (params.refId && (await silverGoldService.ifReferrerIsValid(params.refId, currentUserId))) {
                        UserService.setReferralId(params.refId, currentUserId)
                        handleSetUserReferrer(params.refId);         
                        this.setState({referrer: params.refId});
                } 
            }
            else {
                if (await silverGoldService.ifReferrerIsValid(referrer, currentUserId)) {
                    this.setState({referrer});
                }
            }
            if (await silverGoldService.canBeReferrer(currentUserId)) {
                this.setState({canBeReferrer: true}) 
            }
            handleGetUserBalance(currentUserId);
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        const {countryService, handleGetChestValues, web3, handleGetAvailableCountryPlots, currentUserId, silverGoldService, isNewUser,
            handleGetUserBalance, handleGetFounderPlotsBalance, foundersPlotsContract, plotService, currentUser, userService, handleSetUserReferrer, location} = this.props;
        if (!countryService) {
            console.log('No service')
        }
        if (countryService !== prevProps.countryService) {
            this.rtdbListen();
        }
        if (web3 !== prevProps.web3) {
            handleGetChestValues();
        }
        if(this.props.match.params.countryId && prevState.countryList.length === 0 && this.state.countryList.length > 0) {
            const selectedCountry = this.state.countryList.find((geography) => geography.countryId === parseInt(this.props.match.params.countryId, 10));
            if(selectedCountry) this.setState({selection: selectedCountry}, async () => {
                selectedCountry.availablePlots = await handleGetAvailableCountryPlots(selectedCountry.countryId);
                this.setState({selection: selectedCountry});
            });
        }
        if (currentUserId && foundersPlotsContract && (currentUserId !== prevProps.currentUserId || foundersPlotsContract !== prevProps.foundersPlotsContract)) {
                handleGetFounderPlotsBalance(currentUserId);
        }
        if (silverGoldService && (currentUser || isNewUser) && currentUserId && location && (silverGoldService !== prevProps.silverGoldService || 
            currentUserId !== prevProps.currentUserId || location !== prevProps.location || prevProps.currentUser == null || prevProps.isNewUser !== isNewUser)) {
            let referrer = currentUser ? currentUser.referrer : null;
            if (!referrer) {
                let params = queryString.parse(location.search);
                if (params.refId && (await silverGoldService.ifReferrerIsValid(params.refId, currentUserId))) {
                        UserService.setReferralId(params.refId, currentUserId)
                        handleSetUserReferrer(params.refId);
                        this.setState({referrer: params.refId})
                }
            }
            else {
                if (await silverGoldService.ifReferrerIsValid(referrer, currentUserId)) {
                    this.setState({referrer});
                }
            }
            if (await silverGoldService.canBeReferrer(currentUserId)) {
                this.setState({canBeReferrer: true}) 
            }
            handleGetUserBalance(currentUserId);
        }
    }

    setBackgroundImage = (numberOfPlots) => {
        if(numberOfPlots >= 1 && numberOfPlots < 10) this.setState({plotImage : plot1});
        else if(numberOfPlots >= 10 && numberOfPlots < 20) this.setState({plotImage: plot2});
        else if(numberOfPlots >= 20 && numberOfPlots < 30) this.setState({plotImage: plot16});
        else if(numberOfPlots >= 30 && numberOfPlots < 40) this.setState({plotImage: plot31});
        else if(numberOfPlots >= 40) this.setState({plotImage: plot46})
    };

    rtdbListen = () => {
        const countriesMapping = {};
        rtdb.ref('/worldMap').on('value', async snap => {
            snap && this.setState({
                countryData: snap.val(),
                countryList: snap.val().objects.units.geometries
                    .filter(country => country.properties.countryId !== 200)
                    .map(country => country.properties)
            }, () => {
                this.setState({searchCountryList: this.state.countryList})
            });
        });
        //rtdb.ref('/worldMap').off();
    };

    handleCityClick = (country) => {
        this.setState({
            zoom: 2,
            coordinates: [country.east, country.north]
        });
    };

    handleReset = () => () => {
        this.setState({
            zoom: 1,
            coordinates: [0, 20]
        });
    };

    handleUsePoints = () => {
        if (this.props.userBalance && this.props.userBalance.referralPoints > 0) {
            this.setState({
                showUsePointsPopup: true
            })
        }
        else {
            this.setState({
                showPlotSaleInfoPopup: true
            })
        }
    }

    handleWantToBeReferrer = () => {
        this.setState({
            showWantToBeReferrerPopup: true
        })
    }

    handleBuyPlots = (callback) => {
        if (this.state.referrer && this.state.numberOfPlots < 5) {
            this.setState({
                showBuyReferredPopup: true
            })
        }
        else {
            this.props.handleBuy(this.state.selection.countryId, this.state.numberOfPlots, 
                this.state.selection.availablePlots ? Math.max(this.state.numberOfPlots - this.state.selection.availablePlots, 0) : this.state.numberOfPlots, 
                this.state.referrer, callback)
        }
    }

    handleShowInfo = () => {
        this.setState({
            showPlotSaleInfoPopup: true
        })
    }

    render() {
        const {countryData, zoom, coordinates, countryIdHovered, selection, processBuy,
            cart, mapIsShown, searchCountryValue, countryList, searchCountryList, numberOfPlots, 
            showUsePointsPopup, showBuyReferredPopup, showPlotSaleInfoPopup, showWantToBeReferrerPopup} = this.state;
        const {handleGetAvailableCountryPlots, handleBuy, handleGet, worldChestValue, monthlyChestValue, 
            foundersPlotsBalance, handleGetFounderPlots, foundersChestValue, userBalance, currentUserId} = this.props;

        return (
            <div data-testid="mapPage" className="plot-sale bg-off-black white w-100" style={{
                backgroundImage: 'url(' + rockBackground + ')',
                backgroundRepeat: 'repeat',
                backgroundSize: 'contain',
                position: 'relative'
            }}>
                <div style={{
                    backgroundImage: 'url(' + this.state.plotImage + ')',
                    backgroundPosition: '80% 50%',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                }}>
                    <BuyPlotsArea className="flex ais w-100 col-reverse row-ns mw9 center">
                        <BuyFormContainer>
                            <BuyForm countryData={searchCountryList}
                                     handleClick={(country) => {
                                         this.handleCityClick(country);
                                         this.setState({selection: country}, async () => {
                                             country.availablePlots = await handleGetAvailableCountryPlots(country.countryId);
                                             this.setState({selection: country});
                                         });
                                     }}
                                     selectHoveredId={(countryId) => {
                                         this.setState({countryIdHovered: countryId})
                                     }}
                                     mapIsShown={mapIsShown}
                                     toggleMap={() => {
                                         this.setState({mapIsShown: false})
                                     }}
                                     selectedCountry={this.state.selection}
                                     searchCountryValue={searchCountryValue}
                                     searchCountry={(val) => {
                                         console.log("VAL: ", val);
                                         this.setState({
                                             searchCountryValue: val,
                                             searchCountryList: val !== "" ?
                                                 countryList.filter(country => country.name.toLowerCase().startsWith(val.toLowerCase())) : countryList,
                                         })
                                     }}
                                     numberOfPlots={numberOfPlots}
                                     setNumberOfPlots={(value) => {this.setBackgroundImage(value); this.setState({numberOfPlots: value})}}
                                     handleBuy={() => {
                                        this.setState({processBuy: true}); 
                                        setTimeout(() => this.setState({processBuy: false}), 8000);
                                        this.handleBuyPlots(() => this.setState({processBuy: false}))
                                     }}
                                     buyProcessed={processBuy}
                                     referrer={this.state.referrer}
                            />
                            {!mapIsShown &&
                            <PickLocationButton content={"Pick Plot's Location"} onClick={() => {
                                this.setState({mapIsShown: true})
                            }}>
                                <PickLocationArrow src={arrowDownActive}/>
                            </PickLocationButton>
                            }
                        </BuyFormContainer>
                        <MapArea>
                            {foundersPlotsBalance && (Number(foundersPlotsBalance) > 0) ?
                            <FounderPlotsArea
                              founderPlotsBalance={Number(foundersPlotsBalance)}
                              handleGetFounderPlots={(n, callback) => {
                                      handleGetFounderPlots(n, callback)
                              }}
                            /> : ""
                            }
                            {mapIsShown &&
                            <MapContainer className="pa3">
                                {countryData && Object.keys(countryData).length > 0 ? (
                                    <Map
                                        data={{
                                            ...geoData,
                                            ...countryData,
                                        }}
                                        setSelection={() => {
                                        }}
                                        addToCart={(country) => {
                                            this.setState({selection: country}, async () => {
                                                country.availablePlots = await handleGetAvailableCountryPlots(country.countryId);
                                                this.setState({selection: country});
                                            });
                                        }}
                                        zoom={zoom}
                                        coordinates={coordinates}
                                        handleReset={this.handleReset}
                                        countryBeingHoveredOnInFilter={countryIdHovered}
                                        cart={cart}
                                        removeFromCart={() => {
                                        }}
                                    />
                                ) : (
                                    <div className="flex x h5 w-100">
                                        <Icon type="loading" theme="outlined"/>
                                    </div>
                                )}
                            </MapContainer>
                            }
                        </MapArea>
                    </BuyPlotsArea>
                </div>
                <ChestsBar worldChestValue={worldChestValue} monthlyChestValue={monthlyChestValue} foundersChestValue={foundersChestValue}/>
                <PlotSaleFAQ/>
                <ReferralPointsArea 
                    referralPoints={userBalance && userBalance.referralPoints} 
                    canBeReferrer={this.state.canBeReferrer && !this.state.referrer}
                    showInfoPopup={() => this.handleShowInfo()}
                    showUsePointsPopup={() => this.handleUsePoints()}
                    showWantToBeReferrerPopup={() => this.handleWantToBeReferrer()}
                    currentUserId={currentUserId}/>
                {showPlotSaleInfoPopup ? 
                <PlotSalePopup
                    referrer = {this.state.referrer}
                    pointsAvailable = {userBalance && userBalance.referralPoints}
                    showInfo = {true}
                    handleClosePopup = {() => this.setState({showPlotSaleInfoPopup: false})}
                /> :
                ""}
                {showBuyReferredPopup ? 
                <PlotSalePopup
                    referrer = {this.state.referrer}
                    pointsAvailable = {userBalance && userBalance.referralPoints}
                    plotsChosen = {numberOfPlots}
                    showInfo = {false}
                    usePoints = {false}
                    handleClosePopup = {() => this.setState({showBuyReferredPopup: false, processBuy: false})}
                    handleBuy={() => 
                        handleBuy(selection.countryId, numberOfPlots, 
                            selection.availablePlots ? Math.max(numberOfPlots - selection.availablePlots, 0) : numberOfPlots, 
                            this.state.referrer, () => {this.setState({processBuy: false})})
                    }
                /> :
                ""}
                {showUsePointsPopup ? 
                <PlotSalePopup
                    currentUserId={currentUserId}
                    referrer = {this.state.referrer}
                    pointsAvailable = {userBalance && userBalance.referralPoints}
                    plotsChosen = {false}
                    showInfo = {false}
                    usePoints = {true}
                    handleClosePopup = {() => this.setState({showUsePointsPopup: false})}
                    handleBuy={(count, callback) => handleGet(count, callback)}
                /> :
                ""}
                {showWantToBeReferrerPopup ?
                <PlotSalePopup
                    wantToBeReferrer={true}
                    handleClosePopup = {() => this.setState({showWantToBeReferrerPopup: false})}
                /> :
                ""}
            </div>
        );
    }
}

const actions = {
    handleGetAvailableCountryPlots: getAvailableCountryPlots,
    handleBuy: buyPlots,
    handleGet: getPlots,
    handleGetChestValues: getChestValues,
    handleGetFounderPlotsBalance: getFounderPlotsNumber,
    handleGetFounderPlots: getFounderPlots,
    handleGetUserBalance: getUserBalance,
    handleSetUserReferrer: (referrer) => dispatch => dispatch({type: USER_REFERRER_EXIST, payload: referrer})
};

export default compose(
    withRouter,
    connect(
        select,
        actions,
    ),
)(PlotSale);

const BuyPlotsArea = styled.div`
    @media(max-width: 1400px) {
        padding: 10px 10px 5px; 
        min-height: 490px
    }
    @media(min-width: 1401px) {
        padding: 25px 10px 15px; 
        min-height: 606px
    }
`;

const PickLocationButton = styled.div`
    height: 57px;
    clip-path: polygon(0% 0%,0% 51%,15% 62%,38% 62%,38% 82%,40% 100%,57% 100%,62% 90%,62% 61%,94% 61%,100% 48%,100% 0%);
    -webkit-clip-path: polygon(0% 0%,0% 51%,15% 62%,38% 62%,38% 82%,40% 100%,57% 100%,62% 90%,62% 61%,94% 61%,100% 48%,100% 0%);
    position: absolute;
    bottom: 6px;
    left: 0;
    right: 0;
    margin: auto;
    width: 200px;
    background-color: #4d5454;
    cursor: pointer;
    
    &:after {
        clip-path: polygon(0% 0%,0% 49%,15% 60%,38% 60%,39% 90%,40% 100%,58% 100%,61% 90%,61% 58%,94% 58%,100% 48%,100% 0%);
        -webkit-clip-path: polygon(0% 0%,0% 49%,15% 60%,38% 60%,39% 90%,40% 100%,58% 100%,61% 90%,61% 58%,94% 58%,100% 48%,100% 0%);
        position: absolute;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        text-align: center;
        content: "${props => props.content || ""}";
        background-color: #383F45;
        padding: 2px;
        top: 3px;
        left: 3px;
        right: 3px;
        bottom: 3px;
        color: #8C9293;
        font-size: 16px;
    }
`;

const PickLocationArrow = styled.img`
    width: 14px;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 10;
    bottom: 10px;
`;

const MapArea = styled.div`
    position: relative;
    min-height: 270px;
    width: 60%;
    @media(max-width: 800px) {
        width: 100%;
    }
`;

const MapContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    clip-path: polygon(0% 50%, 11% 8%, 22% 0%, 78% 0%, 89% 8%, 100% 50%, 89% 92%, 78% 100%, 22% 100%, 11% 92%);
    -webkit-clip-path: polygon(0% 50%, 11% 8%, 22% 0%, 78% 0%, 89% 8%, 100% 50%, 89% 92%, 78% 100%, 22% 100%, 11% 92%);
    @media(max-width: 800px) {
        display: none;
    }
    z-index: 2;
`;

const BuyFormContainer = styled.div`
    @media(max-width: 800px) {
        width: 100%;
    }
    width: 40%;
    padding-bottom: 60px;
    display: flex;
    justify-content: center;
    position: relative;
    
`;