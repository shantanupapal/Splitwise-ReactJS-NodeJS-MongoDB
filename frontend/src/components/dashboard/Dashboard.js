import React, { Component } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import backServer from "../../webConfig";
import profilePhoto from "../../images/profilePhoto.png";
import swal from "sweetalert";
class Dashboard extends Component {
    state = {
        i_owe: [],
        they_owe: [],
    };
    componentDidMount = () => {
        localStorage.setItem("i_owe", JSON.stringify(0));
        localStorage.setItem("they_owe", JSON.stringify(0));
        const user_id = localStorage.getItem("user_id");
        console.log("userdid: ", user_id);
        Axios.post(`${backServer}/dashboarddetails`, { user_id: user_id })
            .then((response) => {
                console.log("got response 200", response.data.i_owe);
                console.log("got response 200", response.data.they_owe);
                this.setState({
                    i_owe: response.data.i_owe,
                    they_owe: response.data.they_owe,
                });
                localStorage.setItem(
                    "i_owe",
                    JSON.stringify(response.data.i_owe)
                );
                localStorage.setItem(
                    "they_owe",
                    JSON.stringify(response.data.they_owe)
                );
                // if (response.status === 201) {
                //     console.log("got response 201", response.data.they_owe);
                //     this.setState({
                //         they_owe: response.data.they_owe,
                //     });

                //     localStorage.setItem(
                //         "they_owe",
                //         JSON.stringify(response.data.they_owe)
                //     );
                //     localStorage.setItem(
                //         "i_owe",
                //         JSON.stringify(response.data.i_owe)
                //     );
                // } else if (response.status === 202) {
                //     console.log("got response 202 ", response.data.i_owe);
                //     this.setState({
                //         i_owe: response.data.i_owe,
                //     });

                //     localStorage.setItem(
                //         "i_owe",
                //         JSON.stringify(response.data.i_owe)
                //     );
                //     localStorage.setItem(
                //         "they_owe",
                //         JSON.stringify(response.data.they_owe)
                //     );
                // } else if (response.status === 200) {
                //     console.log("got response 200", response.data.i_owe);
                //     console.log("got response 200", response.data.they_owe);
                //     this.setState({
                //         i_owe: response.data.i_owe,
                //         they_owe: response.data.they_owe,
                //     });
                //     localStorage.setItem(
                //         "i_owe",
                //         JSON.stringify(response.data.i_owe)
                //     );
                //     localStorage.setItem(
                //         "they_owe",
                //         JSON.stringify(response.data.they_owe)
                //     );
                // } else {
                //     localStorage.setItem("i_owe", JSON.stringify(0));
                //     localStorage.setItem("they_owe", JSON.stringify(0));
                // }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    handleSettle = () => {
        const i_owe = JSON.parse(localStorage.getItem("i_owe"));
        const owers = [];
        console.log("iowe", i_owe);
        // const they_owe = localStorage.getItem("they_owe");
        if (i_owe.length === 0) {
            swal(
                "You are not supposed to pay anyone. Ask others to settle up."
            );
        } else {
            i_owe.forEach((ower) => {
                owers.push(ower[0]);
            });
            console.log("owers", owers);
            const user_id = parseInt(localStorage.getItem("user_id"));
            console.log("user to settle: ", user_id);
            Axios.post(`${backServer}/settleup`, {
                user_id: user_id,
                owers: owers,
            })
                .then((response) => {
                    // this.forceUpdate();
                    window.location.reload();
                    // localStorage.setItem(("i_owe", 0));
                    // localStorage.setItem(("they_owe", 0));
                })
                .catch((err) => {
                    console.log("Error: ", err);
                });
        }
    };

    render() {
        const currency_ls = localStorage.getItem("currency");
        const currency = currency_ls.split(" ")[0];
        const i_owe_all = this.state.i_owe;
        const they_owe_all = this.state.they_owe;
        // const they_owe_names = [];
        // const i_owe_names = [];
        // const they_owe = [];
        // const i_owe = [];
        // they_owe_all.forEach((they) => {
        //     // console.log(they[2]);
        //     if (they_owe_names.includes(they[2])) {
        //         // console.log("yes");
        //         // console.log(they_owe.indexOf(they));
        //         they_owe.splice(they_owe.indexOf(they) + 1, 1, they);
        //     } else {
        //         they_owe_names.push(they[2]);
        //         they_owe.push(they);
        //         // console.log("they owe names: ", they_owe);
        //         // console.log("not");
        //     }
        // });

        // i_owe_all.forEach((they) => {
        //     // console.log(they[2]);
        //     if (i_owe_names.includes(they[2])) {
        //         // console.log("yes");
        //         // console.log(they_owe.indexOf(they));
        //         i_owe.splice(i_owe.indexOf(they) + 1, 1, they);
        //     } else {
        //         i_owe_names.push(they[2]);
        //         i_owe.push(they);
        //         // console.log("they owe names: ", i_owe);
        //         // console.log("not");
        //     }
        // });

        let i_owe_total = 0;
        let they_owe_total = 0;
        console.log(i_owe_all);
        console.log(they_owe_all);
        const show_i_owe = i_owe_all.length ? (
            i_owe_all.map((ower) => {
                console.log(ower[0]);

                return (
                    <div
                        key={ower[0]}
                        style={{
                            padding: "7px 13px 7px 13px",
                            marginLeft: "2px",
                            textAlign: "right",
                            borderBottom: "1px solid #eee",
                        }}
                    >
                        <img
                            src={profilePhoto}
                            alt=""
                            style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "16px",
                                marginRight: "15px",
                            }}
                        />
                        <span style={{ fontSize: "20px" }}>{ower[2]}</span>
                        <br />
                        <span
                            style={{
                                fontSize: "17px",
                                lineHeight: "20px",
                                color: "#ff652f",
                                paddingLeft: "45px",
                            }}
                        >
                            you owe
                        </span>{" "}
                        <span
                            style={{
                                fontSize: "20px",
                                color: "#ff652f",
                                fontWeight: "bold",
                            }}
                        >
                            {currency} {Math.abs(ower[1]).toFixed(2)}
                        </span>
                    </div>
                );
            })
        ) : (
            <div
                style={{
                    color: "#999",
                    marginTop: "20px",
                    fontSize: "16px",
                }}
            >
                You do not owe anything
            </div>
        );

        const show_they_owe = they_owe_all.length ? (
            they_owe_all.map((ower) => {
                // console.log(ower[0]);
                // if (ower[2] !== "Logan Griffo" || ower[1] === 6.25) {
                return (
                    <div
                        key={ower[0]}
                        style={{
                            padding: "7px 13px 7px 13px",
                            marginLeft: "2px",
                            textAlign: "left",
                            borderBottom: "1px solid #eee",
                        }}
                    >
                        <img
                            src={profilePhoto}
                            alt=""
                            style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "16px",
                                marginRight: "15px",
                            }}
                        />
                        <span style={{ fontSize: "20px" }}>{ower[2]}</span>
                        <br />
                        <span
                            style={{
                                fontSize: "17px",
                                lineHeight: "20px",
                                color: "#5bc5a7",
                                paddingLeft: "45px",
                            }}
                        >
                            owes you
                        </span>{" "}
                        <span
                            style={{
                                fontSize: "20px",
                                color: "#5bc5a7",
                                fontWeight: "bold",
                            }}
                        >
                            {currency} {Math.abs(ower[1]).toFixed(2)}
                        </span>
                    </div>
                );
                // }
            })
        ) : (
            <div
                className="container"
                style={{
                    color: "#999",
                    marginTop: "20px",
                    fontSize: "16px",
                }}
            >
                Other's owe nothing to you
            </div>
        );

        i_owe_all.forEach((ower) => {
            i_owe_total = i_owe_total + ower[1];
        });
        they_owe_all.forEach((ower) => {
            they_owe_total = they_owe_total + ower[1];
        });

        return (
            <div className="centerOfPage">
                <div className="container dashboardHeader">
                    <div className="row align-items-center">
                        <div className="col-sm-3">
                            <h2>Dashboard</h2>
                        </div>
                        <div className="col-sm-6"></div>
                        <div className="col-sm-3">
                            <Link
                                onClick={this.handleSettle}
                                className="dashboardSettleUp"
                            >
                                Settle up
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="container dashboardHeader2">
                    <div className="row align-items-center">
                        <div
                            className="col"
                            style={{
                                borderRight: "1px solid #ddd",
                                color: "#999",
                                fontSize: "16px",
                            }}
                        >
                            {" "}
                            you owe <br />
                            <div>
                                {currency} {Math.abs(i_owe_total).toFixed(2)}
                            </div>
                        </div>

                        <div
                            className="col"
                            style={{
                                color: "#999",
                                fontSize: "16px",
                            }}
                        >
                            {" "}
                            you are owed{" "}
                            <div>
                                {currency} {Math.abs(they_owe_total).toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row align-items-top">
                        <div
                            className="col"
                            style={{
                                borderRight: " 2px solid #eee",
                            }}
                        >
                            <div
                                style={{
                                    float: "left",
                                    color: "#999999",
                                    fontWeight: "bold",
                                    padding: "10px",
                                }}
                            >
                                YOU OWE
                            </div>
                            <br />
                            <div>{show_i_owe}</div>
                        </div>
                        <div className="col">
                            <div
                                style={{
                                    float: "right",
                                    color: "#999999",
                                    fontWeight: "bold",
                                    padding: "10px",
                                }}
                            >
                                YOU ARE OWED
                            </div>
                            <br />
                            <div>{show_they_owe}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;
