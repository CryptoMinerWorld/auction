import React from "react";
import styled from "styled-components";
import Slider from "antd/lib/slider";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import amethyst from "../../images/amethystImage.png";
import { getAuctions } from "./marketActions";
import { Cards } from "./Card";

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
    <AuctionCategories />
    <div className="flex aic mt3">
      <img src={amethyst} className="h3 w-auto pr3 dib" alt="gem auctions" />
      <h1 className="white" data-testid="header">
        gem auctions
      </h1>
    </div>
    <Grid>
      <Primary>
        <div className="flex pv4">
          <p className="ttu pr4">finishing soonest</p>
          <p className="ttu pr4">lowest price</p>
          <p className="ttu pr4">highest price</p>
        </div>
        <CardBox>
          {auctions &&
            auctions.map(auction => (
              <Link to={`/auction/${auction.id}`} key={auction.id}>
                <Cards auction={auction} />
              </Link>
            ))}
        </CardBox>
        <p>pagination</p>
      </Primary>
      <Aside>
        <p className="ttu pv4">hide filters</p>
        <div>
          <div className="ba pa3 mv4">
            <p>filter 1</p>
            <Slider range defaultValue={[20, 50]} />
          </div>
          <div className="ba pa3 mv4">
            <p>filter 2</p>
            <Slider range defaultValue={[20, 50]} />
          </div>
          <div className="ba pa3 mv4">
            <p>filter 3</p>
            <Slider range defaultValue={[20, 50]} />
          </div>
          <div className="ba pa3 mv4">
            <p>filter 4</p>
            <Slider range defaultValue={[20, 50]} />
          </div>
        </div>
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
  ).isRequired
};

const AuctionCategories = () => (
  <div className="flex jcb ba pa2 mb4">
    <div className="flex br w-auto">
      <img src={amethyst} alt="" className="h2" />
      <p>GEMS</p>
    </div>

    <div className="flex br w-auto">
      <img src={amethyst} alt="" className="h2" />
      <p>GEMS</p>
    </div>

    <div className="flex br w-auto">
      <img src={amethyst} alt="" className="h2" />
      <p>GEMS</p>
    </div>

    <div className="flex br w-auto">
      <img src={amethyst} alt="" className="h2" />
      <p>GEMS</p>
    </div>

    <div className="flex br w-auto">
      <img src={amethyst} alt="" className="h2" />
      <p>GEMS</p>
    </div>

    <div className="flex w-auto">
      <img src={amethyst} alt="" className="h2" />
      <p>GEMS</p>
    </div>
  </div>
);
