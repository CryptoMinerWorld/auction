import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getAuctions } from "./marketActions";
import Cards from "../../components/Card";
import SortBox from "./components/SortBox";
import Filters from "./components/Filters";
import LoadingCard from "../../components/LoadingCard";
import gemKid from "../../app/images/gemKid.png";

require("antd/lib/slider/style/css");

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
  grid-column-start: span 4;
  width: 100%;
`;

const Aside = styled.aside`
  grid-column: 5/5;
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
  error: store.marketActions.error
});

const Marketplace = ({ auctions, loading }) => (
  <div className="bg-off-black white pa4">
    {/* <AuctionCategories /> */}
    <div className="flex aic mt3">
      <img src={gemKid} className="h3 w-auto pr3 dib" alt="gem auctions" />
      <h1 className="white f1 b o-90" data-testid="header">
        Gem Auctions
      </h1>
    </div>
    <Grid>
      <Primary>
        <SortBox />
        <CardBox>
          {loading && [1, 2, 3, 4, 5, 6].map(num => <LoadingCard key={num} />)}
          {auctions && auctions.length > 0 ? (
            auctions.map(auction => (
              <Link to={`/gem/${auction.id}`} key={auction.id}>
                <Cards auction={auction} />
              </Link>
            ))
          ) : (
            <Card className="bg-dark-gray h5 flex x wrap">
              <p className="f4">No Active Auctions Right Now.</p>
            </Card>
          )}
        </CardBox>
        {/* <p>pagination</p> */}
      </Primary>
      <Aside>
        <Filters />
      </Aside>
    </Grid>
  </div>
);

const actions = {
  handleGetAuctions: getAuctions
};

export default connect(
  select,
  actions
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
