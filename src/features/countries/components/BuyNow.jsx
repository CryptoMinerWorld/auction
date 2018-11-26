import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'p-iteration';
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
  // history,
  setLoading,
  data,
}) => (
  <div>
    {picked.length > 0 && (
      <dl className="mt4 left-2 relative ">
        <div className="flex">
          <dt>Total Countries</dt>
          <dd>{picked.length}</dd>
        </div>
        <div className="flex">
          <dt>Total Price</dt>
          <dd>
            <span className="basic pl1">Ξ</span>
            {' '}
            {picked && picked.reduce((total, amount) => total + amount.price, 0).toFixed(3)}
          </dd>
        </div>
        <div className="flex">
          <dt>Total Plots</dt>
          <dd>{picked && picked.reduce((total, amount) => total + amount.plots, 0).toFixed(3)}</dd>
        </div>
        <div className="flex">
          <dt>Total Return</dt>
          <dd>{picked && picked.reduce((total, amount) => total + amount.roi, 0).toFixed(3)}</dd>
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
          setLoading(true);
          try {
            const countries = picked.map(country => country.countryId);
            const totalPrice = await countrySale.methods.getBulkPrice(countries).call();

            console.log('totalPrice', totalPrice);
            console.log('countries', countries);
            console.log('countrySale', countrySale);

            countrySale.methods
              .bulkBuy(countries)
              .send({
                value: totalPrice,
              })
              .on('transactionHash', hash => reduxStore.dispatch(
                startTx({
                  hash,
                  currentUser: data.userId,
                  method: 'country',
                  tokenId: countries[0],
                }),
              ))
              .on('error', () => setLoading(false));

            await countrySale.events
              .BulkPurchaseComplete()
              .on('data', async (event) => {
                console.log('data', event);

                map(picked, async (country) => {
                  await buyNow({
                    variables: {
                      id: country.name,
                      newOwnerId: data.userId,
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
                  });
                  console.log('a');
                  await markSold(country.mapIndex);
                  console.log('b');
                })
                  .then(() => {
                    setLoading(false);
                    // history.push(`/profile/${data.userId}#${picked[0].name}`);
                    console.log('event', event);

                    reduxStore.dispatch(completedTx(event));
                  })
                  .catch(err => console.log('error buying countries', err));

                // await picked.forEach(async (country) => {
                //   await buyNow({
                //     variables: {
                //       id: country.name,
                //       newOwnerId: data.userId,
                //       price: country.price || 0,
                //       timeOfPurchase: Date.now(),
                //       totalPlots: country.plots || 0,
                //       imageLinkLarge: country.imageLinkLarge,
                //       imageLinkMedium: country.imageLinkMedium,
                //       imageLinkSmall: country.imageLinkSmall,
                //       countryId: country.countryId,
                //       mapIndex: country.mapIndex,
                //       roi: country.roi,
                //     },
                //   });
                //   await markSold(country.mapIndex);
                // });

                // setLoading(false);
                // // history.push(`/profile/${data.userId}#${picked[0].name}`);
                // console.log('event', event);
                // reduxStore.dispatch(completedTx(event));
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
};
