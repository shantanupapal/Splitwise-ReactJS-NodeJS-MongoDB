import React, { useState } from "react";
import profilePhoto from "../../images/profilePhoto.png";
import "../../App.css";
import ProfilePageNav from "../layout/ProfilePageNav";
import Axios from "axios";
import backServer from "../../webConfig";
import swal from "sweetalert";

const ProfilePage = () => {
    const [name, setName] = useState(localStorage.getItem("name"));
    // const [email, setEmail] = useState(localStorage.getItem("email"));
    const [currency, setCurrency] = useState(localStorage.getItem("currency"));
    const [timezone, setTimezone] = useState(localStorage.getItem("timezone"));
    const [language, setLanguage] = useState(localStorage.getItem("language"));
    const [phone, setPhone] = useState(localStorage.getItem("phone"));
    const [profilephoto, setProfilePhoto] = useState(
        localStorage.getItem("profilephoto")
    );
    const user_id = localStorage.getItem("user_id");

    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.defaults.withCredentials = true;
        // console.log(name, email, phone, currency, timezone, language, user_id);
        // console.log("IM in handlesubmit");
        Axios.post(`${backServer}/updateprofile`, {
            name: name,
            // email: email,
            phone: phone,
            currency: currency,
            timezone: timezone,
            language: language,
            user_id: user_id,
        })
            .then((response) => {
                console.log("Done: " + response.data.name);
                localStorage.setItem("name", name);
                // localStorage.setItem("email", email);
                localStorage.setItem("phone", phone);
                localStorage.setItem("currency", currency);
                localStorage.setItem("timezone", timezone);
                localStorage.setItem("language", language);
            })
            .catch((err) => {
                console.log("Error: " + err);
            });
    };

    const handleSubmitPhoto = (e) => {
        e.preventDefault();
        Axios.defaults.withCredentials = true;
        console.log("IM in handlesubmitphoto");
        // profilephoto.name = user_id + ".JPG";
        // console.log(profilephoto.name);
        Axios.post(`${backServer}/changeuserid`, { user_id: user_id }).then(
            (response) => {
                console.log(response);
                Axios.post(`${backServer}/updateprofilephoto`, data).then(
                    (response) => {
                        console.log(response.data);
                        localStorage.setItem("profilephoto", response.data);
                        // window.location.reload();
                        swal("Profile Photo changed");
                    }
                );
            }
        );

        let data = new FormData();
        data.append("profilephoto", profilephoto);
        data.append("user_id", user_id);

        console.log(data);
    };

    let path = backServer;
    let profilePhoto1 = localStorage.getItem("profilephoto");
    profilePhoto1 = profilePhoto1.toString();
    let profilePhoto = path + "/" + profilePhoto1;
    console.log(profilePhoto);
    return (
        <div className="container-fluid">
            <ProfilePageNav />
            <div className="container profileMain">
                <div className="row">
                    <div className="col-sm-6">
                        <img
                            src={backServer + "/images/" + profilePhoto1}
                            className=""
                            alt="profilepic"
                            style={{
                                width: "200px",
                                height: "250px",
                                marginBottom: "10px",
                            }}
                        />

                        <form
                            encType="multipart/form-data"
                            onSubmit={handleSubmitPhoto}
                        >
                            <label htmlFor="browse">Change your avatar</label>
                            <br />
                            <input
                                type="file"
                                id="profilephoto"
                                name="profilephoto"
                                onChange={(e) => {
                                    setProfilePhoto(e.target.files[0]);
                                }}
                            ></input>{" "}
                            <br />
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ marginTop: "20px" }}
                            >
                                Update Photo
                            </button>
                        </form>
                    </div>

                    <div className="col-sm-6" style={{ width: "350px" }}>
                        <form onSubmit={handleSubmit}>
                            <div
                                style={{
                                    paddingBottom: "30px",
                                    borderBottom: "1px solid lightgrey",
                                }}
                            >
                                <div className="form-group-profilePage">
                                    <div className="welcomeName">
                                        <p>Your Details</p>{" "}
                                    </div>
                                    <label htmlFor="name">Your name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name=""
                                        id="name"
                                        onChange={(e) => {
                                            setName(e.target.value);
                                        }}
                                        defaultValue={name}
                                    />
                                </div>

                                {/* <div className="form-group-profilePage">
                                    <label htmlFor="email">
                                        Your email address
                                    </label>
                                    <input
                                        type="text"
                                        name=""
                                        className="form-control"
                                        id="email"
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                        }}
                                        defaultValue={email}
                                    />
                                </div>*/}

                                <div className="form-group-profilePage">
                                    <label htmlFor="phone">
                                        Your phone number
                                    </label>
                                    <input
                                        type="text"
                                        name=""
                                        className="form-control"
                                        id="phone"
                                        onChange={(e) => {
                                            setPhone(e.target.value);
                                        }}
                                        defaultValue={phone}
                                    />
                                </div>
                            </div>

                            {/*  <div className="form-group">
                                    <label htmlFor="password">
                                        Your password
                                    </label>
                                    <input
                                        type="password"
                                        name=""
                                        className="form-control"
                                        id="password"
                                    />
                                </div>*/}

                            <div style={{ marginTop: "50px" }}>
                                <div className="welcomeName">
                                    <p>Your Preferences</p>{" "}
                                </div>
                                <div className="form-group-profilePage">
                                    <label htmlFor="">
                                        Your default currency
                                    </label>
                                    <br />

                                    <select
                                        id="currency"
                                        name="currency"
                                        className="form-control"
                                        onChange={(e) => {
                                            setCurrency(e.target.value);
                                        }}
                                    >
                                        <option value="USD ($)">USD ($)</option>
                                        <option value="EUR (€)">EUR (€)</option>
                                        <option value="GBP (£)">GBP (£)</option>
                                        <option value="HUF (Ft)">
                                            HUF (Ft)
                                        </option>
                                        <option value="INR (₹)">INR (₹)</option>
                                        <option value="KWD (د.ك)">
                                            KWD (د.ك)
                                        </option>
                                        <option value="BHD (.د.ب)">
                                            BHD (.د.ب)
                                        </option>
                                        <option value="CAD (C$)">
                                            CAD (C$)
                                        </option>
                                    </select>
                                </div>
                                <div className="form-group-profilePage">
                                    <label htmlFor="">You time zone</label>
                                    <select
                                        id="timezone"
                                        name="timezone"
                                        className="form-control"
                                        onChange={(e) => {
                                            setTimezone(e.target.value);
                                        }}
                                    >
                                        <option value="Pacific Time (US &amp; Canada)">
                                            (GMT-08:00) Pacific Time (US &amp;
                                            Canada)
                                        </option>
                                        <option value="Central America">
                                            (GMT-06:00) Central America
                                        </option>
                                    </select>
                                </div>
                                <div className="form-group-profilePage">
                                    <label htmlFor="">Language</label>
                                    <select
                                        id="language"
                                        name="language"
                                        className="form-control"
                                        onChange={(e) => {
                                            setLanguage(e.target.value);
                                        }}
                                    >
                                        <option value="English">English</option>
                                        <option value="Hindi">Hindi</option>
                                    </select>
                                </div>
                                <button className="btn btn-primary">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
