import React from 'react';
import Icon from 'antd/lib/icon';
import PropTypes from 'prop-types';
import buttonPNG from '../app/images/pinkBuyNowButton.png';

const ButtonCTA = ({
  disabled, onClick, testId, loading, loadingText, text,
}) => (
  <button
    type="submit"
    className="b ttu grow pa5"
    style={{
      height: 'auto',
      width: 'auto',
      backgroundImage: `url(${buttonPNG})`,
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      textAlign: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      textTransform: 'uppercase',
      cursor: 'pointer',
      outline: 'none',
    }}
    disabled={disabled}
    onClick={onClick}
    data-testid={testId}
  >
    {loading ? (
      <span>
        <Icon type="loading" theme="outlined" />
        {' '}
        {loadingText}
      </span>
    ) : (
      text
    )}
  </button>
);

export default ButtonCTA;

ButtonCTA.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  loadingText: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
