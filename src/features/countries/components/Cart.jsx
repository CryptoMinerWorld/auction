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
import { setError } from '../../../app/appActions';

require('antd/lib/table/style/css');

const Cart = ({
  picked,
  removeFromCart,
  history,
  data,
  buyNow,
  markSold,
  countrySale,
  handleSetError,
  price,
}) => {
  const [txloading, setLoading] = useState(false);

  return (
    <div className="flex row-ns flex-column-reverse mw9 center">
      <div className="w-third-ns w-100 flex col aic jcc pa4">
        <div className="flex col aic jcc f2">
          <p>Current Price</p>
          <span className="f2">
            <span className="basic ">Ξ</span>
            {price}
          </span>

          <div className=" flex row aic jcc">
            <Button
              type="button"
              data-testid="buyNow"
              loading={txloading}
              onClick={async () => {
                // console.log('click...');
                try {
                  setLoading(true);
                  const countries = picked.map(country => country.countryId);
                  const allPrices = await Promise.all(
                    countries.map(countryId => countrySale.methods.getPrice(countryId).call()),
                  );
                  const totalPrice = allPrices
                    .map(value => Number(value))
                    .reduce((total, pricex) => total + pricex);
                  // console.log('totalPrice', totalPrice);
                  // console.log('countrySale', countrySale);
                  // console.log('userId', data.userId);
                  // console.log('countries', countries);
                  // blockchain
                  await countrySale.methods.bulkBuy(countries).send(
                    {
                      value: totalPrice,
                    },
                    async (err) => {
                      if (err) {
                        // console.log('error buying a single country', err);
                        handleSetError(err, 'Error buying a country');
                        return;
                      }
                      // console.log('txHash received', txHash);
                      // for each country
                      // this will probably be more efficient as a batched transaction https://firebase.google.com/docs/firestore/manage-data/transactions
                      await picked.forEach(async (country) => {
                        await buyNow({
                          variables: {
                            id: country.name,
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
                      // console.log('db updated');
                      setLoading(false);
                      history.push(`/profile/${data.userId}`);
                    },
                  );
                } catch (err) {
                  handleSetError(err, 'Error buying a country');

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
      <div className="w-two-thirds-ns w-100">
        <Table
          className="o-80 ph4 pv3 "
          rowClassName="white pointer"
          columns={[
            {
              title: 'Country',
              dataIndex: 'name',
              key: 'name',
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
  );
};

const EnhancedCart = props => (
  <div data-testid="cartComponent" className="bb b--red bw1">
    <Query
      query={gql`
        {
          userId @client
        }
      `}
    >
      {({ loading, data, error }) => {
        if (loading) {
          return <p data-testid="cartLoading">Loading...</p>;
        }
        if (error) {
          return <p data-testid="cartError">Error :(</p>;
        }
        return (
          <Mutation mutation={BUY_NOW_MUTATION}>
            {buyNow => <Cart {...props} data={data} buyNow={buyNow} />}
          </Mutation>
        );
      }}
    </Query>
  </div>
);

const selection = store => ({
  countrySale: store.app.countrySaleInstance,
});

const actions = {
  handleSetError: setError,
};

export default compose(
  connect(
    selection,
    actions,
  ),
  withRouter,
)(EnhancedCart);

Cart.propTypes = {
  markSold: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  picked: PropTypes.arrayOf(PropTypes.shape({})),
  countrySale: PropTypes.shape({}),
  history: ReactRouterPropTypes.history.isRequired,
  data: PropTypes.shape({}).isRequired,
  buyNow: PropTypes.func.isRequired,
  handleSetError: PropTypes.func.isRequired,
  price: PropTypes.number.isRequired,
};

Cart.defaultProps = {
  picked: [{}],
  countrySale: {},
};
