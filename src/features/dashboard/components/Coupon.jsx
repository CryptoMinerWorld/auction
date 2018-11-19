import React, { useState } from 'react';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import Input from 'antd/lib/input';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { BUY_NOW_MUTATION } from '../../countries/mutations';
import { markSold, validateCoupon } from '../helpers';

export const Coupon = ({
  handleRedemption, CountrySaleMethods, buyNow, markedSold, redirect,
}) => {
  const [visible, showModal] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [loading, setloading] = useState(false);

  // eslint-disable-next-line
  const handleOk = () => {
    setloading(true);
    if (!value) {
      console.log('no input value');
      setError('The coupon field cannot be empty. Please enter a valid coupon code.');
      setloading(false);
    } else if (!validateCoupon(value)) {
      console.log('not valid coupon');
      setError('Sorry, this is not a valid coupon code.');
      setloading(false);
    } else {
      console.log('valid input and coupon format');
      CountrySaleMethods.methods
        .isCouponValid(value)
        .call()
        .then(async (result) => {
          if (result === '0') {
            console.log('just not a valid coupon');
            throw new Error();
          }
          handleRedemption(
            value,
            CountrySaleMethods,
            buyNow,
            markedSold,
            setloading,
            showModal,
            redirect,
          );
        })
        .catch((err) => {
          console.log('err', err);
          setError('Sorry, this is not a valid coupon code.');
          setloading(false);
        });
    }
  };

  const handleCancel = () => {
    setValue('');
    showModal(false);
  };

  return (
    <div className="mh3">
      <Button
        data-testid="countryCoupon"
        type="button"
        ghost
        onClick={() => showModal(true)}
        loading={!CountrySaleMethods || CountrySaleMethods.methods === {} || !buyNow || !markedSold}
      >
        Redeem Coupon
      </Button>
      <Modal
        title="Redeem a Coupon"
        visible={visible}
        onCancel={() => handleCancel()}
        onOk={() => handleOk()}
        okButtonProps={{ disabled: !CountrySaleMethods, loading }}
      >
        <Input
          data-testid="countryCouponModal"
          placeholder="Enter Your Coupon Code Here..."
          className="black"
          value={value}
          onChange={(e) => {
            setError('');
            setValue(e.target.value);
          }}
        />
        {error && (
          <small className="red" data-testid="errorMessage">
            {error}
          </small>
        )}
      </Modal>
    </div>
  );
};

export const EnhancedCoupon = props => (
  <Mutation mutation={BUY_NOW_MUTATION}>
    {buyNow => <Coupon {...props} buyNow={buyNow} markedSold={markSold} />}
  </Mutation>
);

Coupon.propTypes = {
  handleRedemption: PropTypes.func.isRequired,
  CountrySaleMethods: PropTypes.shape({}),
  buyNow: PropTypes.func.isRequired,
  markedSold: PropTypes.func.isRequired,
  redirect: PropTypes.func.isRequired,
};

Coupon.defaultProps = {
  CountrySaleMethods: {},
};
