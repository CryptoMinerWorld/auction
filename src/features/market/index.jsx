import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { lifecycle, compose } from 'recompose';
import { getAuctions, paginate } from './marketActions';
import Cards from './components/Card';
import SortBox from './components/SortBox';
import LoadingCard from './components/LoadingCard';
import gemKid from '../../app/images/gemKid.png';
import Filters from './components/Filters';
import GemFilters from './components/GemFilters';
import Pagination from 'antd/lib/pagination';
require('antd/lib/pagination/style/css');
require('antd/lib/slider/style/css');

const LeftAside = styled.aside`
  grid-column: 1;
`;

const RightAside = styled.aside`
  grid-column: 5;
`;

const Grid = styled.article`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-column-gap: 20px;
`;

const CardBox = styled.section`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
`;

const Primary = styled.section`
  grid-column: 2/5;
`;

const Card = styled.aside`
  clip-path: polygon(
    5% 0%,
    95% 0%,
    100% 5%,
    100% 95%,
    95% 100%,
    5% 100%,
    0% 95%,
    0% 5%
  );
`;

const select = store => ({
  auctions: store.market,
  loading: store.marketActions.loading,
  error: store.marketActions.error,
  totalGems: store.market.length,
  paginated: [
    ...store.market.slice(store.marketActions.start, store.marketActions.end)
  ],
  pageNumber: store.marketActions.page
});

const Marketplace = ({
  auctions,
  loading,
  paginated,
  handlePagination,
  pageNumber,
  totalGems
}) => (
  <div className="bg-off-black white pa4">
    <div className="flex aic jcc ">
      <img src={gemKid} className="h3 w-auto pr3 dib" alt="gem auctions" />
      <h1 className="white f1 b o-90" data-testid="header">
        Gem Auctions
      </h1>
    </div>
    <Grid>
      <LeftAside>
        <GemFilters />
      </LeftAside>
      <Primary>
        <SortBox />
        <CardBox>
          {loading && [1, 2, 3, 4, 5, 6].map(num => <LoadingCard key={num} />)}
          {paginated && paginated.length > 0 ? (
            paginated.map(auction => (
              <Link to={`/gem/${auction.id}`} key={auction.id}>
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
            pageSize={6}
            total={totalGems}
            hideOnSinglePage
            onChange={(page, pageSize) => handlePagination(page, pageSize)}
          />
        </div>
      </Primary>
      <RightAside>
        <Filters />
      </RightAside>
    </Grid>
  </div>
);

const actions = {
  handleGetAuctions: getAuctions,
  handlePagination: paginate
};

export default compose(
  connect(
    select,
    actions
  ),
  lifecycle({
    componentDidMount() {
      this.props.handlePagination(1, 6);
    }
  })
)(Marketplace);

Marketplace.propTypes = {
  auctions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      minPrice: PropTypes.number,
      maxPrice: PropTypes.number,
      price: PropTypes.number,
      deadline: PropTypes.oneOfType([
        PropTypes.shape({
          seconds: PropTypes.number.isRequired
        }).isRequired,
        PropTypes.number
      ]).isRequired,
      image: PropTypes.string,
      owner: PropTypes.string,
      grade: PropTypes.number,
      quality: PropTypes.number,
      rate: PropTypes.number
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired
};
