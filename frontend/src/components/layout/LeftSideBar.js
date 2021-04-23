import { Link } from "react-router-dom";
import smallLogo from "../../images/smallLogo.png";
import flag from "../../images/flag.png";
import group from "../../images/group.png";

const LeftSideBar = () => {
    return (
        <div className="leftSideNav">
            <div className="left">
                <Link to="/Center">
                    <table className="options">
                        <thead style={{ textAlign: "center" }}>
                            <tr>
                                <td style={{ textAlign: "center" }}>
                                    <img src={smallLogo} alt="" />
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <p>Dashboard</p>
                                </td>
                            </tr>
                        </thead>
                    </table>
                </Link>
                <Link to="/RecentActivity">
                    <table className="options">
                        <thead>
                            <tr>
                                <td>
                                    <img src={flag} alt="" />
                                </td>
                                <td>
                                    <p>Recent Activity</p>
                                </td>
                            </tr>
                        </thead>
                    </table>
                </Link>
                <div className="groups">
                    <div className="groupHeader">
                        <table className="groupsItems">
                            <thead>
                                <tr>
                                    <td>
                                        <img src={group} alt="" />
                                    </td>
                                    <td>
                                        <Link
                                            style={{ fontSize: "17px" }}
                                            to="/MyGroupsCenter"
                                        >
                                            <td>My Groups</td>
                                        </Link>
                                    </td>

                                    <td>
                                        <Link
                                            to="/NewGroup"
                                            style={{
                                                fontSize: "12px",
                                            }}
                                        >
                                            <span>&#43;</span>
                                            add
                                        </Link>
                                    </td>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>
            {/*<a href="">About</a>
            <a href="">Services</a>
            <a href="">Clients</a>
            <a href="">Contact</a>*/}
        </div>
    );
};

export default LeftSideBar;
