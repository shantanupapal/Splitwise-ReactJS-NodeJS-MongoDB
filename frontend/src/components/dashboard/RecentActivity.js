/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import LeftSideBar from "../layout/LeftSideBar";
import MainNavbar from "../layout/MainNavbar";
import { Redirect } from "react-router-dom";
import Axios from "axios";
import backServer from "../../webConfig";
import Activities from "./Activities";
import { Pagination } from "./Pagination";
import { useSelector } from "react-redux";

const RecentActivity = () => {
    const loggedIn = useSelector((state) => state.auth.loggedIn);
    if (!loggedIn) return <Redirect to="/Login" />;

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [activitiesPerPage, setActivitiesPerPage] = useState(2);

    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);
            const user_id = localStorage.getItem("user_id");
            Axios.defaults.headers.common[
                "authorization"
            ] = localStorage.getItem("token");

            const res = await Axios.post(`${backServer}/recentactivity`, {
                user_id: user_id,
            });
            setActivities(res.data);
            setLoading(false);
        };

        fetchActivities();
    }, []);

    const changeActivitiesPerPage = (number) => {
        setActivitiesPerPage(number);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const lastActivityIndex = currentPage * activitiesPerPage;
    const firstActivityIndex = lastActivityIndex - activitiesPerPage;
    const currentActivities = activities.slice(
        firstActivityIndex,
        lastActivityIndex
    );

    console.log(activities);
    return (
        <div>
            <MainNavbar />
            <div className="container-fluid text-center">
                <div className="row content align-items-center">
                    <div className="col-xl-3">
                        <LeftSideBar />
                    </div>
                    <div
                        className="col-xl-6"
                        style={{
                            boxShadow: "0 0 12px rgb(0 0 0 / 20%)",
                            height: "100vh",
                            marginTop: "50px",
                        }}
                    >
                        <div
                            className="container dashboardHeader"
                            style={{ background: "#aaa" }}
                        >
                            <div className="row align-items-center">
                                <div className="col-sm-6">
                                    <h2>Recent Activity</h2>
                                </div>
                                <div className="col-sm-3"></div>
                                <div className="col-sm-3"></div>
                            </div>
                        </div>
                        <Activities
                            activities={currentActivities}
                            loading={loading}
                        />
                        <Pagination
                            activitiesPerPage={activitiesPerPage}
                            totalActivities={activities.length}
                            paginate={paginate}
                            changeActivitiesPerPage={changeActivitiesPerPage}
                        />
                        {/*activities*/}
                    </div>
                    {/** */} <div className="col-xl-3"></div>
                </div>
            </div>
        </div>
    );
};

export default RecentActivity;
