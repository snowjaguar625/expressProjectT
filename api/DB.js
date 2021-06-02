const mysql = require('mysql');
require('dotenv').config();
const fs = require('fs');

const db = mysql.createConnection({
    // connectionLimit: 1000,
    // connectTimeout: 60 * 60 * 1000,
    // acquireTimeout: 60 * 60 * 1000,
    // timeout: 60 * 60 * 1000,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    // ssl: {
    //     ca: fs.readFileSync(__dirname + '/certs/ca.pem'),
    // }

})

db.connect(err => {
    if (err) {
        console.log("Below is db connect error.")
         console.log(err);
    }
    else { console.log('MySQL DB connected') }
})


module.exports = db