import React from 'react';
import PropTypes from 'prop-types';

const DisplayCard = ({ gemImage, imageLoading }) => (
  <article className="br2 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw5 center bg-white">
    {imageLoading ? (
      <p>loading...</p>
    ) : (
      <img src={gemImage} className="db w-100 br2 br--top" alt="kitten looking menacing." />
    )}
    {/* <div className="pa2 ph3-ns pb3-ns">
      <div className="dt w-100 mt1">
        <div className="dtc">
          <h1 className="f5 f4-ns mv0">Cat</h1>
        </div>
        <div className="dtc tr">
          <h2 className="f5 mv0">$1,000</h2>
        </div>
      </div>
      <p className="f6 lh-copy measure mt2 mid-gray">
        {gemDetails}
      </p>
    </div> */}
  </article>
);

export default DisplayCard;

DisplayCard.propTypes = {
  gemImage: PropTypes.string.isRequired,
  imageLoading: PropTypes.bool.isRequired,
};
