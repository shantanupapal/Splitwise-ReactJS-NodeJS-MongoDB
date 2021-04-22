import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import LandingPage from "./components/landing/LandingPage";
import Login from "./components/authorization/Login";
import SignUp from "./components/authorization/SignUp";
import Center from "./components/Center";
import ProfilePage from "./components/dashboard/ProfilePage";
import NewGroup from "./components/dashboard/NewGroup";
import MyGroupsCenter from "./components/MyGroupsCenter";
import GroupById from "./components/dashboard/GroupById";
import RecentActivity from "./components/dashboard/RecentActivity";
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
                <Route path="/ProfilePage" component={ProfilePage} />
                <Route path="/NewGroup" component={NewGroup} />
                <Route
                    exact
                    path="/MyGroupsCenter"
                    component={MyGroupsCenter}
                />
                <Route
                    exact
                    path="/groups/:group_id"
                    component={GroupById}
                ></Route>
                <Route path="/RecentActivity" component={RecentActivity} />
            </Switch>
        );
    }
}
//Export The Main Component
export default Main;
