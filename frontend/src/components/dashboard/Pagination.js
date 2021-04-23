import React from "react";

export const Pagination = ({
    activitiesPerPage,
    totalActivities,
    paginate,
    changeActivitiesPerPage,
}) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalActivities / activitiesPerPage); i++) {
        pageNumbers.push(i);
    }
    return (
        <div
            className="flex-container"
            style={{
                zIndex: "1000000",
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div className="">
                <ul className="pagination">
                    {pageNumbers.map((number) => (
                        <li key={number} className="page-item">
                            <span
                                style={{
                                    background: "#1cc29f",
                                    color: "white",
                                    fontWeight: "bold",
                                }}
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
            <div
                style={{
                    float: "left",
                    border: "1px solid #eee",
                    borderRadius: "5px",
                    padding: "10px",
                    background: "#ddd",
                    fontSize: "20px",
                }}
            >
                <label for="items">Per Page:</label>
                <select
                    id="items"
                    style={{
                        margin: "5px",
                        fontSize: "15px",
                    }}
                    onChange={(e) => {
                        changeActivitiesPerPage(e.target.value);
                    }}
                >
                    <option value="2">2</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                </select>
            </div>
        </div>
    );
};
