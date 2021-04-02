import authenticationReducer from "./authenticationReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    auth: authenticationReducer,
    // signup: signupReducer,
});

export default rootReducer;
