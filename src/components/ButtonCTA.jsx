import React from 'react';
// import styled from 'styled-components';
import Icon from 'antd/lib/icon';
import PropTypes from 'prop-types';
import button from '../app/images/pinkBuyNowButton.png';

const ButtonCTA = ({
  disabled, onClick, testId, loading, loadingText, text,
}) => (
  <button
    type="submit"
    className="b ttu grow ma4 pa3"
    style={{
      minWidth: '16rem',
      height: '4rem',
      backgroundImage: `url(${button})`,
      backgroundPosition: 'center top',
      textAlign: 'center',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      textTransform: 'uppercase',
      cursor: 'pointer',
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
