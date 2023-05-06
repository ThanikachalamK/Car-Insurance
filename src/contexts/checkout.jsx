import React, { useReducer, createContext, useEffect } from "react";
import axios from "axios";
import useSessionStorage from "../hooks/useSessionStorage";
import { order } from './mockData';

export const CHECKOUT_STEPS = {
  AUTH: "auth",
  SHIPPING: "shipping",
  PAYMENT: "payment",
  SUBMIT: "submit"
};

const initialState = {
  step: CHECKOUT_STEPS.AUTH,
  shippingAddress: null,
  isSubmit: false,
};

export const CheckoutStateContext = createContext();
export const CheckoutDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CHECKOUT_STEP":
      return {
        ...state,
        step: action.payload.step
      };
    case "SET_SHIPPING_ADDRESS":
      return {
        ...state,
        shippingAddress: action.payload.shippingAddress
      };
    case "SET_PAYMENT_INFO":
      return {
        ...state,
        paymentInfo: action.payload.paymentInfo
      };
    case "SUBMIT_REQUEST":
      return {
        ...state,
        isSubmit: false,
        orderStatus: null,
      };
    case "SUBMIT_SUCCESS":
      return {
        ...state,
        isSubmit: true,
        order: action.payload.info.details,
        orderStatus: action.payload.info.status,
      };
    case "SUBMIT_FAILURE":
      return {
        ...state,
        isSubmit: true,
        order: null,
        orderStatus: null,
      };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

const CheckoutProvider = ({ children }) => {
  const [shippingAddressState, setShippingAddressState] = useSessionStorage("shipping", null);
  const [paymentInfoState, setPaymentInfoState] = useSessionStorage("payment", null);
  const persistedCheckoutState = {
    ...initialState,
    shippingAddress: shippingAddressState || null,
    paymentInfo: paymentInfoState || null
  };
  const [state, dispatch] = useReducer(reducer, persistedCheckoutState);

  useEffect(() => {
    setShippingAddressState(state.shippingAddress);
    setPaymentInfoState(state.paymentInfo);
  }, [state.shippingAddress, state.paymentInfo]);
  return (
    <CheckoutDispatchContext.Provider value={dispatch}>
      <CheckoutStateContext.Provider value={state}>
        {children}
      </CheckoutStateContext.Provider>
    </CheckoutDispatchContext.Provider>
  );
};

export const setCheckoutStep = (dispatch, step) => {
  return dispatch({
    type: "SET_CHECKOUT_STEP",
    payload: {
      step
    }
  });
};

export const saveShippingAddress = (dispatch, shippingAddress) => {
  dispatch({
    type: "SET_SHIPPING_ADDRESS",
    payload: {
      shippingAddress
    }
  });
  return setCheckoutStep(dispatch, CHECKOUT_STEPS.PAYMENT);
};

export const savePaymentInfo = (dispatch, paymentInfo) => {
  dispatch({
    type: "SET_PAYMENT_INFO",
    payload: {
      paymentInfo
    }
  });
  return setCheckoutStep(dispatch, CHECKOUT_STEPS.PAYMENT);
};

export const orderPlacementInfo = (dispatch, shipping, payment, items, toTest = false) => {
  dispatch({
    type: "SUBMIT_REQUEST"
  });
  const url =
    "https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json";
    // "http://apicoveragetool.com/shop/PlaceOrder";
  axios
    .post(url, {
      shipping,
      payment,
      items,
    })
    .then((response) => {
      return dispatch({
        type: "SUBMIT_SUCCESS",
        payload: {
          details: (response.data) || order.data || { shipping, payment, items },
        }
      });
    })
    .catch((error) => {
      console.error(error);
      if (toTest) {
        return dispatch({
          type: "SUBMIT_SUCCESS",
          payload: {
            info: order.data || { shipping, payment, items },
          }
        });
      } else {
        return dispatch({
          type: "SUBMIT_FAILURE",
        });
      }
      
    });
};

export default CheckoutProvider;
