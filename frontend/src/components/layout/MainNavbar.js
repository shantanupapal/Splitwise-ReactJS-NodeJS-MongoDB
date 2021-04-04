import React from "react";
import "../../App.css";
import SignedInNav from "./SignedInNav";
import SignedOutNav from "./SignedOutNav";
import { connect } from "react-redux";
const MainNavbar = (props) => {
    const { loggedIn } = props;
    const links = loggedIn ? <SignedInNav /> : <SignedOutNav />; // console.log(loggedIn);
    return <header>{links}</header>;
};

const mapStateToProps = (state) => {
    console.log(state);
    return {
        loggedIn: state.auth.loggedIn,
    };
};

export default connect(mapStateToProps)(MainNavbar);
