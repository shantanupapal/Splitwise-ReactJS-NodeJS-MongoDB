import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import LandingPage from "./components/landing/LandingPage";

//Create a Main Component
class Main extends Component {
    render() {
        return (
            <Switch>
                {/*Render Different Component based on Route*/}
                <Route exact path="/" component={LandingPage} />
            </Switch>
        );
    }
}
//Export The Main Component
export default Main;
