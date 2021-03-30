import Axios from "axios";
import cookie from "react-cookies";
import backServer from "../../webConfig";

export const logIn = (credentials) => {
    Axios.defaults.withCredentials = true;
    return (dispatch, getState) => {
        Axios.post(`${backServer}/login`, {
            email: credentials.email,
            password: credentials.password,
        })
            .then((response) => {
                console.log(response.status);
                if (response.status === 200) {
                    // console.log(response.data[0].name);
                    dispatch({
                        type: "LOGIN_SUCCESS",
                        payload: response.data,
                    });
                }
                if (response.status === 201) {
                    dispatch({ type: "LOGIN_NOT_SUCCESS" });
                }
            })
            .catch((err) => {
                console.log(err);
                dispatch({ type: "LOGIN_ERROR", err });
            });
    };
};

export const signOut = () => {
    window.localStorage.clear();
    return (dispatch, getState) => {
        // Axios.get(`${backServer}/logout`).then((response) => {
        // if (response.status === 200) {
        localStorage.clear();
        cookie.remove("cookie", { path: "/" });
        dispatch({ type: "SIGNOUT_SUCCESS" });
        // }
        // });
    };
};

export const signUp = (newAccount) => {
    Axios.defaults.withCredentials = true;
    return (dispatch, getState) => {
        Axios.post(`${backServer}/signup`, {
            name: newAccount.name,
            email: newAccount.email,
            password: newAccount.password,
        })
            .then((response) => {
                console.log("Response from db ");
                console.log(response);
                if (response.status === 200) {
                    // console.log(response.data[0].name);
                    dispatch({
                        type: "SIGNUP_SUCCESS",
                        payload: response.data,
                    });
                }
            })
            .catch((err) => {
                dispatch({ type: "SIGNUP_FAILED", err });
            });
    };
};
