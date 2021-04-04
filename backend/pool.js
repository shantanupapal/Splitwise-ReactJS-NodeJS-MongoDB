const mysql = require("mysql");

const pool = mysql.createPool({
    connectionLimit: 300,
    host: "splitwise-lab1.cjujexxer9yg.ap-south-1.rds.amazonaws.com",
    user: "admin",
    password: "12345678",
    database: "splitwise",
});

pool.getConnection((err) => {
    if (err) {
        console.log("DATABASE ERROR");
        throw "Error occured: " + err;
    }
});

module.exports = pool;

// const pool = mysql.createConnection({
//     // connectionLimit: 100,
//     host: "splitwise-lab1.cjujexxer9yg.ap-south-1.rds.amazonaws.com",
//     user: "admin",
//     password: "12345678",
//     database: "splitwise",
// });

// pool.connect((err) => {
//     if (err) {
//         console.log("DATABASE ERROR");
//         throw "Error occured: " + err;
//     }
// });

// module.exports = pool;

// const db = mysql.createConnection({
//   host: "database-ms1.cnqtrxygyjza.us-west-1.rds.amazonaws.com",
//   port: myPort,
//   user: "admin",
//   password: "adminpayal",
//   database: "dbsplitwise",
//   //multipleStatements: true,
// });
// db.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
// });
