import React from 'react';
import {
  render, cleanup, fireEvent, wait,
} from 'react-testing-library';
import 'jest-dom/extend-expect';
// import { Provider } from 'react-redux';
// import { createStore } from 'redux';
// import { MockedProvider } from 'react-apollo/test-utils';
// import gql from 'graphql-tag';
// import rootReducer from '../../../app/rootReducer';
// import { renderWithRouter } from '../../../app/testSetup';
// import Workshop from '../index';

import cases from 'jest-in-case';
import { Coupon } from '../components/Coupon';
import { validateCoupon } from '../helpers';

import { getCountryNameFromCountryId, getMapIndexFromCountryId } from '../helpers';

afterEach(cleanup);

const renderCouponComponent = () => {
  const handleRedemption = jest.fn();
  const CountrySaleMethods = {
    isCouponValid: () => ({ call: jest.fn(() => Promise.resolve(true)) }),
  };
  const buyNow = jest.fn();
  const markSold = jest.fn();
  const web3 = jest.fn();

  const {
    getByTestId, queryByTestId, getByText, getByRole, getByPlaceholderText,
  } = render(
    <Coupon
      buyNow={buyNow}
      handleRedemption={handleRedemption}
      markedSold={markSold}
      CountrySaleMethods={CountrySaleMethods}
      web3={web3}
    />,
  );

  return {
    getByTestId,
    queryByTestId,
    getByText,
    getByRole,
    getByPlaceholderText,
    web3,
    handleRedemption,
    CountrySaleMethods,
    buyNow,
    markSold,
  };
};

describe('Country Coupon System', () => {
  test('clicking on a the coupon button opens the coupon modal', () => {
    const { getByTestId, queryByTestId } = renderCouponComponent();
    expect(queryByTestId('countryCouponModal')).not.toBeInTheDocument();
    expect(getByTestId('countryCoupon')).toBeInTheDocument();
    fireEvent.click(getByTestId('countryCoupon'));
    expect(getByTestId('countryCouponModal')).toBeInTheDocument();
  });

  test.skip('clicking on close button closes the modal', () => {
    const {
      getByTestId, queryByTestId, getByText, getByRole,
    } = renderCouponComponent();
    expect(queryByTestId('countryCouponModal')).not.toBeInTheDocument();
    expect(getByTestId('countryCoupon')).toBeInTheDocument();
    fireEvent.click(getByTestId('countryCoupon'));
    expect(getByTestId('countryCouponModal')).toBeInTheDocument();
    fireEvent.click(getByText('Cancel'));
    expect(getByTestId('countryCoupon')).toBeInTheDocument();
    expect(getByRole('dialog')).toHaveStyle('display: none');
  });

  test('the coupon modal fired with the right function', async () => {
    const {
      getByTestId,
      queryByTestId,
      getByPlaceholderText,
      getByText,
      handleRedemption,
      CountrySaleMethods,
      buyNow,
      markSold,
      web3,
    } = renderCouponComponent();
    expect(queryByTestId('countryCouponModal')).not.toBeInTheDocument();
    expect(getByTestId('countryCoupon')).toBeInTheDocument();
    fireEvent.click(getByTestId('countryCoupon'));
    expect(getByTestId('countryCouponModal')).toBeInTheDocument();
    const input = getByPlaceholderText('Enter Your Coupon Code Here...');
    fireEvent.change(input, { target: { value: 'NVBKJUIANBVHXFVA_190' } });
    fireEvent.click(getByText('OK'));
    await wait(() => expect(handleRedemption).toBeCalled());

    expect(handleRedemption).toBeCalledWith(
      'NVBKJUIANBVHXFVA_190',
      CountrySaleMethods,
      buyNow,
      markSold,
      web3,
    );
  });

  test('if no code is entered an error message is shown', () => {
    const {
      getByTestId,
      queryByTestId,
      getByPlaceholderText,
      getByText,
      handleRedemption,
    } = renderCouponComponent();
    expect(getByTestId('countryCoupon')).toBeInTheDocument();
    expect(queryByTestId('errorMessage')).not.toBeInTheDocument();
    fireEvent.click(getByTestId('countryCoupon'));
    expect(getByTestId('countryCouponModal')).toBeInTheDocument();
    const input = getByPlaceholderText('Enter Your Coupon Code Here...');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(getByText('OK'));
    expect(getByTestId('errorMessage')).toHaveTextContent(
      'The coupon field cannot be empty. Please enter a valid coupon code.',
    );
    expect(handleRedemption).not.toBeCalled();
  });

  test('if an incorrect code is entered an error message is shown', () => {
    const {
      getByTestId,
      queryByTestId,
      getByPlaceholderText,
      getByText,
      handleRedemption,
    } = renderCouponComponent();
    expect(getByTestId('countryCoupon')).toBeInTheDocument();
    expect(queryByTestId('errorMessage')).not.toBeInTheDocument();
    fireEvent.click(getByTestId('countryCoupon'));
    expect(getByTestId('countryCouponModal')).toBeInTheDocument();
    const input = getByPlaceholderText('Enter Your Coupon Code Here...');
    fireEvent.change(input, { target: { value: '1234' } });
    fireEvent.click(getByText('OK'));
    expect(getByTestId('errorMessage')).toHaveTextContent(
      'Sorry, this is not a valid coupon code.',
    );
    expect(handleRedemption).not.toBeCalled();
  });

  test('When a code is entered a validation check is submitted', async () => {
    const {
      getByTestId,
      getByPlaceholderText,
      getByText,
      handleRedemption,
    } = renderCouponComponent();
    fireEvent.click(getByTestId('countryCoupon'));
    expect(getByTestId('countryCouponModal')).toBeInTheDocument();
    const input = getByPlaceholderText('Enter Your Coupon Code Here...');
    fireEvent.change(input, { target: { value: 'NVBKJUIANBVHXFVA_190' } });
    fireEvent.click(getByText('OK'));
    await wait(() => expect(handleRedemption).toBeCalled());
  });

  test.skip('When a bad code is entered the validation check fails', async () => {
    const {
      getByTestId,
      getByPlaceholderText,
      getByText,
      handleRedemption,
    } = renderCouponComponent();
    fireEvent.click(getByTestId('countryCoupon'));
    expect(getByTestId('countryCouponModal')).toBeInTheDocument();
    const input = getByPlaceholderText('Enter Your Coupon Code Here...');
    fireEvent.change(input, { target: { value: 'NVBKJUIANBVHXFVA_190' } });
    fireEvent.click(getByText('OK'));
    await wait(() => expect(handleRedemption).not.toBeCalled());
  });

  test.skip('disable buy button if contract is not present', () => {});

  test.skip('loading redeem coupon button if contract is not present', () => {});
});


