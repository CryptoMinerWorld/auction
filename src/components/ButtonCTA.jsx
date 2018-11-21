import React from 'react';
import styled from 'styled-components';
import Icon from 'antd/lib/icon';
import PropTypes from 'prop-types';
import button from '../app/images/pinkBuyNowButton.png';

const ColourButton = styled.button`
  background-image: url(${button});
  background-position: center top;
  width: 100%;
  height: 100%;
  text-align: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-color: transparent;
  border: none;
  color: white;
  text-transform: uppercase;
  cursor: pointer;
`;
const ButtonCTA = ({
  disabled, onClick, testId, loading, loadingText, text,
}) => (
  <ColourButton
    type="submit"
    className="b ttu h3 w5 grow"
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
  </ColourButton>
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
