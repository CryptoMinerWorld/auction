import gql from 'graphql-tag';

export const TEMP = () => console.log('keep this here to prevent having to export default');

export const BUY_NOW_MUTATION = gql`
  mutation BUY_NOW_MUTATION(
    $id: String!
    $newOwnerId: String!
    $price: Float!
    $timeOfPurchase: Float!
    $totalPlots: Int!
    $imageLinkLarge: String!
    $imageLinkMedium: String!
    $imageLinkSmall: String!
    $countryId: Int!
    $mapIndex: Int!
    $roi: Float!
  ) {
    buyCountry(
      id: $id
      newOwnerId: $newOwnerId
      price: $price
      timeOfPurchase: $timeOfPurchase
      totalPlots: $totalPlots
      imageLinkLarge: $imageLinkLarge
      imageLinkMedium: $imageLinkMedium
      imageLinkSmall: $imageLinkSmall
      countryId: $countryId
      mapIndex: $mapIndex
      roi: $roi
    ) {
      name
    }
  }
`;
