import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import Icon from 'antd/lib/icon';
import {db, rtdb} from '../../app/utils/firebase';
import Map from './components/Map';
import geoData from '../../app/maps/world-50m-with-population.json';
// import countryDatum from './components/countryData';
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import ChestsBar from "./components/ChestsBar";
import BuyForm from "./components/BuyForm";
import arrowDownActive from "../../app/images/arrowDownActive.png";
import styled from "styled-components";
import {
    buyPlots,
    getAvailableCountryPlots,
    getChestValues,
    getFounderPlots,
    getFounderPlotsNumber
} from "./plotSaleActions";
import rockBackground from '../../app/images/rockBackground.png';
import FounderPlotsArea from "./components/FounderPlotsArea";

const select = store => ({
    plotService: store.app.plotServiceInstance,
    countryService: store.app.countryServiceInstance,
    worldChestValue: store.plotSale.worldChestValue,
    monthlyChestValue: store.plotSale.monthlyChestValue,
    foundersChestValue: store.plotSale.foundersChestValue,
    web3: store.app.web3,
    currentUserId: store.auth.currentUserId,
    foundersPlotsBalance: store.plotSale.foundersPlotsBalance,
    foundersPlotsContract: store.app.foundersPlotsContract,
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
    };

    async componentDidMount() {
        const {countryService, handleGetChestValues, web3, currentUserId, handleGetFounderPlotsBalance, foundersPlotsContract, plotService} = this.props;
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
    }

    async componentDidUpdate(prevProps, prevState) {
        const {countryService, handleGetChestValues, web3, handleGetAvailableCountryPlots, currentUserId, handleGetFounderPlotsBalance, foundersPlotsContract, plotService} = this.props;
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

    render() {

        const {countryData, zoom, coordinates, countryIdHovered, selection, cart, mapIsShown, searchCountryValue, countryList, searchCountryList, numberOfPlots} = this.state;
        const {handleGetAvailableCountryPlots, handleBuy, worldChestValue, monthlyChestValue, foundersPlotsBalance, handleGetFounderPlots, foundersChestValue} = this.props;

        return (
            <div data-testid="mapPage" className="plot-sale bg-off-black white w-100" style={{
                backgroundImage: 'url(' + rockBackground + ')',
                backgroundRepeat: 'repeat',
                backgroundSize: 'contain',
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
                                     handleBuy={(callBack) => {
                                         if ((Date.now() >= 1550772000 * 1000)) {
                                           handleBuy(selection.countryId, numberOfPlots, selection.availablePlots ? Math.max(numberOfPlots - selection.availablePlots, 0) : numberOfPlots, null, callBack)
                                         }}}
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
                            {foundersPlotsBalance && (foundersPlotsBalance > 0) ?
                            <FounderPlotsArea
                              founderPlotsBalance={foundersPlotsBalance}
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
            </div>

        );
    }
}

const actions = {

    handleGetAvailableCountryPlots: getAvailableCountryPlots,
    handleBuy: buyPlots,
    handleGetChestValues: getChestValues,
    handleGetFounderPlotsBalance: getFounderPlotsNumber,
    handleGetFounderPlots: getFounderPlots,
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