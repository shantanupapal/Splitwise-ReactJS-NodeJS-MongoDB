import React, { Component } from "react";

class Activities extends Component {
    // state = {
    //     activities: this.props.activities,
    //     loading: this.props.loading,
    // };
    render() {
        if (this.props.loading) {
            return <h2>Loading ...</h2>;
        }
        const all_activities = this.props.activities;
        const currency = localStorage.getItem("currency").split(" ")[0];
        const activities = all_activities.length ? (
            all_activities.map((activity) => {
                if (activity[5] === "payer") {
                    return (
                        <div
                            className="container"
                            style={{
                                borderBottom: "1px solid #eee",
                                lineHeight: "30px",
                                padding: "5px",
                                background: "#eee",
                                margin: "5px",
                            }}
                        >
                            <div className="row align-items-center">
                                <div
                                    className="col-sm-8"
                                    style={{ borderRight: "1px solid #aaa" }}
                                >
                                    <div>
                                        <span
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "20px",
                                            }}
                                        >
                                            You
                                        </span>{" "}
                                        added{" "}
                                        <span
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "20px",
                                            }}
                                        >
                                            "{activity[2]}"
                                        </span>{" "}
                                        to{" "}
                                        <span
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "20px",
                                            }}
                                        >
                                            "{activity[1]}"
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "#999",
                                        }}
                                    >
                                        {activity[0].split("T")[0]}
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div>
                                        <span
                                            style={{
                                                color: "#56d4b9",
                                                fontSize: "15px",
                                            }}
                                        >
                                            You get
                                        </span>{" "}
                                        <span
                                            style={{
                                                color: "#56d4b9",
                                                fontSize: "18px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {currency}
                                            {Math.abs(activity[4]).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                } else if (activity[5] === "borrower") {
                    return (
                        <div
                            className="container"
                            style={{
                                borderBottom: "1px solid #eee",
                                lineHeight: "30px",
                                padding: "5px",
                                background: "#eee",
                                margin: "5px",
                            }}
                        >
                            <div className="row align-items-center">
                                <div
                                    className="col-sm-8"
                                    style={{ borderRight: "1px solid #aaa" }}
                                >
                                    <div>
                                        <span
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "20px",
                                            }}
                                        >
                                            {activity[6]}
                                        </span>{" "}
                                        added{" "}
                                        <span
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "20px",
                                            }}
                                        >
                                            "{activity[2]}"
                                        </span>{" "}
                                        to{" "}
                                        <span
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "20px",
                                            }}
                                        >
                                            "{activity[1]}"
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "#aaa",
                                        }}
                                    >
                                        {activity[0].split("T")[0]}
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div>
                                        <span
                                            style={{
                                                color: "#ff652f",
                                                fontSize: "15px",
                                            }}
                                        >
                                            You owe
                                        </span>{" "}
                                        <span
                                            style={{
                                                color: "#ff652f",
                                                fontSize: "18px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {currency}
                                            {Math.abs(activity[4]).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
            })
        ) : (
            <div>No recent Activities</div>
        );
        return <div>{activities}</div>;
    }
}

export default Activities;
