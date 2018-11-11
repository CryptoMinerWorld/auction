import React, { useState } from 'react';
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
import Button from 'antd/lib/button';
import { BUY_NOW_MUTATION } from '../mutations';
// import { ethToWei } from '../helpers';

require('antd/lib/table/style/css');

const Cart = ({
  picked,
  removeFromCart,
  history,
  loading,
  error,
  data,
  buyNow,
  countrySale,
  markSold,
}) => {
  const [txloading, setLoading] = useState(false);

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
            {/* <p>current price</p> */}

            <div className="mt4">
              {/* <p>{data.userId}</p> */}

              <Button
                type="button"
                data-testid="buyNow"
                loading={txloading}
                onClick={async () => {
                  try {
                    setLoading(true);

                    console.log('countrySale', countrySale);
                    console.log('data.userId ', data.userId);
                    console.log('history', history);
                    console.log('picked', picked);
                    console.log('country id', picked[0].id, typeof picked[0].id);
                    // console.log('country price', picked[0].price, ethToWei(picked[0].price));
                    console.log('country map index', picked[0].mapIndex);

                    const countries = picked.map(country => country.id);
                    console.log('countries', countries);

                    // const currentPrice = await countrySale.methods.getPrice(picked[0].id).call();

                    // const totalPrice = await countries.reduce(async (total, countryId) => {
                    //   const price = await countrySale.methods.getPrice(countryId).call();
                    //   return total + price;
                    // }, Promise.resolve());

                    // async function printFiles() {
                    //   const files = await getFilePaths();

                    const allPrices = await Promise.all(
                      countries.map(countryId => countrySale.methods.getPrice(countryId).call()),
                    );

                    console.log('allPrices', allPrices);

                    const totalPrice = allPrices
                      .map(value => Number(value))
                      .reduce((total, price) => total + price);

                    console.log('totalPrice', totalPrice);

                    // blockchain
                    await countrySale.methods.bulkBuy(countries).send(
                      {
                        value: totalPrice,
                      },

                      async (err, txHash) => {
                        if (err) {
                          console.log('error buying a single country', err);
                          return;
                        }
                        console.log('txHash received', txHash);

                        // for each country
                        // this will probably be more efficient as a batched transaction https://firebase.google.com/docs/firestore/manage-data/transactions
                        await picked.forEach(async (country) => {
                          await buyNow({
                            variables: {
                              id: country.country,
                              newOwnerId: data.userId,
                              price: 56,
                              gift: false,
                              timeOfPurchase: 1541129757489,
                              totalPlots: 32,

                              // name,
                              // lastBought,
                              // description,
                              // totalPlots,
                              // plotsBought,
                              // plotsMined,
                              // plotsAvailable,
                              // image,
                              // lastPrice,
                              // roi,
                            },
                          });
                          await markSold(country.mapIndex);
                        });

                        console.log('db updated');
                        setLoading(false);
                        history.push(`/profile/${data.userId}`);
                      },
                    );

                    // .then(async (receipt) => {
                    //   console.log('recipt received', receipt);
                    //   await buyNow();
                    //   console.log('db updated');
                    //   await markSold(picked[0].mapIndex);
                    //   console.log('marked sold');
                    //   setLoading(false);
                    //   history.push(`/profile/${data.userId}`);
                    // })
                    // .catch(err => console.log('error buying a singel country', err));

                    // .on('transactionHash', (hash) => {
                    //   console.log('hash', hash);
                    // })
                    // .on('confirmation', (confirmationNumber, receipt) => {
                    //   console.log('confirmationNumber, receipt', confirmationNumber, receipt);
                    // })
                    // .on('receipt', (receipt) => {
                    //   // db write
                    //   console.log('recipt received', receipt);
                    // })
                    // .on('error', console.error);

                    // db

                    //  handleBuyNow(picked, history, '0xd9b74f73d933fde459766f74400971b29b90c9d2');

                    // const handleBuyNow = (selection, history, userId) =>
                  } catch (err) {
                    console.log('error buying a country', err);
                    setLoading(false);
                  }
                }}
              >
                buy now
              </Button>
            </div>

            {/* <p>timer</p> */}
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
      // console.log('props.picked[0].country', props.picked[0].country);
      // console.log('data.userId', data.userId);

      <Mutation mutation={BUY_NOW_MUTATION}>
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
  markSold: PropTypes.func.isRequired,
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
