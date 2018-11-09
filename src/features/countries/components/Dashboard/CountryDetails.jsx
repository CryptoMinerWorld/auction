import React from 'react';
import PropTypes from 'prop-types';
// import { Mutation } from 'react-apollo';
// import { GIFT_COUNTRY_MUTATION } from '../../mutations';

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

const CountryDetails = ({
  name,
  durationOwned,
  description,
  totalPlots,
  plotsBought,
  plotsMined,
  plotsForAuction,
  image,
  lastPrice,
  roi,
}) => (
  <div className="ba flex">
    <div className="w-50">
      <button>
        <small>Show Stats for all countries</small>
      </button>
      <h1>{name}</h1>
      <small>
        Owned for
        {durationOwned}
      </small>
      <p>{description}</p>
      <dl className="">
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
          <dd>{plotsForAuction}</dd>
        </tr>
      </dl>
      <button>SELL</button>
    </div>
    <div className="w-50">
      <img src={image} alt={name} />
      <div>
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
          <dd className="f3 f2-ns b ml0">{roi}</dd>
        </dl>
      </div>
    </div>
  </div>
);

export default CountryDetails;

CountryDetails.propTypes = {
  name: PropTypes.string.isRequired,
  durationOwned: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  totalPlots: PropTypes.number.isRequired,
  plotsBought: PropTypes.number.isRequired,
  plotsMined: PropTypes.number.isRequired,
  plotsForAuction: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  lastPrice: PropTypes.number.isRequired,
  roi: PropTypes.number.isRequired,
};
