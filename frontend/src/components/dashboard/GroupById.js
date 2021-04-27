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
import "../../App.css";

class GroupById extends Component {
    state = {
        showPopUp: false,
        id: null,
        expense_description: null,
        expense_amount: null,
        members: [],
        all_expenses: [],
        expense_comment: null,
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

    handleCommentChange = (e) => {
        // console.log(e.target.value);
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    handleCommentSubmit = (e, value) => {
        e.preventDefault();
        // console.log("Commenter name:: ",name );
        const comment = this.state.expense_comment;
        const expense_id = value;
        const group_id = localStorage.getItem("group_id");
        const by = localStorage.getItem("user_id");
        Axios.defaults.headers.common["authorization"] = localStorage.getItem(
            "token"
        );

        Axios.post(`${backServer}/addcomment`, {
            group_id: group_id,
            expense_id: expense_id,
            comment: comment,
            by: by,
        })
            .then((response) => {
                // console.log("response: ", response);
                const refresh_expenses = this.state.all_expenses;
                const name = localStorage.getItem("name");
                const date = new Date();
                let comment_date = String(date).split(" ");
                comment_date =
                    comment_date[3] +
                    "-" +
                    comment_date[1] +
                    "-" +
                    comment_date[2];
                console.log("comment date: ", comment_date);
                const new_comment = [name, comment_date, comment];
                refresh_expenses.forEach((expense) => {
                    if (expense[4] === expense_id) {
                        expense[5].push(new_comment);
                    }
                });

                this.setState({
                    ...this.state,
                    all_expenses: refresh_expenses,
                });
                // swal("Done", "Expense Added");
            })
            .catch((err) => {
                console.log("Error: ", err);
            });
    };

    handleCommentDelete = (e, by, expense_id, comment_id) => {
        e.preventDefault();
        const user = localStorage.getItem("name");
        if (user !== by) {
            swal(
                "Opps",
                "You can't delete this note/comment as it is written by someone else",
                "error"
            );
        } else {
            swal({
                title: "Are you sure?",
                text:
                    "Once deleted, you will not be able to recover this note/comment !",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    Axios.defaults.headers.common[
                        "authorization"
                    ] = localStorage.getItem("token");

                    Axios.post(`${backServer}/deletecomment`, {
                        expense_id: expense_id,
                        comment_id: comment_id,
                    })
                        .then(() => {
                            const refresh_expenses = this.state.all_expenses;
                            for (let i = 0; i < refresh_expenses.length; i++) {
                                if (expense_id === refresh_expenses[i][4]) {
                                    let index = 0;
                                    for (
                                        let j = 0;
                                        j < refresh_expenses[i][5].length;
                                        j++
                                    ) {
                                        if (
                                            comment_id ===
                                            refresh_expenses[i][5][j][3]
                                        ) {
                                            break;
                                        }
                                        index = index + 1;
                                    }
                                    console.log(
                                        "comment to delete: ",
                                        refresh_expenses[i][5][index]
                                    );
                                    refresh_expenses[i][5].splice(index, 1);
                                    break;
                                }
                            }
                            this.setState({
                                ...this.state,
                                all_expenses: refresh_expenses,
                            });
                            swal("Your note/comment has been deleted!", {
                                icon: "success",
                            });
                        })
                        .catch((err) => {
                            console.log("Error: ", err);
                        });
                } else {
                    swal("Your note/comment is safe !");
                }
            });
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        console.log("state: ", this.state);
        // swal("Done", "Expense Added");
        //call expenses table to add expense
        const group_id = this.state.id;
        const description = this.state.expense_description;
        const amount = this.state.expense_amount;
        const payer = localStorage.getItem("user_id");
        const liables = this.state.members;
        console.log("description: ", description);
        console.log("Group_id: ", group_id);
        console.log("amount: ", amount);
        console.log("payer: ", payer);
        console.log("liables: ", liables);
        Axios.defaults.headers.common["authorization"] = localStorage.getItem(
            "token"
        );

        Axios.post(`${backServer}/addexpense`, {
            group_id: group_id,
            description: description,
            amount: amount,
            payer: payer,
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
        Axios.defaults.headers.common["authorization"] = localStorage.getItem(
            "token"
        );

        Axios.post(`${backServer}/getallgroupmembers`, {
            group_id: id,
        })
            .then((response) => {
                console.log("resopnse: ", response.data[0]);
                const members = [];
                const members_names = response.data[0].names;
                localStorage.setItem(
                    "members_names",
                    JSON.stringify(members_names)
                );
                response.data[0].members.forEach((member) => {
                    members.push(member._id);
                });
                this.setState({
                    members: members,
                });
            })
            .then(() => {
                console.log("State: ", this.state);
                Axios.defaults.headers.common[
                    "authorization"
                ] = localStorage.getItem("token");

                Axios.post(`${backServer}/getgroupexpenses`, {
                    group_id: id,
                })
                    .then((response) => {
                        console.log("alll expenses: ", response.data);
                        // const all_expenses = response.data;
                        const all_expenses = [];
                        const all_members = JSON.parse(
                            localStorage.getItem("members_names")
                        );

                        console.log("all members; ", all_members);
                        response.data.forEach((expense) => {
                            const comments = [];
                            expense[5].forEach((comment) => {
                                let name = "";
                                all_members.forEach((member) => {
                                    console.log(typeof member._id);
                                    console.log(typeof comment._id);
                                    if (member._id === comment.by) {
                                        console.log("in if");
                                        name = member.name;
                                    }
                                });
                                const date = comment.created_at.split("T")[0];
                                comments.push([
                                    name,
                                    date,
                                    comment.content,
                                    comment._id,
                                ]);
                            });
                            all_expenses.push([
                                expense[0],
                                expense[1],
                                expense[2],
                                expense[3],
                                expense[4],
                                comments,
                            ]);
                        });
                        console.log("final all expenses: ", all_expenses);
                        // const number_of_expenses = all_expenses.length;
                        this.setState({
                            all_expenses: all_expenses,
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
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
                        key={expense[4]}
                        className="container"
                        style={{
                            // borderBottom: "1px solid #eee",
                            lineHeight: "60px",
                            alignContent: "center",
                            padding: "20px",
                            marginBottom: "5px",
                            marginTop: "10px",
                            border: "1px solid #eee",
                            borderRadius: "5px",
                            background: "#eee",
                        }}
                    >
                        <div
                            className="row align-items-center"
                            style={{
                                background: "#dbdbdb",
                                border: "1px solid #eee",
                                borderRadius: "5px",
                                padding: "0px",
                                paddingBottom: "5px",
                                paddingTop: "10px",
                            }}
                        >
                            <div
                                className="col-sm-4"
                                style={{
                                    color: "#9c9c9c",
                                    borderRight: "1px solid grey",
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
                                <span
                                    style={{
                                        color: "#9c9c9c",
                                        fontSize: "17px",
                                    }}
                                >
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
                        <div>
                            <div style={{ float: "left" }}>
                                {" "}
                                <span style={{ fontSize: "bold" }}>
                                    Notes and Comments :
                                </span>
                                Click on comment to delete
                            </div>
                            <br />
                            <form
                                onSubmit={(e) => {
                                    this.handleCommentSubmit(e, expense[4]);
                                }}
                            >
                                <div className="container ">
                                    <div className="row align-items-right justify-content-center">
                                        <div className="col">
                                            <textarea
                                                name="expense_comment"
                                                id="expense_comment"
                                                col="60"
                                                row="10"
                                                style={{
                                                    overflow: "auto",
                                                    lineHeight: "1",
                                                    padding: "4px",
                                                    height: "60px",
                                                    width: "300px",
                                                }}
                                                onChange={
                                                    this.handleCommentChange
                                                }
                                            ></textarea>
                                        </div>
                                        <div className="col">
                                            <button
                                                class="btn btn-danger"
                                                type="submit"
                                            >
                                                Post
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <div
                                class="comments"
                                style={{
                                    // border: "1px solid black",
                                    padding: "7px",
                                }}
                            >
                                {expense[5].map((comment) => {
                                    return (
                                        <div
                                            className="container comment align-items-center"
                                            key={comment[3]}
                                            style={{
                                                border: "1px solid #eee",
                                                height: "min-content",
                                                margin: "10px",
                                                background: "white",
                                                borderRadius: "10px",
                                            }}
                                            onClick={(e) => {
                                                this.handleCommentDelete(
                                                    e,
                                                    comment[0],
                                                    expense[4],
                                                    comment[3]
                                                );
                                            }}
                                        >
                                            <div className="row align-items-center">
                                                <div
                                                    className="col-sm-4"
                                                    style={{
                                                        fontSize: "11px",
                                                        float: "left",
                                                    }}
                                                >
                                                    By{" "}
                                                    <span
                                                        style={{
                                                            fontSize: "11px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        {comment[0]}
                                                    </span>{" "}
                                                    on {comment[1]}
                                                </div>
                                                <div
                                                    className="col-sm-8"
                                                    style={{
                                                        fontSize: "13px",
                                                        fontWeight: "bold",
                                                        lineHeight: "normal",
                                                    }}
                                                >
                                                    {comment[2]}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
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
                                                                            maxlength="30"
                                                                            required
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="container">
                                                                    <div className="row align-items-center">
                                                                        <div className="col">
                                                                            <span>
                                                                                {
                                                                                    currency
                                                                                }
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
                                                                                required
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
                            <RightSideBar />
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
