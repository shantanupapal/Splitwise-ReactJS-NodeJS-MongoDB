import MainNavbar from "../layout/MainNavbar";
import "../../App.css";
import centerlogo from "../../images/centerlogo.svg";
import React, { Component } from "react";
import { connect } from "react-redux";
import { logIn } from "../../store/actions/loginActions";
import { Redirect } from "react-router-dom";
import jwt_decode from "jwt-decode";

class Login extends Component {
    state = {
        email: "",
        password: "",
    };

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.logIn(this.state);
    };
    render() {
        const { authError } = this.props;
        const { loggedIn } = this.props;
        const { user } = this.props;

        if (loggedIn && user.length > 0) {
            console.log("token ", user);
            localStorage.setItem("token", user);

            const decode = jwt_decode(user.split(" ")[1]);
            localStorage.setItem("user_id", decode.user_id);
            localStorage.setItem("name", decode.name);
            localStorage.setItem("email", decode.email);
            localStorage.setItem("phone", decode.phone);
            localStorage.setItem("currency", decode.currency);
            localStorage.setItem("language", decode.language);
            localStorage.setItem("timezone", decode.timezone);
            localStorage.setItem("profilephoto", decode.profilephoto);
            return <Redirect to="/Center" />;
        }
        return (
            <div>
                <MainNavbar />
                <div className="container h-100 d-flex justify-content-center loginMain">
                    <div className="row align-items-center">
                        <div className="col forMainLogo">
                            <img src={centerlogo} alt="" />
                        </div>
                        <div className="col">
                            <div className="welcomeName">
                                <p>Welcome to Splitwise</p>{" "}
                            </div>
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group formForLogin">
                                    <label htmlFor="email">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="form-group formForLogin">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-danger submitButton"
                                >
                                    Log in
                                </button>
                                <div>
                                    {authError ? (
                                        <p className="logInError">
                                            {authError}
                                        </p>
                                    ) : null}
                                    {loggedIn ? <p>LoggedIn</p> : null}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        authError: state.auth.authError,
        loggedIn: state.auth.loggedIn,
        user: state.auth.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logIn: (credentials) => dispatch(logIn(credentials)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
