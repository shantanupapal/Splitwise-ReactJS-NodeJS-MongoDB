import React, { Component } from "react";
import LeftSideBar from "../layout/LeftSideBar";
import MainNavbar from "../layout/MainNavbar";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Axios from "axios";
import backServer from "../../webConfig";
import { Modal, Button } from "react-bootstrap";
import noexpenses from "../../images/noexpenses.png";
import swal from "sweetalert";
import RightSideBar from "../layout/RightSideBar";

class GroupById extends Component {
    state = {
        showPopUp: false,
        id: null,
        expense_description: null,
        expense_amount: null,
        members: [],
        all_expenses: [],
    };

    handleClose = () => {
        this.setState({ showPopUp: false });
    };

    handleShow = () => {
        this.setState({ showPopUp: true });
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        console.log("state: ", this.state);
        // swal("Done", "Expense Added");
        //call expenses table to add expense
        const group_id = this.state.id;
        const description = this.state.expense_description;
        const total_amount = this.state.expense_amount;
        const paid_by = parseInt(localStorage.getItem("user_id"));
        const liables = this.state.members;

        Axios.post(`${backServer}/addexpense`, {
            group_id: group_id,
            description: description,
            total_amount: total_amount,
            paid_by: paid_by,
            liables: liables,
        })
            .then((response) => {
                console.log("response: ", response);
                swal("Done", "Expense Added");
            })
            .then(() => {
                // window.location.reload();
            })
            .catch((err) => {
                console.log("Error: ", err);
            });
        //call one_to_one table and adjust expenses
    };

    componentDidMount = () => {
        console.log(this.props);
        let id = this.props.match.params.group_id;
        this.setState({ id: id });

        // //Get all group members
        Axios.post(`${backServer}/getallgroupmembers`, {
            group_id: id,
        })
            .then((response) => {
                console.log("resopnse: ", response.data[0]);
                const members = [];
                response.data[0].members.forEach((member) => {
                    members.push(member._id);
                });
                this.setState({
                    members: members,
                });
            })
            .then(() => {
                // console.log("State: ", this.state);
                // Axios.post(`${backServer}/getgroupexpenses`, {
                //     group_id: id,
                // })
                //     .then((response) => {
                //         console.log("alll expenses: ", response.data);
                //         const all_expenses = [];
                //         response.data.forEach((expense) => {
                //             all_expenses.push([
                //                 expense.fullDate,
                //                 expense.description,
                //                 expense.name,
                //                 expense.total_amount,
                //             ]);
                //         });
                //         this.setState({
                //             all_expenses: all_expenses,
                //         });
                //     })
                //     .catch((error) => {
                //         console.log(error);
                //     });
            })
            .catch((err) => {
                console.log("Error: ", err);
            });
    };

