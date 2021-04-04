import React from "react";
import { Link } from "react-router-dom";
import logo2 from "../../images/logo2.svg";
import "../../App.css";
const SignedOutNav = () => {
    return (
        <nav className="navbar fixed-top mainNavBar">
            <div className="container-fluid">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-12 col-md-10 mainNav_img ">
                            <Link to="/">
                                <img src={logo2} alt="" />
                            </Link>
                        </div>
                        <div className="col-6 col-md-2 ">
                            <Link to="/Login" className="mainNavLogin_name">
                                <span>Log in</span>
                            </Link>
                            <span className="or">or</span>
                            <Link to="/SignUp" className="mainNavSignup_name">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default SignedOutNav;
