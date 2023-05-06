import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // to mock test
// import classNames from "classnames";
import {
  ReviewStateContext,
  ReviewDispatchContext,
  getCheckoutOrder
} from "../contexts/review";
import { CartStateContext } from "../contexts/cart";
// import { AuthStateContext, AuthDispatchContext, signOut } from "../contexts/auth";
import _get from "lodash.get";
// import Input from "../components/core/form-controls/Input";
// import { phoneRegExp } from "../constants/common";


const Review = () => {
  // const { items = [] } = useContext(CartStateContext);
  const reviewDispatch = useContext(ReviewDispatchContext);
  // const { isLoggedIn } = useContext(AuthStateContext);
  const { isLoading, isLoaded, review = {} } = useContext(ReviewStateContext);
  const { lists = [] } = review;
  const totalItems = lists.length;

  useEffect(() => {
    getCheckoutOrder(reviewDispatch);
  }, []);

  if (isLoading) {
    return (
      <div className="products-wrapper">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="review-checkout-page">
      <div className="container">
        <div className="order-details">
          <ul className="timeline">
            <li className="active">
              <h2>Sign In</h2>
              <i className="rsc-icon-check_circle" />
            </li>
            <li className="active">
              <h2>Shipping</h2>
              <i className="rsc-icon-check_circle" />
            </li>
            <li  className="active">
              <h2>Payment</h2>
              <i className="rsc-icon-check_circle" />
            </li>
          </ul>
          {lists.map((data) => {
            return (
            <div className="review-content">
              <div className="review-detailsWrap">
                {data.userDetails && <div className="review-details">
                  <h4>Contact Details</h4>
                  {console.log("*********************",data)}
                  <div style={{'display': 'flex'}}>
                    <div style={{'flex-grow': '1'}}>
                      <p>Name</p>
                      <p>Mobile</p>
                      <p>Address</p>
                      <p>SSN</p>
                    </div>
                    <div style={{'flex-basis': '200px'}}>
                      <p>{data.userDetails.name}</p>
                      <p>{data.userDetails.mobile}</p>
                      <p>{data.userDetails.address}</p>
                      <p>{data.userDetails.SSN}</p>
                    </div>
                  </div>
                </div>}
                {data.paymentDetails &&<div className="review-details">
                  <h4>Payment Details</h4>
                  <div style={{'display': 'flex'}}>
                    <div style={{'flex-grow': '1'}}>
                      <p>Card Number</p>
                      <p>Card Type</p>
                    </div>
                    <div style={{'flex-basis': '200px'}}>
                      <p>{data.paymentDetails.cardNumber}</p>
                      <p>{data.paymentDetails.cardType}</p>
                    </div>
                  </div>
                </div>}
              </div>
              <div className="review-img">
                <img 
                  src={data.image}
                  alt={data.name}
                />
                <h4>{data.name}</h4>
              </div>
            </div>);
          })}
        </div>
        <div className="order-summary">
          <h2>
            Summary
            <span>{` (${totalItems}) Items`}</span>
          </h2>
          <ul className="cart-items">
            {lists.map((product, i) => {
              return (
                <li className="cart-item" key={product.name}>
                  <img className="product-image" src={product.image} />
                  <div className="product-info">
                    <p className="product-name">Car Item -{product.id}</p>
                    {product.price && <p className="product-price">{product.price}</p>}
                  </div>
                  <div className="product-total">
                    {product.quantity && <p className="quantity">
                      {`${product.quantity} ${
                        product.quantity > 1 ? "Nos." : "No."
                      }`}
                    </p>}
                    {product.quantity && product.price && <p className="amount">{product.quantity * product.price}</p>}
                  </div>
                </li>
              );
            })}
          </ul>

          <ul className="total-breakup">
            <li>
              <p>Subtotal</p>
              <p>{review.subtotal}</p>
            </li>
            <li>
              <p>Tax</p>
              <p>{review.tax}</p>
            </li>
            <li>
              <h2>Total</h2>
              <h2>{review.total}</h2>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Review;
