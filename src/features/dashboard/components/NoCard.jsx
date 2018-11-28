import React from 'react';
// import styled from 'styled-components';

// const Card = styled.aside`
//   clip-path: polygon(
//     5% 0%,
//     95% 0%,
//     100% 5%,
//     100% 95%,
//     95% 100%,
//     5% 100%,
//     0% 95%,
//     0% 5%
//   );
// `;

const NoCards = () => (
  <div
    className="bg-dark-gray h5 flex x col"
    style={{
      WebkitClipPath:
        'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)',
      clipPath:
        'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)',
    }}
  >
    <p className="f3">No Gems.</p>
  </div>
);

export default NoCards;
