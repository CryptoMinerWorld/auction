import gql from 'graphql-tag';

export const temp = [];

export const BUY_NOW_MUTATION = gql`
mutation BUY_NOW_MUTATION (
  $id: String!
  $newOwnerId: String!
  $price: Int!
  $timeOfPurchase: Float!

)
{
  buyCountry(
    id: $id
    newOwnerId: $newOwnerId
    price: $price
    timeOfPurchase: $timeOfPurchase
  ) {
    name
  }
}`;
