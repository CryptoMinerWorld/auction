import React from 'react';
// import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
// import { Mutation } from 'react-apollo';
import Table from 'antd/lib/table';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BUY_NOW_MUTATION } from '../mutations';

require('antd/lib/table/style/css');

const Cart = ({
  picked, removeFromCart, history, loading, error, data, buyNow, countrySale,
}) => {
  if (loading) {
    return <p data-testid="cartLoading">Loading...</p>;
  }
  if (error) {
    return <p data-testid="cartLoading">Error :(</p>;
  }
  return (
    <div data-testid="cartComponent">
      <div className="flex">
        <div className="w-third">
          <div className="flex col aic jcc">
            <p>current price</p>
            return (
            <div>
              <p>{data.userId}</p>

              <button
                type="button"
                data-testid="buyNow"
                onClick={async () => {
                  try {
                    console.log('userId', data.userId);
                    console.log('countrySale', countrySale);


                    // blockchain
                    await countrySale.methods
                      .buy(7)
                      .send({
                        value: 5381333333000000000,
                      })
                      .on('receipt', (receipt) => {
                        // receipt example
                        console.log(receipt);
                      })
                      .on('error', console.error);
                    // db
                    await buyNow();

                    //  handleBuyNow(picked, history, '0xd9b74f73d933fde459766f74400971b29b90c9d2');

                    // const handleBuyNow = (selection, history, userId) =>
                    history.push(`/profile/${data.userId}`);
                  } catch (err) {
                    console.log('error buying a country', err);
                  }
                }}
              >
                buy now
              </button>
            </div>
            );
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
};

const EnhancedCart = props => (
  <Query
    query={gql`
      {
        userId @client
      }
    `}
  >
    {({ loading, data, error }) => (
      <Mutation
        mutation={BUY_NOW_MUTATION}
        variables={{
          id: props.picked && props.picked[0].country,
          newOwnerId: data.userId,
          price: 56,
          gift: false,
          timeOfPurchase: 1541129757489,
        }}
      >
        {buyNow => <Cart {...props} loading={loading} data={data} error={error} buyNow={buyNow} />}
      </Mutation>
    )}
  </Query>
);

const selection = store => ({
  countrySale: store.app.countrySaleInstance,
});

export default compose(
  connect(selection),
  withRouter,
)(EnhancedCart);

Cart.propTypes = {
  removeFromCart: PropTypes.func.isRequired,
  picked: PropTypes.arrayOf(PropTypes.shape({})),
  countrySale: PropTypes.shape({}),
  history: ReactRouterPropTypes.history.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  data: PropTypes.shape({}).isRequired,
  buyNow: PropTypes.func.isRequired,
};

Cart.defaultProps = {
  picked: [{}],
  error: '',
  countrySale: {},
};
