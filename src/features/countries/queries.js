import gql from 'graphql-tag';

export const USERNAME_QUERY = gql`
{
  user(id: "0xd9b74f73d933fde459766f74400971b29b90c9d2") {
    name
  }
}
`;

export const TEMP = [];
