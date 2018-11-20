import gql from 'graphql-tag';

export const BUY_NOW_MUTATION = gql`
  mutation BUY_NOW_MUTATION(
    $id: String!
    $newOwnerId: String!
    $price: Float!

    $timeOfPurchase: Float!
    $totalPlots: Int!
  ) {
    buyCountry(
      id: $id
      newOwnerId: $newOwnerId
      price: $price
      timeOfPurchase: $timeOfPurchase
      totalPlots: $totalPlots
    ) {
      name
    }
  }
`;

export const GIFT_COUNTRY_MUTATION = gql`
  mutation GIFT_COUNTRY_MUTATION(
    $id: String!
    $newOwnerId: String!
    $gift: Boolean!
    $timeOfGifting: Float!
  ) {
    giftCountry(id: $id, newOwnerId: $newOwnerId, gift: $gift, timeOfGifting: $timeOfGifting) {
      name
    }
  }
`;

export const RESELL_COUNTRY_MUTATION = gql`
  mutation RESELL_COUNTRY_MUTATION($id: String!, $newOwnerId: String!, $newPrice: Float!) {
    sellCountry(id: $id, newOwnerId: $newOwnerId, newPrice: $newPrice) {
      name
    }
  }
`;

export const REMOVE_COUNTRY_FROM_AUCTION_MUTATION = gql`
  mutation REMOVE_COUNTRY_FROM_AUCTION_MUTATION($id: String!, $newOwnerId: String!) {
    removeCountryFromAuction(id: $id, newOwnerId: $newOwnerId) {
      name
    }
  }
`;
