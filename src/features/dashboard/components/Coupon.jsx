import React, { useState } from 'react';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import Input from 'antd/lib/input';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { BUY_NOW_MUTATION } from '../../countries/mutations';
import { markSold, validateCoupon } from '../helpers';

export const Coupon = ({
  handleRedemption, redirect,
}) => {
  const [visible, showModal] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [loading, setloading] = useState(false);

  // eslint-disable-next-line
  const handleOk = () => {
    setloading(true);
    if (!value) {
      // console.log('no input value');
      setError('The coupon field cannot be empty. Please enter a valid coupon code.');
      setloading(false);
    }
    // else if (!validateCoupon(value)) {
    //   // console.log('not valid coupon');
    //   setError('Sorry, this is not a valid coupon code.');
    //   setloading(false);
    // }
    else {
      // console.log('valid input and coupon format');
      return handleRedemption(value, ()=>{setloading(false); showModal(false)})
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
        //loading={!handleRedemption}
      >
        Redeem Coupon
      </Button>
      <Modal
        title="Redeem a Coupon"
        visible={visible}
        onCancel={() => handleCancel()}
        onOk={() => handleOk()}
        okButtonProps={{ loading }}
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
  <Coupon {...props} />
);

Coupon.propTypes = {
  handleRedemption: PropTypes.func.isRequired,
  redirect: PropTypes.func,
};

Coupon.defaultProps = {
  redirect: () => {},
};
