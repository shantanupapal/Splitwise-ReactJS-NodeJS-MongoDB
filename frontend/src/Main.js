import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import LandingPage from "./components/landing/LandingPage";
import Login from "./components/authorization/Login";
import SignUp from "./components/authorization/SignUp";
import Center from "./components/Center";
//Create a Main Component
class Main extends Component {
    render() {
        return (
            <Switch>
                {/*Render Different Component based on Route*/}
                <Route exact path="/" component={LandingPage} />
                <Route path="/Login" component={Login} />
                <Route path="/SignUp" component={SignUp} />
                <Route path="/Center" component={Center} />
            </Switch>
        );
    }
}
//Export The Main Component
export default Main;
