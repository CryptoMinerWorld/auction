import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { lifecycle, compose } from 'recompose';
import Pagination from 'antd/lib/pagination';
import {
  getAuctions, paginate, preLoadAuctionPage, updatePriceOnAllLiveAuctions,
} from './marketActions';
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
  auctions: store.market,
  loading: store.marketActions.loading,
  error: store.marketActions.error,
  totalGems: store.market.length,
  paginated: [...store.market.slice(store.marketActions.start, store.marketActions.end)],
  pageNumber: store.marketActions.page,
  dutchContract: store.app.dutchContractInstance,
  gemContractAddress: store.app.gemsContractInstance
  // eslint-disable-next-line
  && store.app.gemsContractInstance._address,
});

const Marketplace = ({
  loading,
  paginated,
  handlePagination,
  pageNumber,
  totalGems,
  handlePreLoadAuctionPage,
}) => (
  <div className="bg-off-black white pa4 " data-testid="market-page">
    <div className="flex aic jcs ">
      <img src={gemKid} className="h3 w-auto pr3 dn dib-ns" alt="gem auctions" />
      <h1 className="white f1 b o-90" data-testid="header">
        Gem Auctions
      </h1>
    </div>
    <Grid>
      <Primary>
        <SortBox />
        <CardBox>
          {loading && [1, 2, 3, 4, 5, 6].map(num => <LoadingCard key={num} />)}
          {paginated && paginated.length > 0 ? (
            paginated.map(auction => (
              <Link
                to={`/gem/${auction.id}`}
                key={auction.id}
                onClick={() => handlePreLoadAuctionPage(auction)}
              >
                <Cards auction={auction} />
              </Link>
            ))
          ) : (
            <Card className="bg-dark-gray h5 flex x wrap">
              <p className="f4 tc">No Auctions Available.</p>
            </Card>
          )}
        </CardBox>
        <div className="w-100 tc pv4">
          <Pagination
            current={pageNumber}
            pageSize={15}
            total={totalGems}
            hideOnSinglePage
            onChange={(page, pageSize) => {
              window.scrollTo(0, 0);
              handlePagination(page, pageSize);
            }}
          />
        </div>
      </Primary>

      <RightAside className="dn dib-l">
        <Filters />
        <GemFilters />
      </RightAside>
    </Grid>
  </div>
);

const actions = {
  handleGetAuctions: getAuctions,
  handlePagination: paginate,
  handlePreLoadAuctionPage: preLoadAuctionPage,
  handleUpdatePriceOnAllLiveAuctions: updatePriceOnAllLiveAuctions,
};

export default compose(
  connect(
    select,
    actions,
  ),
  lifecycle({
    componentDidMount() {
      this.props.handleGetAuctions();
      this.props.handlePagination(1, 15);
      this.props.handleUpdatePriceOnAllLiveAuctions(
        this.props.dutchContract,
        this.props.gemContractAddress,
      );
    },
  }),
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