cases(
  'coupon is rejected if it is not the correct format',
  (couponCode) => {
    expect(validateCoupon(couponCode.coupon)).toBe(couponCode.result);
  },
  [
    {
      name: 'is exactly 20 characters long',
      coupon: 'NVBKJUIANBVHXFVA_190',
      result: true,
    },
    {
      name: 'is not 21 characters long',
      coupon: 'NVLKJUIARBVHXFVA_1903',
      result: false,
    },
    {
      name: 'first 16 characters are all letters',
      coupon: 'NVLKJUIANBVHXFVA_190',
      result: true,
    },
    {
      name: 'first 16 are not all letters',
      coupon: '2VLKJUIANBVHXFVA_190',
      result: false,
    },
    {
      name: 'does not include a _',
      coupon: 'MVLKJUIANBVHXFVAR190',
      result: false,
    },
    {
      name: 'includes a _ at the 16th position',
      coupon: 'MVLKJUIANBVHXFVA_190',
      result: true,
    },
    {
      name: 'last 3 characters are numbers',
      coupon: 'MVLKJUIANBVHXFVA_190',
      result: true,
    },
    {
      name: 'last 3 characters are not numbers',
      coupon: 'MVLKJUIANBVHXFVA_YRX',
      result: false,
    },

    {
      name: 'last 3 characters are between 170 and 190',
      coupon: 'MVLKJUIANBVHXFVA_186',
      result: true,
    },

    {
      name: 'last 3 characters are not between 170 and 190',
      coupon: 'MVLKJUIANBVHXFVA_275',
      result: false,
    },
  ],
);

cases('getCountryNameFromCountryId returns correct mapIndex',
  (id) => {
    expect(getCountryNameFromCountryId(id)).toBe('Afghanistan');
  },
  [42]);


cases('getMapIndexFromCountryId returns correct country name',
  (id) => {
    expect(getMapIndexFromCountryId(id)).toBe(1);
  }, [42]);
