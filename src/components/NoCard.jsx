import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Button from "antd/lib/button";

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

const NoCards = () => (
  <Card className="bg-dark-gray h5 flex x col">
    <p className="f3">You Have No Gems.</p>
    <Link to="/market">
      <Button htmlType="button" className="white bg-base bn">
        Head over to the Marketplace.
      </Button>
    </Link>
  </Card>
);

export default NoCards;
