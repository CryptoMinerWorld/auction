import gql from 'graphql-tag';

export const USERNAME_QUERY = gql`
  {
    user(id: "0xd9b74f73d933fde459766f74400971b29b90c9d2") {
      name
    }
  }
`;

export const USER_COUNTRIES = gql`
  query USER_COUNTRIES($id: String!) {
    user(id: $id) {
      countries {
        name
        lastBought
        description
        totalPlots
        plotsBought
        plotsMined
        plotsAvailable
        image
        lastPrice
        roi
      }
    }
  }
`;

export const ALL_COUNTRIES = gql`
  query ALL_COUNTRIES {
    countries {
      name
      totalPlots
      lastPrice
      id
      countryId
      mapIndex
    }
  }
`;
