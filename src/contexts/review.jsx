import React, { useReducer, createContext, useEffect } from "react";
import useSessionStorage from "../hooks/useSessionStorage";
import { review } from './mockData';
import axios from "axios";


export const ReviewStateContext = createContext();
export const ReviewDispatchContext = createContext();

const initialState = {
  review: [],
  isLoading: false,
  isLoaded: false
};
const reducer = (state, action) => {
  switch (action.type) {
    case "GET_CHECKOUT_ORDER_REQUEST":
      return {
        ...state,
        isLoading: true,
        isLoaded: false,
        review: []
      };
    case "GET_CHECKOUT_ORDER_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        review: action.payload.review
      };
    case "GET_CHECKOUT_ORDER_FAILURE":
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        review: []
      };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

const ReviewProvider = ({ children }) => {
  const persistedCheckoutState = {
    ...initialState,
  };
  const [state, dispatch] = useReducer(reducer, persistedCheckoutState);
  

  return (
    <ReviewDispatchContext.Provider value={dispatch}>
      <ReviewStateContext.Provider value={state}>
        {children}
      </ReviewStateContext.Provider>
    </ReviewDispatchContext.Provider>
  );
};


export const getCheckoutOrder = (dispatch) => {
  dispatch({
    type: "GET_CHECKOUT_ORDER_REQUEST"
  });
  const url =
  // "https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json"; // to mock test
  "http://apicoveragetool.com/shop/ReviewDetails";
  axios
    .get(url)
    .then((response) => {
      dispatch({
        type: "GET_CHECKOUT_ORDER_SUCCESS",
        payload: {
          review: response.data  
          // review: review.data, // to mock test
        }
      });
    })
    .catch((error) => {
      console.error(error);
      dispatch({
        type: "GET_CHECKOUT_ORDER_FAILURE"
      });
    });
};

export default ReviewProvider;
