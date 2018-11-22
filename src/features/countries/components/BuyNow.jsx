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
  history,
  setLoading,
  data,
}) => (
  <div>
    {picked.length > 0 && (
      <dl className="mt4 left-2 relative">
        <tr className="flex">
          <dt>Total Countries</dt>
          <dd>{picked.length}</dd>
        </tr>
        <tr className="flex">
          <dt>Total Price</dt>
          <dd>
            <span className="basic pl1">Ξ</span>
            {' '}
            {picked && picked.reduce((total, amount) => total + amount.price, 0).toFixed(3)}
          </dd>
        </tr>
        <tr className="flex">
          <dt>Total Plots</dt>
          <dd>no data yet</dd>
        </tr>

        <tr className="flex">
          <dt>Total Return</dt>
          <dd>no data yet</dd>
        </tr>
      </dl>
    )}

    <div className="flex col aic jcc">
      <div>
        <span className="basic">Ξ</span>
        <span className="f1 b pl2">
          {picked ? picked.reduce((total, amount) => total + amount.price, 0).toFixed(3) : 0.0}
        </span>
      </div>
      <p>Current Price</p>
      <div className=" flex row aic jcc">
        <ButtonCTA
          disabled={!countrySale || !markSold || picked.length <= 0 || !buyNow}
          onClick={async () => {
            setLoading(true);
            const countries = picked.map(country => country.countryId);
            const allPrices = await Promise.all(
              countries.map(countryId => countrySale.methods.getPrice(countryId).call()),
            );
            const totalPrice = allPrices
              .map(value => Number(value))
              .reduce((total, pricex) => total + pricex);

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
              ));

            await countrySale.events
              .BulkPurchaseComplete()
              .on('data', async (event) => {
                // for each country
                // this will probably be more efficient as a batched transaction https://firebase.google.com/docs/firestore/manage-data/transactions
                await picked.forEach(async (country) => {
                  await buyNow({
                    variables: {
                      id: country.name,
                      newOwnerId: data.userId,
                      price: country.price || 0,
                      timeOfPurchase: Date.now(),
                      totalPlots: country.plots || 0,
                    },
                  });
                  await markSold(country.mapIndex);
                });

                setLoading(false);
                history.push(`/profile/${data.userId}#${picked[0].name}`);
                reduxStore.dispatch(completedTx(event));
              })
              .on('error', (error) => {
                reduxStore.dispatch(ErrorTx(error));
                setLoading(false);
                handleSetError(error, 'Error buying a country');
              });

            //   // blockchain
            //   await countrySale.methods.bulkBuy(countries).send(
            //     {
            //       value: totalPrice,
            //     },
            //     async (err) => {
            //       if (err) {

            //         handleSetError(err, 'Error buying a country');
            //         return;
            //       }
            //
            //       await picked.forEach(async (country) => {
            //         await buyNow({
            //           variables: {
            //             id: country.name,
            //             newOwnerId: data.userId,
            //             price: country.price || 0,
            //             timeOfPurchase: Date.now(),
            //             totalPlots: country.plots || 0,
            //           },
            //         });
            //         await markSold(country.mapIndex);
            //       });

            //       setLoading(false);
            //       history.push(`/profile/${data.userId}#${picked[0].name}`);
            //     },
            //   );
            // } catch (err) {
            //   handleSetError(err, 'Error buying a country');
            //   setLoading(false);
            // }
          }}
          testId="buyNow"
          loading={txloading}
          loadingText="buying..."
          text="buy now"
        />
      </div>
    </div>
  </div>
);
export default BuyNow;

BuyNow.propTypes = {
  txloading: PropTypes.number.isRequired,
  picked: PropTypes.shape({}).isRequired,
  countrySale: PropTypes.shape({}).isRequired,
  handleSetError: PropTypes.bool.isRequired,
  buyNow: PropTypes.func.isRequired,
  markSold: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  setLoading: PropTypes.func.isRequired,
  data: PropTypes.shape({}).isRequired,
};
