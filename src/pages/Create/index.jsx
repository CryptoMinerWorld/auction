import React from "react";
import styled from "styled-components";
import rockBackground from "../../images/rockBackground.png";
import Mint from "./Mint";

require("antd/lib/button/style/css");
require("antd/lib/input/style/css");

const RockOverlay = styled.div`
  background-image: url(${rockBackground});
  background-repeat: repeat;
  background-size: contain;
`;

const CreateAuction = () => (
  <div className="bg-off-black">
    <RockOverlay>
      <Mint />
    </RockOverlay>
  </div>
);

export default CreateAuction;
