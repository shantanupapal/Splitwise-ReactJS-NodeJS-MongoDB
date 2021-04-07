import React, { Component } from "react";
import Dashboard from "./dashboard/Dashboard";
import LeftSideBar from "./layout/LeftSideBar";
import MainNavbar from "./layout/MainNavbar";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Axios from "axios";
import backServer from ".././webConfig";

class Center extends Component {
    componentDidMount = () => {
        // const { loggedIn } = this.props;
        const name = localStorage.getItem("name");
        if (localStorage.getItem("user_id") === "undefined") {
            Axios.post(`${backServer}/senduserid`, { name: name })
                .then((response) => {
                    console.log("USED- ID: ", response.data);
                    localStorage.setItem("user_id", response.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };
    render() {
        // console.log("Props");
        // console.log(this.props);
        const { loggedIn } = this.props;
        if (!loggedIn) return <Redirect to="/Login" />;

        return (
            <div>
                <MainNavbar />
                <div className="container-fluid text-center">
                    <div className="row content align-items-center">
                        <div className="col-xl-3">
                            <LeftSideBar />
                        </div>
                        <div
                            className="col-xl-5"
                            style={{
                                boxShadow: "0 0 12px rgb(0 0 0 / 20%)",
                                height: "100vh",
                            }}
                        >
                            <Dashboard />
                        </div>
                        <div className="col-xl-4"></div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    // console.log("This is State ");
    // console.log(state);
    return {
        loggedIn: state.auth.loggedIn,
    };
};

export default connect(mapStateToProps, null)(Center);
