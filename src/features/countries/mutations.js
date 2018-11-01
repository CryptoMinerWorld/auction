import gql from 'graphql-tag';


export const BUY_NOW_MUTATION = () => gql`
{
  user(id, country) {
    name
  }
}
`;

