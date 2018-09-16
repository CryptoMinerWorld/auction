import React from "react";
import styled from "styled-components";
import { Slider } from "antd";
import amethyst from "../../images/amethystImage.png";

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

const ListAuctions = () => (
  <div className="bg-off-black white pa4">
    <AuctionCategories />
    <div className="flex aic mt3">
      <img src={amethyst} className="h3 w-auto pr3 dib" alt="gem auctions" />
      <h1 className="white">gem auctions</h1>
    </div>

    <Grid>
      <Primary>
        <div className="flex pv4">
          <p className="ttu pr4">finishing soonest</p>
          <p className="ttu pr4">lowest price</p>
          <p className="ttu pr4">highest price</p>
        </div>
        <CardBox>
          <Cards />
          <Cards />
          <Cards />
          <Cards />
          <Cards />
          <Cards />
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

export default ListAuctions;

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

const Cards = () => (
  <Card className="bg-dark-gray shadow-3">
    <figure className="ma0 pa0">
      <img src={amethyst} alt="gem" className="ma0 pa3 pb0" />
      <figcaption hidden>Amethyst Gem</figcaption>
    </figure>
    <ProgressDivider value="22" max="100" />
    <div className="flex jcb ph3">
      <small>3</small> <small>1</small>
    </div>
    <div className="tc">
      <big className="db b">3.445</big>
      <small>Auction ends on {`sometime`}</small>
    </div>
    <hr />
    <div className="flex pa3 pb0">
      <img src={amethyst} alt="" className="h3" />
      <div className="pl3 ma0 pa0">
        <p>by Cryptominers World</p>
        <p>gems</p>
      </div>
    </div>
  </Card>
);

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
