import React from "react";

export const Pagination = ({
    activitiesPerPage,
    totalActivities,
    paginate,
    changeActivitiesPerPage,
}) => {
    // handleChange = (e) => {
    //     changeActivitiesPerPage(e.target.value);
    // };
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalActivities / activitiesPerPage); i++) {
        pageNumbers.push(i);
    }
    return (
        <div
            style={{
                zIndex: "1000000",
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div style={{ marginRight: "50px" }}>
                <label for="items">Per Page:</label>
                <select
                    id="items"
                    style={{ margin: "5px", marginBottom: "20px" }}
                    onChange={(e) => {
                        changeActivitiesPerPage(e.target.value);
                    }}
                >
                    <option value="2">2</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                </select>
            </div>

            <div className="pagination-bar">
                <ul className="pagination" style={{}}>
                    {pageNumbers.map((number) => (
                        <li key={number} className="page-item">
                            <span
                                onClick={() => {
                                    paginate(number);
                                }}
                                className="page-link"
                            >
                                {number}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
