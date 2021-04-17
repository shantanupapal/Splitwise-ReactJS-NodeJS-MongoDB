import React from "react";
import { Link } from "react-router-dom";

const MyGroups = ({ myGroups, myPendingGroups, acceptGroup, leaveGroup }) => {
    const groupToLS = (name, id) => {
        localStorage.setItem("group_name", name);
        localStorage.setItem("group_id", id);
    };
    const groupsList = myGroups.length ? (
        myGroups.map((group) => {
            return (
                <div key={group.group_id} className={"groupItem"}>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                {" "}
                                <Link
                                    onClick={() => {
                                        groupToLS(
                                            group.groupname,
                                            group.group_id
                                        );
                                    }}
                                    to={"/groups/" + group.group_id}
                                    style={{
                                        textDecoration: "None",
                                        color: "white",
                                    }}
                                >
                                    <div>
                                        <span>{group.groupname}</span>
                                    </div>
                                </Link>
                            </div>
                            <div className="col">
                                <span
                                    className="acceptInvite"
                                    onClick={() => {
                                        leaveGroup(group.group_id);
                                    }}
                                >
                                    Leave
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        })
    ) : (
        <p style={{ fontSize: "20px", color: "#1cc29f" }}>
            You are not added to any group
        </p>
    );

    const pendingGroupsList = myPendingGroups.length ? (
        myPendingGroups.map((group) => {
            return (
                <div key={group.group_id} className={"pendingGroupItem"}>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                {" "}
                                <span>{group.groupname}</span>
                            </div>
                            <div className="col">
                                <span
                                    className="acceptInvite"
                                    onClick={() => {
                                        acceptGroup(group.group_id);
                                    }}
                                >
                                    Accept
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        })
    ) : (
        <p style={{ fontSize: "20px", color: "#1cc29f" }}>
            No Pending Invitations
        </p>
    );
    return (
        <div className="centerOfPage">
            <div className="container dashboardHeader">
                <div className="row">
                    <div className="col">
                        <h2>My Groups</h2>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row align-items-top">
                    <div
                        className="col-sm-6"
                        style={{
                            borderRight: " 2px solid #eee",
                        }}
                    >
                        <div className={"categoryHeader"}>Groups</div>
                        <div>{groupsList}</div>
                    </div>
                    <div className="col-sm-6">
                        <div className={"categoryHeader"}>Invitations</div>
                        <div>{pendingGroupsList}</div>
                    </div>
                </div>
            </div>
            <div className="container categoryMain">
                <div className="row align-items-center">
                    <div
                        className="col-sm-4"
                        style={{ borderRight: " 1px solid #eee" }}
                    ></div>
                    <div className="col-sm-8"></div>
                </div>
            </div>

            <br />

            <br />
        </div>
    );
};

export default MyGroups;
// class MyGroups extends Component {
//     componentWillMount = () => {
//         //FETCH groups for the user_ID - DONE IN MYGROUPSCENTER
//         // const user_id = parseInt(localStorage.getItem("user_id"));
//         // Axios.post(`${backServer}/usergroups`, { user_id: user_id })
//         //     .then((response) => {
//         //         // console.log("All groups:");
//         //         console.log(response.data);
//         //     })
//         //     .then(() => {

//         //     })
//         //     .catch((error) => {
//         //         console.log("Error: " + error);
//         //     });

//         // IF ? (groups) : "no group added"

//         //Invitations ? (invites) : "no invitations"
//     };
//     render() {
//         return (
//             <div className="centerOfPage">
//                 <div className="container dashboardHeader">
//                     <div className="row align-items-center">
//                         <div className="col-sm-3">
//                             <h2>My Groups</h2>
//                         </div>
//                         <div className="col-sm-6"></div>
//                         <div className="col-sm-3"></div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// }

// export default MyGroups;
