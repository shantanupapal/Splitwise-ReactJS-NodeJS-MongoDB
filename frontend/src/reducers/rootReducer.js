import authenticationReducer from "./authenticationReducer";
import signupReducer from "./signupReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    auth: authenticationReducer,
    // signup: signupReducer,
});

export default rootReducer;
