import MainNavbar from "../layout/MainNavbar";
import "../../App.css";
import centerlogo from "../../images/centerlogo.svg";
import React, { Component } from "react";
import { connect } from "react-redux";
import { signUp } from "../../store/actions/loginActions";
import { Redirect } from "react-router-dom";

class SignUp extends Component {
    state = {
        name: "",
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
        console.log(this.state);
        this.props.signUp(this.state);
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
                <div className="container h-100 d-flex justify-content-center signUpMain">
                    <div className="row align-items-center">
                        <div className="col forMainLogo">
                            <img src={centerlogo} alt="" />
                        </div>
                        <div className="col">
                            <div className="welcomeName">
                                <p>Introduce Yourself</p>{" "}
                            </div>
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group formForSignup">
                                    <label htmlFor="name">
                                        Hi there! My name is
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        onChange={this.handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group formForSignup">
                                    <label htmlFor="email">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        onChange={this.handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group formForSignup">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        onChange={this.handleChange}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-danger submitButton"
                                >
                                    Sign up
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
        signUp: (newAccount) => dispatch(signUp(newAccount)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
