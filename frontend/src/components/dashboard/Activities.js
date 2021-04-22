import React from "react";

const Activities = ({ activities, loading }) => {
    if (loading) {
        return <h2>Loading ...</h2>;
    }
    return (
        <div>
            {activities.map((activity) => (
                <div>
                    <div
                        style={{
                            borderBottom: "1px solid #eee",
                            lineHeight: "30px",
                            padding: "5px",
                        }}
                    >
                        <span style={{ fontWeight: "bold" }}>
                            {activity.title}
                        </span>{" "}
                        added <span style={{ fontWeight: "bold" }}></span> to{" "}
                        <span style={{ fontWeight: "bold" }}></span>
                        <br />
                        <span style={{ color: "#ff652f" }}>You owe</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Activities;
