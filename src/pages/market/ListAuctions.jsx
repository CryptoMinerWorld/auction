import React from "react";
import styled from "styled-components";
import Slider from "antd/lib/slider";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import amethyst from "../../images/amethystImage.png";
import { getAuctions } from "./marketActions";

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
              <Cards auction={auction} key={auction.id} />
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

const Card = styled.aside`
  grid-column: span 1;
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

const ProgressDivider = styled.progress`
  appearance: none;
  width: 100%;
  height: 5px;
  margin: 0;
  padding: 0;
  &:-webkit-progress-value {
    color: red;
  }
  &:-moz-progress-bar {
    color: red;
  }
`;

const Cards = ({ auction }) => (
  <Card className="bg-dark-gray shadow-3">
    <figure className="ma0 pa0">
      <img src={auction.image} alt="gem" className="ma0 pa3 pb0" />
      <figcaption hidden>{auction.quality}</figcaption>
    </figure>
    <ProgressDivider value="22" max="100" />
    <div className="flex jcb ph3">
      <small>{auction.minPrice}</small> <small>{auction.maxPrice}</small>
    </div>
    <div className="tc">
      <big className="db b">{auction.price}</big>
      <small>Auction ends on {auction.deadline.seconds}</small>
    </div>
    <hr />
    <div className="flex pa3 pb0">
      <img src={auction.image} alt="" className="h3" />
      <div className="pl3 ma0 pa0">
        <p>by {auction.owner}</p>
        <div>
          <p>{auction.grade}</p>
          <p>{auction.quality}</p>
          <p>{auction.rate}</p>
        </div>
      </div>
    </div>
  </Card>
);

Cards.propTypes = {
  auction: PropTypes.shape({
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
  }).isRequired
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
