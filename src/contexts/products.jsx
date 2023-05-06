import React, { useReducer, createContext } from "react";
import { prodTypes, product } from './mockData'; // to mock test
import axios from "axios";

const initialState = {
  products: null,
  isLoading: false,
  isLoaded: false
};

export const ProductsStateContext = createContext();
export const ProductsDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "GET_PRODUCTS_REQUEST":
      return {
        ...state,
        isLoading: true,
        isLoaded: false
      };
    case "GET_PRODUCTS_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        products: action.payload.products
      };
    case "GET_PRODUCTS_FAILURE":
      return {
        ...state,
        products: null,
        isLoading: false,
        isLoaded: false
      };
    case "GET_PRODUCTS_TYPE_REQUEST":
      return {
        ...state,
        isLoading: true,
        isLoaded: false
      };
    case "GET_PRODUCTS_TYPE_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        productsTypes: action.payload.productsTypes
      };
    case "GET_PRODUCTS_TYPE_FAILURE":
      return {
        ...state,
        products: null,
        productsTypes: null,
        isLoading: false,
        isLoaded: false
      };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

const ProductsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ProductsDispatchContext.Provider value={dispatch}>
      <ProductsStateContext.Provider value={state}>
        {children}
      </ProductsStateContext.Provider>
    </ProductsDispatchContext.Provider>
  );
};

export const getProducts = (dispatch) => {
  dispatch({
    type: "GET_PRODUCTS_REQUEST"
  });
  const url =
  // "https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json"; // to mock test
  "http://apicoveragetool.com/shop/Catalog";

  axios
    .get(url)
    .then((response) => {
      dispatch({
        type: "GET_PRODUCTS_SUCCESS",
        payload: {
          products: response.data
          // products: product.data, // to mock test
        }
      });
    })
    .catch((error) => {
      console.error(error);
      dispatch({
        type: "GET_PRODUCTS_FAILURE"
      });
    });
};

export const getProductsType = (dispatch) => {
  dispatch({
    type: "GET_PRODUCTS_TYPE_REQUEST"
  });
  const url =
  // "https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json"; // to mock test
   "http://apicoveragetool.com/shop/InsuranceDetails";
  axios
    .get(url)
    .then((response) => {
      dispatch({
        type: "GET_PRODUCTS_TYPE_SUCCESS",
        payload: {
          productsTypes: response.data
          // productsTypes: prodTypes.data, // to mock test
        }
      });
    })
    .catch((error) => {
      console.error(error);
      dispatch({
        type: "GET_PRODUCTS_TYPE_FAILURE"
      });
    });
};

export default ProductsProvider;
