import MainNavbar from "../layout/MainNavbar";
import "../../App.css";
import centerlogo from "../../images/centerlogo.svg";
import React, { Component } from "react";
import { connect } from "react-redux";
import { logIn } from "../../store/actions/loginActions";
import { Redirect } from "react-router-dom";

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

        if (loggedIn) {
            localStorage.setItem("user_id", user.user_id);
            localStorage.setItem("name", user.name);
            localStorage.setItem("email", user.email);
            localStorage.setItem("phone", user.phone);
            localStorage.setItem("currency", user.currency);
            localStorage.setItem("language", user.language);
            localStorage.setItem("timezone", user.timezone);
            localStorage.setItem("profilephoto", user.profilephoto);
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
