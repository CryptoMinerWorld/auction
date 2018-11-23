import gql from 'graphql-tag';

export const MAP_COUNTRY_DATA = gql`
  query MAP_COUNTRY_DATA {
    mapCountries {
      name
      countryId
      plots
      price
      roi
      north
      east
      mapIndex
      imageLinkLarge
      imageLinkMedium
      imageLinkSmall
      sold
    }
  }
`;

export const USER_COUNTRIES = gql`
  query USER_COUNTRIES($id: String!) {
    user(id: $id) {
      countries {
        name
        lastBought
        lastPrice
        roi
        totalPlots
        plotsBought
        plotsMined
        plotsAvailable
        imageLinkLarge
        imageLinkMedium
        imageLinkSmall
        roi
        countryId
        mapIndex
        onSale
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
