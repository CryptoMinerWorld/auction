import React from 'react';
import styled from 'styled-components';

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
    <p className="f3">No Gems.</p>
  </Card>
);

export default NoCards;
