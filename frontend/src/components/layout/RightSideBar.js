import React, { Component } from "react";
import Axios from "axios";
import backServer from "../../webConfig";
import swal from "sweetalert";

class RightSideBar extends Component {
    state = { borrowers_balances: [], payers_balances: [] };

    componentDidMount = () => {
        const group_id = parseInt(localStorage.getItem("group_id"));

        const payers_balances = [];
        const borrowers_balances = [];
        // console.log(group_id);
        Axios.post(`${backServer}/getgroupbalancedetails`, {
            group_id: group_id,
        })
            .then((response) => {
                console.log("All balances: ", response.data);
                response.data.forEach((balance) => {
                    if (parseInt(balance[2]) < 0) {
                        borrowers_balances.push([balance[0], balance[2]]);
                    }
                    if (balance[2] > 0) {
                        payers_balances.push([balance[0], balance[2]]);
                    }
                });

                this.setState({
                    borrowers_balances: borrowers_balances,
                    payers_balances: payers_balances,
                });

                console.log(borrowers_balances);
                console.log(payers_balances);
            })
            .catch((err) => {
                console.log("Error: ", err);
            });
    };
    render() {
        const currency = localStorage.getItem("currency").split(" ")[0];
        const borrowers_balances = this.state.borrowers_balances;
        const payers_balances = this.state.payers_balances;
        const payers = payers_balances.length ? (
            payers_balances.map((payer) => {
                return (
                    <div
                        key={payer[0]}
                        style={{
                            padding: "7px 13px 7px 13px",
                            marginLeft: "2px",
                            textAlign: "left",
                            borderBottom: "1px solid #eee",
                        }}
                    >
                        <span style={{ fontSize: "20px" }}>{payer[0]}</span>
                        <br />
                        <span
                            style={{
                                fontSize: "17px",
                                lineHeight: "20px",
                                color: "#5bc5a7",
                                paddingLeft: "45px",
                            }}
                        >
                            is owed
                        </span>{" "}
                        <span
                            style={{
                                fontSize: "20px",
                                color: "#5bc5a7",
                                fontWeight: "bold",
                            }}
                        >
                            {currency}
                            {Math.abs(payer[1]).toFixed(2)}
                        </span>
                    </div>
                );
            })
        ) : (
            <div></div>
        );
        const borrowers = borrowers_balances.length ? (
            borrowers_balances.map((borrower) => {
                return (
                    <div
                        key={borrower[0]}
                        style={{
                            padding: "7px 13px 7px 13px",
                            marginLeft: "2px",
                            textAlign: "left",
                            borderBottom: "1px solid #eee",
                        }}
                    >
                        <span style={{ fontSize: "20px" }}>{borrower[0]}</span>
                        <br />
                        <span
                            style={{
                                fontSize: "17px",
                                lineHeight: "20px",
                                color: "#ff652f",
                                paddingLeft: "45px",
                            }}
                        >
                            owes
                        </span>{" "}
                        <span
                            style={{
                                fontSize: "20px",
                                color: "#ff652f",
                                fontWeight: "bold",
                            }}
                        >
                            {currency}
                            {Math.abs(borrower[1]).toFixed(2)}
                        </span>
                    </div>
                );
            })
        ) : (
            <div></div>
        );

        return (
            <div class="container">
                <div
                    style={{
                        color: "#999",
                        fontSize: "20px",
                        fontWeight: "bold",
                    }}
                >
                    GROUP BALANCES
                </div>
                {payers}
                {borrowers}
            </div>
        );
    }
}

export default RightSideBar;

// const RightSideBar = () => {

//     return (
//         <div class="container">
//             <div
//                 style={{ color: "#999", fontSize: "20px", fontWeight: "bold" }}
//             >
//                 GROUP BALANCES
//             </div>
//         </div>
//     );
// };

// export default RightSideBar;
