// import React, { useState } from 'react';
// import { Query, Mutation } from 'react-apollo';
// import gql from 'graphql-tag';
// import Table from 'antd/lib/table';
// import PropTypes from 'prop-types';
// import { withRouter } from 'react-router-dom';
// import ReactRouterPropTypes from 'react-router-prop-types';
// import { compose } from 'redux';
// import { connect } from 'react-redux';
// import Button from 'antd/lib/button';
// import Icon from 'antd/lib/icon';
// import { BUY_NOW_MUTATION } from '../mutations';
// import { setError } from '../../../app/appActions';
// import BuyNow from './BuyNow';
//
// require('antd/lib/icon/style/css');
// require('antd/lib/table/style/css');
//
// const Cart = ({
//   picked,
//   removeFromCart,
//   history,
//   data,
//   buyNow,
//   markSold,
//   countrySale,
//   handleSetError,
//   price,
//   handleShowSignInBox,
//   provider,
//   accountExists,
// }) => {
//   const [txloading, setLoading] = useState(false);
//
//   return (
//     <div className="flex row-ns flex-column-reverse mw9 center pv4">
//       <div className="w-third-ns w-100 flex col aic jcc">
//         <BuyNow
//           data={data}
//           price={price}
//           txloading={txloading}
//           picked={picked}
//           countrySale={countrySale}
//           handleSetError={handleSetError}
//           buyNow={buyNow}
//           markSold={markSold}
//           history={history}
//           setLoading={setLoading}
//           handleShowSignInBox={handleShowSignInBox}
//           provider={provider}
//           accountExists={accountExists}
//         />
//       </div>
//       <div className="w-two-thirds-ns w-100 o-80 ph4-ns pv3-ns ">
//         <Table
//           id="cart"
//           rowClassName="pointer bg-animate hover-black white w-100"
//           className="o-80 ph4-ns pv3-ns "
//           locale={{ emptyText: 'Select a country on the map to add it to your cart' }}
//           pagination={false}
//           rowKey={record => record.countryId}
//           columns={[
//             {
//               title: 'Country',
//               dataIndex: 'name',
//               key: 'name',
//               render: text => <p className="vert w3 w4-ns truncate-ns tl">{text}</p>,
//             },
//             {
//               title: 'Plots',
//               dataIndex: 'plots',
//               key: 'plots',
//               render: text => <p className="vert  ">{text}</p>,
//             },
//             {
//               title: 'Price Ξ',
//               dataIndex: 'price',
//               key: 'price',
//               render: text => <p className="vert ">{text && text.toFixed(3)}</p>,
//             },
//             {
//               title: 'Earns Ξ',
//               dataIndex: 'roi',
//               key: 'roi',
//               render: text => <p className="vert">{text}</p>,
//             },
//             {
//               title: 'ROI',
//               key: 'minRoi',
//               render: country => (
//                 <p className="vert dn dib-ns">
//                   {Math.round((country.roi / country.price) * 100)}
//                   {' '}
// %
//                 </p>
//               ),
//             },
//
//             {
//               title: 'Remove',
//               key: 'action',
//               render: x => (
//                 <Button
//                   ghost
//                   onClick={() => removeFromCart(x)}
//                   data-testid={`remove-${x.country}`}
//                   className="vert ba-ns bn"
//                   style={{
//                     color: '#ff723f',
//                     borderColor: '#ff723f',
//                   }}
//                 >
//                   <Icon type="minus" />
//                   <span className="dn dib-ns"> Remove</span>
//                 </Button>
//               ),
//             },
//           ]}
//           dataSource={picked}
//         />
//       </div>
//     </div>
//   );
// };
//
// const EnhancedCart = props => (
//   <div data-testid="cartComponent" className="bb b--red bw1">
//     <Query
//       query={gql`
//         {
//           userId @client
//         }
//       `}
//     >
//       {({ loading, data, error }) => {
//         if (loading) {
//           return <p data-testid="cartLoading">Loading...</p>;
//         }
//         if (error) {
//           return <p data-testid="cartError">Error :(</p>;
//         }
//         return (
//           <Mutation mutation={BUY_NOW_MUTATION}>
//             {buyNow => (
//               <Cart
//                 {...props}
//                 data={data}
//                 buyNow={buyNow}
//                 handleShowSignInBox={props.handleShowSignInBox}
//                 provider={props.provider}
//                 accountExists={props.accountExists}
//               />
//             )}
//           </Mutation>
//         );
//       }}
//     </Query>
//   </div>
// );
//
// const selection = store => ({
//   countrySale: store.app.countrySaleInstance,
//   accountExists: store.auth.existingUser,
//   provider: store.auth.web3 && !!store.auth.web3.currentProvider,
// });
//
// const actions = {
//   handleSetError: setError,
//   handleShowSignInBox: () => ({ type: 'SHOW_SIGN_IN_BOX' }),
// };
//
// export default compose(
//   connect(
//     selection,
//     actions,
//   ),
//   withRouter,
// )(EnhancedCart);
//
// Cart.propTypes = {
//   markSold: PropTypes.func.isRequired,
//   removeFromCart: PropTypes.func.isRequired,
//   picked: PropTypes.arrayOf(PropTypes.shape({})),
//   countrySale: PropTypes.shape({}),
//   history: ReactRouterPropTypes.history.isRequired,
//   data: PropTypes.shape({}).isRequired,
//   buyNow: PropTypes.func.isRequired,
//   handleSetError: PropTypes.func.isRequired,
//   price: PropTypes.number,
//   handleShowSignInBox: PropTypes.func.isRequired,
//   accountExists: PropTypes.bool,
//   provider: PropTypes.bool,
// };
//
// Cart.defaultProps = {
//   picked: [{}],
//   countrySale: {},
//   price: 0,
//   provider: false,
//   accountExists: false,
// };
