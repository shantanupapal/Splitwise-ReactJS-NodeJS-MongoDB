const initialState = {
    authError: null,
    loggedIn: false,
    user: null,
};

const authenticationReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_ERROR":
            console.log("Login Failed");
            return {
                ...state,
                authError: "Login Failed",
                loggedIn: false,
                user: null,
            };
        case "LOGIN_NOT_SUCCESS":
            console.log("Login Failed Incorrect Username or Password");
            return {
                ...state,
                authError: "Incorrect Username or Password",
                loggedIn: false,
                user: null,
            };
        case "LOGIN_SUCCESS":
            // alert("login sucess");
            console.log("Login Success");
            return {
                ...state,
                authError: null,
                loggedIn: true,
                user: action.payload,
            };

        case "SIGNOUT_SUCCESS":
            console.log("Signout Success");
            return {
                ...state,
                authError: null,
                loggedIn: false,
                user: null,
            };
        case "SIGNUP_SUCCESS":
            console.log("SignUp success");
            return {
                ...state,
                authError: null,
                loggedIn: true,
                user: action.payload,
            };
        case "SIGNUP_FAILED":
            console.log("SignUp Error");
            return {
                ...state,
                authError: "Email already exists. Please enter another email",
                loggedIn: false,
                user: null,
            };

        default:
            return state;
    }
};

export default authenticationReducer;
