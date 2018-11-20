test.skip('using a coupon transfers the country to your dashboard', () => {
  const handleRedemption = jest.fn();
  const {
    getByTestId, queryByTestId, getByPlaceholderText, getByText,
  } = render(
      <Coupon handleRedemption={handleRedemption} />,
  );
  expect(queryByTestId('countryCouponModal')).not.toBeInTheDocument();
  expect(getByTestId('countryCoupon')).toBeInTheDocument();
  fireEvent.click(getByTestId('countryCoupon'));
  expect(getByTestId('countryCouponModal')).toBeInTheDocument();
  const input = getByPlaceholderText('Enter Your Coupon Code Here...');
  fireEvent.change(input, { target: { value: '1234' } });
  fireEvent.click(getByText('OK'));
  expect(handleRedemption).toBeCalled();
  //  expect reirect
  // expect ocuntry to be in dashboard
  // expect country to be sold on map
});
