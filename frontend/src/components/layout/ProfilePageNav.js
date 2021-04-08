import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/loginActions";
import logo2 from "../../images/logo2.svg";
import "../../App.css";

class ProfilePageNav extends Component {
    // const username = document.cookie.value;
    // console.log("USER:");
    // console.log(username);
    // console.log("PROPS _ ");
    // console.log(props);

    render() {
        const user = localStorage.getItem("name");
        return (
            <nav className="navbar fixed-top mainNavBar">
                <div className="container-fluid">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-12 col-md-10 mainNav_img ">
                                <Link to="/Login">
                                    <img src={logo2} alt="" />
                                </Link>
                            </div>
                            <div className="col-6 col-md-2 ">
                                <Link to="/Center" className="userNameNavBar">
                                    Home
                                </Link>
                                <Link
                                    to="/ProfilePage"
                                    className="userNameNavBar"
                                >
                                    {user}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => {
            dispatch(signOut());
        },
    };
};

const mapStateToProps = (state) => {
    return {
        user: state.auth.user.name,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePageNav);