    render() {
        const { loggedIn } = this.props;
        if (!loggedIn) return <Redirect to="/Login" />;
        const groupname = localStorage.getItem("group_name");
        const currency = localStorage.getItem("currency").split(" ")[0];
        const all_expenses = this.state.all_expenses;
        const show_expenses = all_expenses.length ? (
            all_expenses.map((expense) => {
                return (
                    <div
                        className="container"
                        style={{
                            borderBottom: "1px solid #eee",
                            lineHeight: "60px",
                            alignContent: "center",
                            padding: "8px",
                        }}
                    >
                        <div className="row align-items-center">
                            <div
                                className="col-sm-4"
                                style={{
                                    color: "#aaa",
                                    borderRight: "1px solid #eee",
                                }}
                            >
                                {expense[0]}
                            </div>
                            <div
                                className="col-sm-4 d-flex align-items-start"
                                style={{
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                }}
                            >
                                {expense[1]}
                            </div>
                            <div className="col-sm-4">
                                <span style={{ color: "#aaa" }}>
                                    {expense[2]} paid{" "}
                                </span>
                                <span
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {currency}
                                    {expense[3]}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })
        ) : (
            <div className="container" style={{ paddingTop: "15px" }}>
                <div className="row">
                    <div className="col">
                        <img
                            src={noexpenses}
                            alt="No Expenses Added"
                            style={{
                                top: "0",
                                left: "65px",
                                width: "150px",
                            }}
                        />
                    </div>
                    <div className="col">
                        <h2 style={{ fontSize: "28px", lineHeight: "110%" }}>
                            You have not added any expenses yet
                        </h2>
                        <p
                            style={{
                                marginTop: "15px",
                                color: "#999",
                                fontSize: "18px",
                                lineHeight: "24px",
                            }}
                        >
                            To add a new expense, click the orange “Add an
                            expense” button.
                        </p>
                    </div>
                </div>
            </div>
        );

        return (
            <div>
                <MainNavbar />
                <div className="container-fluid text-center">
                    <div className="row content align-items-top">
                        <div className="col-xl-3">
                            <LeftSideBar />
                        </div>
                        <div
                            className="col-xl-6"
                            style={{
                                boxShadow: "0 0 12px rgb(0 0 0 / 20%)",
                                height: "100%",
                                zIndex: "100",
                            }}
                        >
                            <div className="centerOfPage">
                                <div className="container dashboardHeader">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h2>{groupname}</h2>
                                        </div>
                                        <div className="col">
                                            <>
                                                <Button
                                                    variant="danger"
                                                    onClick={this.handleShow}
                                                    style={{
                                                        backgroundColor:
                                                            "#ff652f",
                                                    }}
                                                >
                                                    Add an expense
                                                </Button>

                                                <Modal
                                                    centered
                                                    size="sm"
                                                    show={this.state.showPopUp}
                                                    onHide={this.handleClose}
                                                >
                                                    <Modal.Header
                                                        // closeButton
                                                        className="modalHeader"
                                                    >
                                                        <Modal.Title>
                                                            Add an expense
                                                        </Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <div className="container">
                                                            <form
                                                                onSubmit={
                                                                    this
                                                                        .handleSubmit
                                                                }
                                                            >
                                                                <div className="row">
                                                                    <div className="col">
                                                                        <input
                                                                            type="text"
                                                                            className="expenseDescription"
                                                                            placeholder="Enter a description"
                                                                            style={{
                                                                                fontSize:
                                                                                    "20px",
                                                                                float:
                                                                                    "right",
                                                                                width:
                                                                                    "auto",
                                                                            }}
                                                                            name="expense_description"
                                                                            onChange={
                                                                                this
                                                                                    .handleChange
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="container">
                                                                    <div className="row align-items-center">
                                                                        <div className="col">
                                                                            <span>
                                                                                $
                                                                            </span>
                                                                        </div>
                                                                        <div className="col">
                                                                            <input
                                                                                type="number"
                                                                                step="0.01"
                                                                                class="cost"
                                                                                placeholder="0.00"
                                                                                className="currency"
                                                                                style={{
                                                                                    fontSize:
                                                                                        "30px",
                                                                                    height:
                                                                                        "50px",
                                                                                    lineHeight:
                                                                                        "10px",
                                                                                }}
                                                                                name="expense_amount"
                                                                                onChange={
                                                                                    this
                                                                                        .handleChange
                                                                                }
                                                                            ></input>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        paddingTop:
                                                                            "10px",
                                                                        paddingBottom:
                                                                            "10px",
                                                                    }}
                                                                >
                                                                    Paid by you
                                                                    and split
                                                                    equally
                                                                </div>
                                                                <div className="container">
                                                                    <div className="row align-items-center">
                                                                        <div className="col">
                                                                            {" "}
                                                                            <Button
                                                                                variant="secondary"
                                                                                onClick={
                                                                                    this
                                                                                        .handleClose
                                                                                }
                                                                            >
                                                                                Cancel
                                                                            </Button>
                                                                        </div>
                                                                        <div className="col">
                                                                            <Button
                                                                                variant="success"
                                                                                type="submit"
                                                                                style={{
                                                                                    backgroundColor:
                                                                                        "#1cc29f",
                                                                                    textDecoration:
                                                                                        "None",
                                                                                    boxShadow:
                                                                                        "0 2px 0 0 rgb(55 59 63 / 50%)",
                                                                                }}
                                                                            >
                                                                                Save
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </Modal.Body>
                                                </Modal>
                                            </>
                                        </div>
                                    </div>
                                </div>
                                <div>{show_expenses}</div>
                            </div>
                        </div>
                        <div className="col-xl-3" style={{ marginTop: "50px" }}>
                            {/** <RightSideBar />*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loggedIn: state.auth.loggedIn,
    };
};

export default connect(mapStateToProps, null)(GroupById);
