import React from "react";
import "../../App.css";
import logo from "../../images/logo.png";
import { Link } from "react-router-dom";
const Navbar = () => {
    return (
        <nav className="navbar fixed-top landingPageNav">
            <div className="container-fluid">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-12 col-md-10 landingPagenNav_img ">
                            <img src={logo} alt="" />
                            <Link to="/" className="nav_name">
                                <span>Splitwise</span>
                            </Link>
                        </div>
                        <div className="col-6 col-md-2 ">
                            <Link to="/Login" className="landingPageLogin_name">
                                <span>Log in</span>
                            </Link>
                            <Link
                                to="/SignUp"
                                className="landingPageSignup_name"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;
