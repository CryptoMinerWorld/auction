import React from 'react';
import styled from 'styled-components';
import Loading from '../../../components/Loading';

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

const LoadingCards = () => (
  <Card className="bg-dark-gray">
    <Loading />
  </Card>
);

export default LoadingCards;
