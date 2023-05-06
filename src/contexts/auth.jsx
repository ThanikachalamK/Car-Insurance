import React, { useReducer, createContext, useEffect } from "react";
import _get from "lodash.get";
import axios from "axios";
import useSessionStorage from "../hooks/useSessionStorage";

const initialState = {
  isLoggedIn: false,
  user: null,
  isLoggingIn: false
};

export const AuthStateContext = createContext();
export const AuthDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        isLoggingIn: true
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload.user,
        isLoggingIn: false
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        isLoggingIn: false
      };
    case "LOGOUT_SUCCESS":
      return {
        ...state,
        ...initialState
      };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

export const signIn = (dispatch, userData, toTest = false) => {
  sessionStorage.setItem("user", JSON.stringify(userData));
  dispatch({
    type: "LOGIN_REQUEST"
  });
  const url =
    // "https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json"; // to mock test
    "http://apicoveragetool.com/shop/Signin";
  axios
    .post(url, {
      userData
    })
    .then((response) => {
      return dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: (response.data.userData) || userData,
        }
      });
    })
    .catch((error) => {
      console.error(error);
      if (toTest) {
        return dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: userData,
          }
        });
      } else {
        return dispatch({
          type: "LOGIN_FAILURE",
        });
      }
      
    });
};



export const signOut = (dispatch) => {
  sessionStorage.setItem("user", '');
  dispatch({
    type: "LOGIN_REQUEST"
  });
  const url =
    // "https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json"; // to mock test
    "http://apicoveragetool.com/shop/Signout";
  axios
    .post(url, {
      user: sessionStorage.getItem("user"),
    })
    .then((response) => {
      sessionStorage.clear();
      return dispatch({
        type: "LOGOUT_SUCCESS"
      });
    })
    .catch((error) => {
      console.error(error);
      return dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: sessionStorage.getItem("user"),
        }
      });
    });
};

const AuthProvider = ({ children }) => {
  const [persistedUser, setPersistedUser] = useSessionStorage("user", null);
  const persistedUserState = {
    ...initialState,
    user: persistedUser,
    isLoggedIn: _get(persistedUser, "username", "").length > 0
  };
  const [state, dispatch] = useReducer(reducer, persistedUserState);

  useEffect(() => {
    setPersistedUser(state.user);
  }, [state.isLoggedIn]);

  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
};

export default AuthProvider;
