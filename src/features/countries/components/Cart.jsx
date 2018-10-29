import React from 'react';
// import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const Cart = () => (
  <div>
    <p>cart</p>
    <Query
      query={gql`
        {
          user(id: "0xd9b74f73d933fde459766f74400971b29b90c9d2") {
            name
          }
        }
      `}
    >
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;

        return (
          <div>
            <p>{`${data.user.name}`}</p>
          </div>
        );
      }}
    </Query>
  </div>
);

export default Cart;
