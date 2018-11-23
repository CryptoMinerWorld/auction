import React, { useState } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Table from 'antd/lib/table';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Button from 'antd/lib/button';
import { BUY_NOW_MUTATION } from '../mutations';
import { setError } from '../../../app/appActions';
import BuyNow from './BuyNow';

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
    <div className="flex row-ns flex-column-reverse mw9 center pv4">
      <div className="w-third-ns w-100 flex col aic jcc">
        <BuyNow
          data={data}
          price={price}
          txloading={txloading}
          picked={picked}
          countrySale={countrySale}
          handleSetError={handleSetError}
          buyNow={buyNow}
          markSold={markSold}
          history={history}
          setLoading={setLoading}
        />
      </div>
      <div className="w-two-thirds-ns w-100 o-80 ph4 pv3 ">
        <Table
          rowClassName="pointer bg-animate hover-black white"
          className="o-80 ph4 pv3 "
          locale={{ emptyText: 'Select a country on the map to add it to your cart' }}
          pagination={false}
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
              title: 'Earns (Minimum)',
              dataIndex: 'roi',
              key: 'roi',
            },
            {
              title: 'ROI (Minimum)',
              key: 'minRoi',
              render: country => (
                <span>
                  {Math.round((country.roi / country.price) * 100)}
                  {' '}
%
                </span>
              ),
            },

            {
              title: 'Remove',
              key: 'action',
              render: x => (
                <Button
                  ghost
                  onClick={() => removeFromCart(x)}
                  data-testid={`remove-${x.country}`}
                  icon="minus"
                  className="grow"
                  style={{
                    color: '#ff723f',
                    borderColor: '#ff723f',
                  }}
                >
                  Remove
                </Button>
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
  price: PropTypes.number,
};

Cart.defaultProps = {
  picked: [{}],
  countrySale: {},
  price: 0,
};
