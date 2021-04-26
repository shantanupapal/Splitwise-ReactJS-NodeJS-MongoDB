import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../App.css";
import centerlogo from "../../images/centerlogo.svg";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import backServer from "../../webConfig";
import Axios from "axios";
import { withRouter } from "react-router-dom";
import swal from "sweetalert";
// import swal from "@sweetalert/with-react";

class NewGroup extends Component {
    state = {
        groupName: null,
        groupCreator: this.props.user.name,
        groupMembers: [{ groupMember: null }],
        memberSuggestions: [],
        allUsers: [],
    };

    componentWillMount = () => {
        //FETCH ALL USERNAMES AND STORE IN LOCALSTORAGE
        console.log("DID MOUNT");
        Axios.defaults.headers.common["authorization"] = localStorage.getItem(
            "token"
        );

        Axios.get(`${backServer}/getallusers`)
            .then((response) => {
                console.log(typeof response.data);
                console.log(response.data);
                localStorage.setItem("allUsers", JSON.stringify(response.data));
            })
            .then(() => {
                const allUsers = JSON.parse(localStorage.getItem("allUsers"));
                const usersFromLocal = Object.values(allUsers);
                console.log(usersFromLocal);
                const names = [];
                usersFromLocal.forEach((item) => names.push(item.name));
                console.log(names);
                this.setState({ ...this.state, allUsers: names });
            });
    };

    handleChange = (i, event) => {
        const toSuggest = event.target.value;
        const { allUsers } = this.state;
        let memberSuggestions = [];
        if (toSuggest.length > 0) {
            console.log("inif");
            const regex = new RegExp(`^${toSuggest}`, "i");
            memberSuggestions = allUsers.sort().filter((v) => regex.test(v));
            console.log(memberSuggestions);
            let groupMembers = [...this.state.groupMembers];
            groupMembers[i].groupMember = event.target.value;
            this.setState({ ...this.state, groupMembers });
            console.log(this.state);
        }
        console.log("memberSuggestions: ", memberSuggestions);
        this.setState({ ...this.state, memberSuggestions });

        console.log("state after suggest: ", this.state);
    };

    showSuggestions = () => {
        const { memberSuggestions } = this.state;
        if (memberSuggestions.length === 0) {
            return null;
        }
        return (
            <ul style={{ listStyle: "none" }}>
                {memberSuggestions.map((item) => {
                    return <li>{item}</li>;
                })}
            </ul>
        );
    };

    addOnClick = () => {
        this.setState((prevState) => ({
            ...this.state,
            groupMembers: [...prevState.groupMembers, { groupMember: null }],
            memberSuggestions: [],
        }));
    };

    removeOnClick = (i) => {
        console.log("I:", i);
        let groupMembers = [...this.state.groupMembers];
        groupMembers.splice(i, 1);
        this.setState({ ...this.state, groupMembers: groupMembers });
        console.log("state after remove1:", this.state);
    };

    handleSubmit = (event) => {
        event.preventDefault();
        Axios.defaults.withCredentials = true;
        const groupMembers = [...this.state.groupMembers];
        console.log("Members: ", groupMembers);

        if (this.state.groupName === null) {
            swal("Oops!", "Please enter a group name", "error");
            // alert("Please enter a group name");
        } else {
            if (groupMembers.length === 1) {
                swal("Oops!", "Please add a member to the group", "error");
            } else {
                let invalid_users_flag = false;
                const allUsers = JSON.parse(localStorage.getItem("allUsers"));
                const usersFromLocal = Object.values(allUsers);
                console.log("usersfromlocal: ", usersFromLocal);
                const names = [];
                const ids = [];
                usersFromLocal.forEach((item) => {
                    names.push(item.name);
                    ids.push(item._id);
                });

                console.log(groupMembers);
                const members_id_to_add = [];
                const creator_id = localStorage.getItem("user_id");
                members_id_to_add.push(creator_id);
                const invalid_members = [];
                groupMembers.forEach((member) => {
                    if (names.includes(member.groupMember)) {
                        members_id_to_add.push(
                            ids[names.indexOf(member.groupMember)]
                        );
                        console.log("Members to add ", members_id_to_add);
                    } else {
                        invalid_members.push(member.groupMember);
                        console.log(invalid_members);
                        invalid_users_flag = true;
                    }
                });
                if (invalid_users_flag) {
                    alert(
                        "Not Registered: " +
                            invalid_members +
                            ". These users will not be added to the group."
                    );
                }
                Axios.defaults.headers.common[
                    "authorization"
                ] = localStorage.getItem("token");

                Axios.post(`${backServer}/newgroup`, {
                    members: members_id_to_add,
                    groupname: this.state.groupName,
                    creator_id: creator_id,
                })
                    .then((response) => {
                        console.log(response.status);
                        console.log("Group created successfully");
                        this.props.history.push("/Center");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    };

    render() {
        //const { user } = this.props.user.name;
        const creator = localStorage.getItem("name");

        const { loggedIn } = this.props;
        if (!loggedIn) return <Redirect to="/Login" />;
        return (
            <div className="container h-100 d-flex justify-content-center addGroupMain">
                <div className="row align-items-center">
                    <div className="col forMainLogo">
                        <img src={centerlogo} alt="" />
                    </div>
                    <div className="col">
                        <div className="welcomeName">
                            <p>START A NEW GROUP</p>{" "}
                        </div>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group formForNewGroup">
                                <label htmlFor="">
                                    My group shall be called...
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="groupName"
                                    onChange={(e) => {
                                        this.setState({
                                            groupName: e.target.value,
                                        });
                                        console.log(this.state);
                                    }}
                                    size="10"
                                    style={{
                                        paddingBottom: "10px",
                                    }}
                                />
                                <hr className="hrTagAddGroup" />
                                <div className="welcomeName">
                                    <p>GROUP MEMBERS</p>
                                </div>
                                <div>
                                    <p>{creator}</p>
                                </div>
                                <div className="container">
                                    {this.state.groupMembers.map((el, i) => (
                                        <div
                                            key={i}
                                            className="row addPersonRow"
                                        >
                                            <div className="col-sm-10 ">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={"" || el.groupMember}
                                                    onChange={(e) =>
                                                        this.handleChange(i, e)
                                                    }
                                                />
                                                {this.showSuggestions()}
                                            </div>
                                            <div className="col-sm-2">
                                                <Link
                                                    style={{
                                                        textDecoration: "None",
                                                    }}
                                                    onClick={() =>
                                                        this.removeOnClick(i)
                                                    }
                                                >
                                                    <span
                                                        style={{
                                                            fontSize: "15px",
                                                        }}
                                                    >
                                                        &#10006;
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    style={{ textDecoration: "None" }}
                                    onClick={() => this.addOnClick()}
                                >
                                    + Add a person
                                </Link>{" "}
                                <br></br>
                                <hr className="hrTagAddGroup" />
                                <button
                                    type="submit"
                                    className="btn btn-danger submitButton"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        loggedIn: state.auth.loggedIn,
    };
};

export default connect(mapStateToProps, null)(NewGroup);
