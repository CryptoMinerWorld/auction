import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import amethyst from "../../app/images/amethystImage.png";
import { getAuctions } from "./marketActions";
import Cards from "./components/Card";
import SortBox from "./components/SortBox";
import Filters from "./components/Filters";

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

const select = store => ({
  auctions: store.market
});

const Marketplace = ({ auctions }) => (
  <div className="bg-off-black white pa4">
    {/* <AuctionCategories /> */}
    <div className="flex aic mt3">
      <img src={amethyst} className="h3 w-auto pr3 dib" alt="gem auctions" />
      <h1 className="white" data-testid="header">
        Gem Auctions
      </h1>
    </div>
    <Grid>
      <Primary>
        <SortBox />
        <CardBox>
          {auctions &&
            auctions.map(auction => (
              <Link to={`/gem/${auction.id}`} key={auction.id}>
                <Cards auction={auction} />
              </Link>
            ))}
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
      id: PropTypes.string,
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
  ).isRequired
};
