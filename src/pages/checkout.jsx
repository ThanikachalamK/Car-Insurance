import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import {
  CheckoutStateContext,
  CheckoutDispatchContext,
  CHECKOUT_STEPS,
  setCheckoutStep,
  saveShippingAddress,
  savePaymentInfo,
  orderPlacementInfo
} from "../contexts/checkout";
import { CartStateContext } from "../contexts/cart";
import { AuthStateContext, AuthDispatchContext, signOut, signIn } from "../contexts/auth";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import _get from "lodash.get";
import Input from "../components/core/form-controls/Input";
// import Checkbox from "../components/core/form-controls/Checkbox";
import { phoneRegExp, cardRegExp, cvvRegExp } from "../constants/common";

const AddressSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(phoneRegExp, "Phone Number is not a valid 10 digit number")
    .min(10, "Phone Number is too short")
    .max(10, "Phone Number is too long"),
  addressLine: Yup.string().required("Door No. & Street is required!"),
  city: Yup.string().required("City is required!"),
  state: Yup.string().required("State is required!"),
  code: Yup.string().required("ZIP/Postal code is required!"),
  country: Yup.string().required("Country is required!"),
});

const PaymentSchema = Yup.object().shape({
  cardNumber: Yup.string()
    .required("Card Number is required")
    .matches(cardRegExp, "Card Number is not a valid")
    .min(16, "Card Number is too short")
    .max(16, "Card Number is too long"),
  cvvNumber: Yup.string()
    .required("CVV is required")
    .matches(cvvRegExp, "CVV Number is not a valid")
    .min(3, "CVV Number is too short")
    .max(3, "CVV Number is too long"),
  fullName: Yup.string().required("Full Name is required"),
  // checkTnC: Yup.string().required("Terms and Condition is required"),
});

const LoginStep = () => {
  const history = useNavigate();
  let { user , isLoggedIn } = useContext(AuthStateContext);
  const { step, shippingAddress, paymentInfo } = useContext(CheckoutStateContext);
  const authDispatch = useContext(AuthDispatchContext);
  const checkoutDispatch = useContext(CheckoutDispatchContext);
  const handleContinueShopping = () => {
    history("/lists");
  };
  const handleLoginAsDiffUser = () => {
    signOut(authDispatch);
    history("/auth");
  };
  const handleGotoLogin = () => {
    history("/auth");
  };
  const handleProceed = () => {
    setCheckoutStep(checkoutDispatch, CHECKOUT_STEPS.SHIPPING);
  };

  useEffect(() => {signIn(authDispatch, {"username":"1234567890"}, true);}, []); // -->>todo

  return (
    <div className="detail-container">
      <h2>Sign In now!</h2>
      <div className="auth-message">
        {isLoggedIn ? (
          <>
            <p>
              Logged in as <span>{user.username}</span>
            </p>
            <button onClick={() => handleLoginAsDiffUser()}>
              Login as Different User
            </button>
          </>
        ) : (
          <>
            <p>Please login to continue.</p>
            <button onClick={() => handleGotoLogin()}>Login</button>
          </>
        )}
      </div>
      <div className="actions">
        <button className="outline" onClick={() => handleContinueShopping()}>
          <i className="rsc-icon-arrow_back" /> Continue Shopping
        </button>
        <button disabled={step !== CHECKOUT_STEPS.AUTH || !isLoggedIn} onClick={() => handleProceed()}>
          Proceed
          <i className="rsc-icon-arrow_forward" />
        </button>
      </div>
    </div>
  );
};

