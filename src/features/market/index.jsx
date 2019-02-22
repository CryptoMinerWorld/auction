import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {compose} from 'recompose';
import Pagination from 'antd/lib/pagination';
import {getAuctions, getImagesForGems, paginate, preLoadAuctionPage,} from './marketActions';
import Cards from './components/Card';
import SortBox from './components/SortBox';
import LoadingCard from './components/LoadingCard';
import gemKid from '../../app/images/gemKid.png';
import Filters from './components/Filters';
import GemFilters from './components/GemFilters';


require('antd/lib/pagination/style/css');
require('antd/lib/slider/style/css');

const RightAside = styled.aside`
  grid-column: 5;
`;

const Grid = styled.article`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: 20px;
`;


const CardBox = styled.section`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minMax(280px, 1fr));
  grid-column-gap: 20px;
  grid-row-gap: 20px;
`;


const Primary = styled.section`
  grid-column: 1/5;
`;

const Card = styled.aside`
  clip-path: polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%);
`;

const select = store => ({
    auctions: store.market.auctions,
    auctionsFiltered: (store.market.auctionsFiltered && store.market.auctionsFiltered.length > 0) ?
      store.market.auctionsFiltered :
      store.market.auctions,
    loading: store.market.auctions ? store.market.auctionsLoading : true,
    error: store.marketActions.error,
    totalGems: store.market.auctions && store.market.auctions.length,
    paginated: store.market.paginated ? store.market.paginated :
        (store.market.auctionsFiltered && store.market.auctionsFiltered.length > 0) ?
          store.market.auctionsFiltered.slice(store.marketActions.start, store.marketActions.end) :
          store.market.auctions.slice(store.marketActions.start, store.marketActions.end),
    pageNumber: store.marketActions.page,
    needToLoadImages: store.market.updateImages,
    dutchContract: store.app.dutchContractInstance,
    gemContractAddress: store.app.gemsContractInstance && store.app.gemsContractInstance._address,
    gemService: store.app.gemServiceInstance,
    auctionService: store.app.auctionServiceInstance,
});


class Marketplace extends React.Component {

    static defaultProps = {
        loading: true
    }

    state = {
        imagesLoadingStarted: false
    }

    componentDidMount() {

        const {auctionService, handleGetAuctions, handlePagination} = this.props;

        if (auctionService) {
            handleGetAuctions();
            handlePagination(1, 15);
        }
    }


    componentDidUpdate(prevProps) {

        console.log('PROPS: ', this.props);

        const {auctionService, handleGetAuctions, handlePagination, needToLoadImages, pageNumber, paginated, handleGetImagesForGems} = this.props;
        const {imagesLoadingStarted} = this.state;

        if (!needToLoadImages && imagesLoadingStarted) {
            this.setState({imagesLoadingStarted: false});
        }

        if (auctionService && (auctionService !== prevProps.auctionService)) {
            handleGetAuctions();
            handlePagination(1, 15);
        }

        if (!imagesLoadingStarted && auctionService && paginated && (paginated.length > 0) && (needToLoadImages || pageNumber !== prevProps.pageNumber)) {
            //console.log('GET IMAGES! 1');
            this.setState({imagesLoadingStarted: true});
            //console.log('GET IMAGES! 2');
            handleGetImagesForGems(paginated);
        }


    }


    render() {

        console.warn('RENDER PROPS: ', this.props);

        const {
            loading,
            paginated,
            handlePagination,
            pageNumber,
            totalGems,
            handlePreLoadAuctionPage,
          auctionsFiltered,
        } = this.props;

        return (
          <div className="bg-off-black white pa4 " data-testid="market-page">
              <div className="flex aic jcs ">
                  <img src={gemKid} className="h3 w-auto pr3 dn dib-ns" alt="gem auctions"/>
                  <h1 className="white f1 b o-90" data-testid="header">
                      Gem Auctions
                  </h1>
              </div>
              <Grid>
                  <Primary>
                      <SortBox/>
                      <CardBox>
                          {loading && [1, 2, 3, 4, 5, 6].map(num => <LoadingCard key={num}/>)}
                          {paginated && paginated.length > 0 ? (
                            paginated.map(auction => (
                              <Link
                                to={`/gem/${auction.id}`}
                                key={auction.id}
                                onClick={() => handlePreLoadAuctionPage(auction)}
                              >
                                  <Cards auction={auction}/>
                              </Link>
                            ))
                          ) : (
                            !loading ?
                            <Card className="bg-dark-gray h5 flex x wrap">
                                <p className="f4 tc">No Auctions Available.</p>
                            </Card> : ""
                          )}
                      </CardBox>
                      <div className="w-100 tc pv4">
                          <Pagination
                            current={pageNumber}
                            pageSize={15}
                            total={auctionsFiltered.length}
                            hideOnSinglePage
                            onChange={(page, pageSize) => {
                                window.scrollTo(0, 0);
                                handlePagination(page, pageSize);
                            }}
                          />
                      </div>
                  </Primary>

                  <RightAside className="dn dib-l">
                      <Filters/>
                      <GemFilters/>
                  </RightAside>
              </Grid>
          </div>
        )
    }
}

const actions = {
    handleGetAuctions: getAuctions,
    handlePagination: paginate,
    handlePreLoadAuctionPage: preLoadAuctionPage,
    handleGetImagesForGems: getImagesForGems,
    //handleUpdatePriceOnAllLiveAuctions: updatePriceOnAllLiveAuctions,
};

export default compose(
  connect(
    select,
    actions,
  )
)(Marketplace);

Marketplace.propTypes = {
    paginated: PropTypes.arrayOf(PropTypes.object).isRequired,
    handlePagination: PropTypes.func.isRequired,
    pageNumber: PropTypes.number,
    totalGems: PropTypes.number.isRequired,
    handlePreLoadAuctionPage: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
};

Marketplace.defaultProps = {
    pageNumber: 1,
};
