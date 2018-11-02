import React from 'react';
// import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Table from 'antd/lib/table';
import PropTypes from 'prop-types';
import { BUY_NOW_MUTATION } from '../mutations';

require('antd/lib/table/style/css');

const Cart = ({ picked, removeFromCart, handleBuyNow }) => (
  <div data-testid="cartComponent">
    <div className="flex">
      <div className="w-third">
        <div className="flex col aic jcc">
          <p>current price</p>

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
              if (loading) return <p data-testid="cartLoading">Loading...</p>;
              if (error) return <p data-testid="cartLoading">Error :(</p>;

              return <p>{data.user.name}</p>;
            }}
          </Query>
          <Mutation
            mutation={BUY_NOW_MUTATION}
            variables={{
              id: 'dlQkxRkaEvJkazkXY3qZ',
              newOwnerId: 'as45',
              price: 56,
              timeOfPurchase: 1541129757489,
            }}
          >
            {buyNow => (
              <button
                type="button"
                data-testid="buyNow"
                onClick={async () => {
                  const res = await buyNow();
                  console.log('res', res);
                  handleBuyNow(picked);
                }}
              >
                buy now
              </button>
            )}
          </Mutation>

          <p>timer</p>
        </div>
      </div>
      <div className="w-two-thirds">
        <Table
          columns={[
            {
              title: 'Country',
              dataIndex: 'country',
              key: 'country',
            },
            {
              title: 'Plots',
              dataIndex: 'plots',
              key: 'plots',
            },
            {
              title: 'Price',
              dataIndex: 'price',
              key: 'price',
            },
            {
              title: 'Min Roi',
              dataIndex: 'roi',
              key: 'roi',
            },
            {
              title: 'Return',
              dataIndex: 'return',
              key: 'return',
            },
            {
              title: 'Remove',
              key: 'action',
              render: x => (
                <button
                  type="button"
                  onClick={() => removeFromCart(x)}
                  data-testid={`remove-${x.country}`}
                >
                  Remove
                </button>
              ),
            },
          ]}
          dataSource={picked}
        />
      </div>
    </div>
  </div>
);

export default Cart;

Cart.propTypes = {
  removeFromCart: PropTypes.func.isRequired,
  picked: PropTypes.shape([]).isRequired,
  handleBuyNow: PropTypes.func.isRequired,
};
