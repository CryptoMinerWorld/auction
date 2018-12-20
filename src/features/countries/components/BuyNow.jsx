import React from 'react';
import PropTypes from 'prop-types';
import ButtonCTA from '../../../components/ButtonCTA';
import reduxStore from '../../../app/store';
import { startTx, completedTx, ErrorTx } from '../../transactions/txActions';

const BuyNow = ({
  txloading,
  picked,
  countrySale,
  handleSetError,
  buyNow,
  markSold,
  handleShowSignInBox,
  setLoading,
  data,
  accountExists,
  provider,
}) => (
  // console.log('countrySale', countrySale);
  // console.log('from', data.userId);
  <div className="w-100">
    {picked.length > 0 && (
      <dl className="mt4 left-2 relative-ns w-100">
        <div className="flex w-100">
          <dt>Total Countries</dt>
          <dd className="dib pl2">{picked.length}</dd>
        </div>
        <div className="flex w-100">
          <dt>
            Total Price
            {' '}
            <span className="basic">Ξ</span>
          </dt>
          <dd className="dib pl2">
            {picked && picked.reduce((total, amount) => total + amount.price, 0).toFixed(3)}
          </dd>
        </div>
        <div className="flex">
          <dt>Total Plots</dt>
          <dd className="dib pl2">
            {picked && picked.reduce((total, amount) => total + amount.plots, 0)}
          </dd>
        </div>
        <div className="flex">
          <dt>
            Total Earns
            {' '}
            <span className="basic ">Ξ</span>
          </dt>
          <dd className="dib pl2">
            {picked && picked.reduce((total, amount) => total + amount.roi, 0).toFixed(3)}
          </dd>
        </div>
      </dl>
    )}

    <div className="tc">
      <div>
        <span className="basic">Ξ</span>
        <span className="f1 b pl2">
          {picked ? picked.reduce((total, amount) => total + amount.price, 0).toFixed(3) : 0.0}
        </span>
      </div>
      <p>Current Price</p>
      <ButtonCTA
        disabled={!countrySale || !markSold || picked.length <= 0 || !buyNow}
        onClick={async () => {
          // sets the loading spinner
          setLoading(true);

          if (provider && accountExists) {
            try {
              const countries = picked.map(country => country.countryId);
              const totalPrice = await countrySale.methods.getBulkPrice(countries).call();

              const txDetails = {
                hash: null,
                currentUser: data.userId,
                tokenId: countries,
              };

              countrySale.methods
                .bulkBuy(countries)
                .send({
                  from: data.userId,
                  value: totalPrice,
                })
                .on('transactionHash', (hash) => {
                  // console.log('tx initiated', hash);
                  txDetails.hash = hash;
                  return reduxStore.dispatch(
                    startTx({
                      hash,
                      currentUser: data.userId,
                      method: 'country',
                      tokenId: countries,
                    }),
                  );
                })
                .on('error', () => setLoading(false));

              countrySale.events
                .BulkPurchaseComplete()
                .on('data', async (event) => {
                  // console.log('data x', event.returnValues, txDetails);

                  // console.log(
                  //   'countries',
                  //   countries.toString(),
                  //   event.returnValues.ids.toString(),
                  //   countries.toString() === event.returnValues.ids.toString(),
                  // );

                  if (
                    data.userId
                      .split('')
                      .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
                      .join('')
                      // eslint-disable-next-line
                      === event.returnValues._to
                        .split('')
                        .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
                        .join('')
                    && txDetails.hash === event.transactionHash
                    && countries.toString() === event.returnValues.ids.toString()
                  ) {
                    // eslint-disable-next-line
                    for (const country of picked) {
                      // console.log('buying begins...', country.name);
                      // eslint-disable-next-line
                      await buyNow({
                        variables: {
                          id: country.name,
                          // eslint-disable-next-line
                          newOwnerId: event.returnValues._to
                            .split('')
                            .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
                            .join(''),
                          price: country.price || 0,
                          timeOfPurchase: Date.now(),
                          totalPlots: country.plots || 0,
                          imageLinkLarge: country.imageLinkLarge,
                          imageLinkMedium: country.imageLinkMedium,
                          imageLinkSmall: country.imageLinkSmall,
                          countryId: country.countryId,
                          mapIndex: country.mapIndex,
                          roi: country.roi,
                        },
                      })
                        .then((x) => {
                          console.log('x bought', x);
                          markSold(country.mapIndex);
                        })
                        .then(() => {
                          console.log('country map updated');
                          setLoading(false);
                          console.log('event', event);
                          reduxStore.dispatch(completedTx(event));
                        })
                        .catch(err => console.log('error buying countries', err));
                    }
                  }
                  return true;
                })
                .on('error', (error) => {
                  console.log('error', error);
                  reduxStore.dispatch(ErrorTx(error));
                  setLoading(false);
                  handleSetError(error, 'Error buying a country');
                });
            } catch (error) {
              console.log('error buying a country', error);
              setLoading(false);
            }
          } else {
            setLoading(false);
            handleShowSignInBox();
          }
        }}
        testId="buyNow"
        loading={txloading}
        loadingText="buying..."
        text="buy now"
      />
    </div>
  </div>
);

export default BuyNow;

BuyNow.propTypes = {
  txloading: PropTypes.bool.isRequired,
  picked: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  countrySale: PropTypes.shape({}).isRequired,
  handleSetError: PropTypes.func.isRequired,
  buyNow: PropTypes.func.isRequired,
  markSold: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  setLoading: PropTypes.func.isRequired,
  data: PropTypes.shape({}).isRequired,
  handleShowSignInBox: PropTypes.func.isRequired,
  provider: PropTypes.bool,
  accountExists: PropTypes.bool,
};

BuyNow.defaultProps = {
  provider: false,
  accountExists: false,
};
