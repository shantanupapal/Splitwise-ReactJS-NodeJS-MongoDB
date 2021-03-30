import React from "react";
import Navbar from "../layout/Navbar";
import facets from "../../images/facets.jpg";
import icons from "../../images/icons.png";
import plane from "../../images/plane.png";
import { Link } from "react-router-dom";
import "../../App.css";
const LandingPage = () => {
    return (
        <div className="landingPage">
            <Navbar />

            <main
                style={{
                    marginTop: "80px",
                    backgroundImage: `url(${facets})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    height: "100%",
                }}
            >
                <div className="container main">
                    <div className="row">
                        <div
                            className="col "
                            style={{
                                marginTop: "120px",
                                marginBottom: "150px",
                            }}
                        >
                            <h1>Less stress when</h1>
                            <h1>sharing expenses</h1>
                            <h1>with anyone.</h1>
                            <img src={icons} alt="icons" />
                            <p style={{ padding: "20px 0px 15px 0px" }}>
                                Keep track of your shared expenses and balances{" "}
                                <br />
                                with housemates, trips, groups,
                                <br /> friends, and family.
                            </p>
                            <Link
                                to="/Signup"
                                className="landingPageSignup_name"
                            >
                                Sign up
                            </Link>
                            <p style={{ padding: "20px 0px 15px 0px" }}>
                                Free for iPhone , Android , and web.
                            </p>
                        </div>
                        <div
                            className="col right"
                            style={{ marginTop: "40px" }}
                        >
                            <img src={plane} alt="plane" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default LandingPage;
