import React, {
  useState,
  // useRef
} from 'react';
import PropTypes from 'prop-types';
// import Button from 'antd/lib/button';
// import { Mutation } from 'react-apollo';
// import { updateMap } from '../../helpers';
// import { RESELL_COUNTRY_MUTATION, REMOVE_COUNTRY_FROM_AUCTION_MUTATION } from '../../mutations';

const CountryDetails = ({
  // countryId,
  name,
  lastBought,
  // description,
  totalPlots,
  plotsBought,
  plotsMined,
  plotsAvailable,
  image,
  lastPrice,
  roi,
  // handleResell,
  // sellMethod,
  // userId,
  // countrySaleContractId,
  // onSale,
  // erc721CountryContract,
  // dutchContractMethods,
}) => {
  // const priceInput = useRef();
  // eslint-disable-next-line
  // let [price, setPrice] = useState('');
  // eslint-disable-next-line
  let [loading, setLoading] = useState(false);

  return (
    <div className="flex mv5 mw8 center pa3 row-ns flex-column-reverse">
      <div className="w-50-ns w-100">
        {/* <button type="button" className="black">
          <small>Show Stats for all countries</small>
        </button> */}
        <h1 className="white f1">{name}</h1>
        <small>
          Owned for
          {lastBought}
        </small>

        {/* <p className="measure-wide">{description}</p> */}

        <div className="flex aic">
          <dl className="dib mr5">
            <dd className="f6 f5-ns b ml0">Price Paid</dd>
            <dd className="f3 f2-ns b ml0">{lastPrice}</dd>
          </dl>
          <dl className="dib mr5">
            <dd className="f6 f5-ns b ml0">Plots Remaining</dd>
            <dd className="f3 f2-ns b ml0">{totalPlots - plotsBought}</dd>
          </dl>
          <dl className="dib mr5">
            <dd className="f6 f5-ns b ml0">Return on Investment</dd>
            <dd className="f3 f2-ns b ml0">{roi || '0%'}</dd>
          </dl>
        </div>

        <dl className="w-100">
          <th>DETAILS</th>
          <tr className="flex">
            <dt>Total Plots</dt>
            <dd>{totalPlots}</dd>
          </tr>
          <tr className="flex">
            <dt>Plots Bought</dt>
            <dd>{plotsBought}</dd>
          </tr>
          <tr className="flex">
            <dt>Plots Mined</dt>
            <dd>{plotsMined}</dd>
          </tr>

          <tr className="flex">
            <dt>Plots for Auction</dt>
            <dd>{plotsAvailable}</dd>
          </tr>
        </dl>

        {/* {onSale ? (
          <Mutation
            mutation={REMOVE_COUNTRY_FROM_AUCTION_MUTATION}
            variables={{
              id: name,
              newOwnerId: userId && userId,
            }}
          >
            {handleRemovalFromAuction => (
              <button
                type="button"
                className="black"
                data-testid="removeCountryFromAuctionButton"
                onClick={() => {
                  dutchContractMethods
                    .remove(erc721CountryContract, countryId)
                    .send()
                    .then(() => handleRemovalFromAuction())
                    .then(() => updateMap(countryId, true))
                    .catch(err => console.log('err', err));
                }}
              >
                REMOVE
              </button>
            )}
          </Mutation>
        ) : (
          <Mutation
            mutation={RESELL_COUNTRY_MUTATION}
            variables={{
              id: name,
              newOwnerId: userId && userId,
              newPrice: Number(price),
            }}
          >
            {sellMutation => (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleResell(
                    price,
                    setLoading,
                    sellMethod,
                    userId,
                    countrySaleContractId,
                    countryId,
                    sellMutation,
                    updateMap,
                  );
                }}
              >
                <label htmlFor="countryPrice">
                  Country Price
                  <input
                    aria-labelledby="countryPrice"
                    className="black"
                    id="countryPrice"
                    ref={priceInput}
                    value={price}
                    type="number"
                    onChange={e => setPrice(e.target.value, setLoading)}
                    data-testId="countrySellPriceInput"
                    onClick={() => priceInput.current.focus()}
                  />
                </label>
                <button type="submit" className="black" data-testid="countrySellButton">
                  SELL
                </button>
                {loading && <p data-testid="countrySellButtonLoading">Loading...</p>}
              </form>
            )}
          </Mutation>
        )} */}
      </div>
      <div className="w-50-ns w-100">
        <div className="flex x mv5">
          <img src={image} alt={name} className="h-auto w-100" />
        </div>
      </div>
    </div>
  );
};

export default CountryDetails;

CountryDetails.propTypes = {
  name: PropTypes.string.isRequired,
  lastBought: PropTypes.number.isRequired,
  // description: PropTypes.string.isRequired,
  totalPlots: PropTypes.number.isRequired,
  plotsBought: PropTypes.number.isRequired,
  plotsMined: PropTypes.number.isRequired,
  plotsAvailable: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  lastPrice: PropTypes.number.isRequired,
  roi: PropTypes.number.isRequired,
  // handleResell: PropTypes.func.isRequired,
  // sellMethod: PropTypes.func.isRequired,
  // userId: PropTypes.string.isRequired,
  // countrySaleContractId: PropTypes.string.isRequired,
  // countryId: PropTypes.number.isRequired,
  // onSale: PropTypes.bool.isRequired,
  // erc721CountryContract: PropTypes.string.isRequired,
  dutchContractMethods: PropTypes.shape({}).isRequired,
};

// const Sell = ({ country, handleGiftFormSubmit }) => {
//   const [visible, show] = useState(false);
//   const [giftReceiverUserId, setValue] = useState('');

//   return (
//     <Mutation
//       mutation={GIFT_COUNTRY_MUTATION}
//       variables={{
//         id: country && country.name,
//         newOwnerId: giftReceiverUserId
//           .split('')
//           .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
//           .join(''),
//         gift: true,
//         timeOfGifting: 1541129757489,
//       }}
//     >
//       {giftCountryMutation => (
//         <div data-testid="countryDetails">
//           <form
//             className="gift-form"
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleGiftFormSubmit(show, giftCountryMutation);
//             }}
//           >
//             <fieldset>
//               <label htmlFor="countryGiftInput">
//                 Gift A Country
//                 <input
//                   type="text"
//                   name="countryGiftInput"
//                   id="countryGiftInput"
//                   className="black"
//                   value={giftReceiverUserId}
//                   onChange={e => setValue(e.target.value)}
//                 />
//               </label>
//             </fieldset>
//             <button type="submit" className="black" data-testid="giftSubmit">
//               Gift
//               {country && country.name}
//             </button>
//           </form>
//           {visible && <p className="green">Your form has been submitted!</p>}
//         </div>
//       )}
//     </Mutation>
//   );
// };