const AddressStep = () => {
  const checkoutDispatch = useContext(CheckoutDispatchContext);

  const handleBackToLogin = () => {
    setCheckoutStep(checkoutDispatch, CHECKOUT_STEPS.AUTH);
  };
  const handleSaveAddress = (addressData) => {
    saveShippingAddress(checkoutDispatch, addressData);
    setCheckoutStep(checkoutDispatch, CHECKOUT_STEPS.PAYMENT);
  };
  return (
    <div className="detail-container">
      <h2>Shipping Address</h2>
      <Formik
        initialValues={{
          fullName: "John Doe",
          phoneNumber: "5552229876",
          addressLine: "L1, Palm Residency",
          city: "Kingston",
          state: "New York",
          code: "12401",
          country: "United States"
        }}
        validationSchema={AddressSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            const addressData = { ...values };
            resetForm();
            handleSaveAddress(addressData);
          } catch (err) {
            console.error(err);
          }
        }}
      >
        {() => (
          <Form id="address">
            <div className="field-group">
              <Field
                name="fullName"
                type="text"
                placeholder="Full Name"
                component={Input}
              />
              <Field
                name="phoneNumber"
                type="text"
                placeholder="Phone Number"
                component={Input}
              />
            </div>
            <Field
              name="addressLine"
              type="text"
              placeholder="Door No. & Street"
              component={Input}
            />
            <div className="field-group">
              <Field
                name="city"
                type="text"
                placeholder="City"
                component={Input}
              />
              <Field
                name="state"
                type="text"
                placeholder="State"
                component={Input}
              />
            </div>
            <div className="field-group">
              <Field
                name="code"
                type="text"
                placeholder="ZIP/Postal Code"
                component={Input}
              />
              <Field
                name="country"
                type="text"
                placeholder="Country"
                component={Input}
              />
            </div>
            <div className="actions">
              <button
                type="button"
                className="outline"
                onClick={() => handleBackToLogin()}
              >
                <i className="rsc-icon-arrow_back" /> Login in as Different User
              </button>
              <button type="submit">
                Save Address
                <i className="rsc-icon-arrow_forward" />
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const PaymentStep = () => {
  const { shippingAddress, paymentInfo } = useContext(CheckoutStateContext);
  const checkoutDispatch = useContext(CheckoutDispatchContext);
  const [isSigned, setIsSigned] = useState(true);
  const handleBackToAddress = () => {
    setCheckoutStep(checkoutDispatch, CHECKOUT_STEPS.SHIPPING);
  };
  const handlePayment = (payment) => {
    savePaymentInfo(checkoutDispatch, payment);
    setCheckoutStep(checkoutDispatch, CHECKOUT_STEPS.SUBMIT);
  };
  return (
    <div className="detail-container">
      <h2>Payment</h2>
      {/* <div>
        <pre>{JSON.stringify(shippingAddress, null, 0)}</pre>
      </div> */}
      <Formik
        initialValues={{
          fullName: "John Doe",
          cardNumber: "4111111111111111",
          cvvNumber: "123"
        }}
        validationSchema={PaymentSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            const paymentInfo = { ...values };
            resetForm();
            handlePayment(paymentInfo);
          } catch (err) {
            console.error(err);
          }
        }}
      >
        {() => (
          <Form>
            <label>Card Number</label>
            <Field
              name="cardNumber"
              type="text"
              placeholder="Card Number"
              component={Input}
            />
            <label>CVV</label>
            <Field
              name="cvvNumber"
              type="password`"
              placeholder="CVV Number"
              component={Input}
            />
            <label>Name</label>
            <Field
              name="fullName"
              type="text"
              placeholder="Full Name"
              component={Input}
            />
            <section>
              <input type='checkbox' name='T&C' checked={isSigned} onChange={() => setIsSigned(!isSigned)} />
              Terms and Condition
            </section>
            <div className="actions">
              <button
                type="button"
                className="outline"
                onClick={() => handleBackToAddress()}
              >
                <i className="rsc-icon-arrow_back" /> Back to Shipping Details
              </button>
              <button disabled={!isSigned} type="submit">
                Save Payment
                <i className="rsc-icon-arrow_forward" />
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const PlaceOrderStep = () => {
  const history = useNavigate();
  const { shippingAddress, paymentInfo, isSubmit, orderStatus } = useContext(CheckoutStateContext);
  const { items = [] } = useContext(CartStateContext);
  const checkoutDispatch = useContext(CheckoutDispatchContext);
  const orderPlacement = () => {
    orderPlacementInfo(checkoutDispatch, shippingAddress, paymentInfo, items, true);
    history("/review");
  };
  return (
    <div className="detail-container">
      <h2>Payment</h2>
      {paymentInfo && (<>
        <p>Name: {paymentInfo.fullName}</p>
        <p>Card Number: {paymentInfo.cardNumber}</p>
      </>)}

      {shippingAddress && (<>
        <h2>Shipping</h2>
        <p>Name: {shippingAddress.fullName}</p>
        <p>Address: {shippingAddress.addressLine}</p>
        <p>city: {shippingAddress.city}</p>
        <p>country: {shippingAddress.country}</p>
        <p>Contact: {shippingAddress.phoneNumber}</p>
      </>)}
      
      <div style={{'marginTop': '10px'}} className="">
        <button disabled={!shippingAddress || !paymentInfo} onClick={() => orderPlacement()}>
          Place Order
          <i className="rsc-icon-arrow_forward" />
        </button>
      </div>
          
    </div>
  );
};

const Checkout = () => {
  const { items = [] } = useContext(CartStateContext);
  const { isLoggedIn } = useContext(AuthStateContext);
  const { step, shippingAddress, paymentInfo } = useContext(CheckoutStateContext);
  const checkoutDispatch = useContext(CheckoutDispatchContext);
  const totalItems = items.length;

  const handleClickTimeline = (nextStep) => {
    setCheckoutStep(checkoutDispatch, nextStep);
  };
  
  useEffect(() => {
    // setCheckoutStep(checkoutDispatch, CHECKOUT_STEPS.SHIPPING);
  }, []);

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="order-details">
          <ul className="timeline">
            <li
              className={classNames({
                done: isLoggedIn,
                active: step === CHECKOUT_STEPS.AUTH
              })}
              onClick={() => handleClickTimeline(CHECKOUT_STEPS.AUTH)}
            >
              <h2>Sign In</h2>
              <i className="rsc-icon-check_circle" />
            </li>
            <li
              className={classNames({
                done: shippingAddress !== null,
                active: step === CHECKOUT_STEPS.SHIPPING
              })}
              onClick={() => handleClickTimeline(CHECKOUT_STEPS.SHIPPING)}
            >
              <h2>Shipping</h2>
              <i className="rsc-icon-check_circle" />
            </li>
            <li
              className={classNames({
                done: paymentInfo != null,
                active: step === CHECKOUT_STEPS.PAYMENT
              })}
              onClick={() => handleClickTimeline(CHECKOUT_STEPS.PAYMENT)}
            >
              <h2>Payment</h2>
              <i className="rsc-icon-check_circle" />
            </li>
          </ul>
          {step === CHECKOUT_STEPS.AUTH && <LoginStep />}
          {step === CHECKOUT_STEPS.SHIPPING && <AddressStep />}
          {step === CHECKOUT_STEPS.PAYMENT && <PaymentStep />}
          {step === CHECKOUT_STEPS.SUBMIT && <PlaceOrderStep />}
        </div>
        <div className="order-summary">
          <h2>
            Summary
            <span>{` (${totalItems}) Items`}</span>
          </h2>
          <ul className="cart-items">
            {items.map((product, i) => {
              return (
                <li className="cart-item" key={product.name}>
                  <img className="product-image" src="https://cdn.dribbble.com/userupload/5024500/file/original-1aacc32300c3cac6d88f917e50b37445.png?compress=1&resize=50x" />
                  <div className="product-info">
                    <p className="product-name">Car Item -{i + 1}</p>
                    {product.price && <p className="product-price">{product.price}</p>}
                  </div>
                  <div className="product-total">
                    <p className="quantity">
                      {`${product.quantity} ${
                        product.quantity > 1 ? "Nos." : "No."
                      }`}
                    </p>
                    {product.quantity && product.price && <p className="amount">{product.quantity * product.price}</p>}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* <ul className="total-breakup">
            <li>
              <p>Subtotal</p>
              <p>5000</p>
            </li>
            <li>
              <p>Tax</p>
              <p>5000</p>
            </li>
            <li>
              <p>Shipping</p>
              <p>5000</p>
            </li>
            <li>
              <h2>Total</h2>
              <h2>5000</h2>
            </li>
          </ul> */}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
