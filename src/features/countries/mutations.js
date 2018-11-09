import gql from 'graphql-tag';

export const BUY_NOW_MUTATION = gql`
  mutation BUY_NOW_MUTATION(
    $id: String!
    $newOwnerId: String!
    $price: Int!
    $gift: Boolean!
    $timeOfPurchase: Float!
    $totalPlots: Int!
  ) {
    buyCountry(
      id: $id
      newOwnerId: $newOwnerId
      price: $price
      gift: $gift
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
    giftCountry(
      id: $id, 
      newOwnerId: $newOwnerId, 
      gift: $gift, 
      timeOfGifting: $timeOfGifting) {
      name
    }
  }
`;
