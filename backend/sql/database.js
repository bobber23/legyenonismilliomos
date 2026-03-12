const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'lom',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//!SQL Queries
async function selectall() {
    const query = 'SELECT * FROM exampletable;';
    const [rows] = await pool.execute(query);
    return rows;
}

//! LOGIN/REGISTER
async function createUser(username, password) {
    const query = 'INSERT INTO users(username, password) VALUES(?, ?);';
    const [rows] = await pool.execute(query, [username, password]);
    return rows;
}

async function findUser(username) {
    const query = 'SELECT * FROM users WHERE username = ?;';
    const [rows] = await pool.execute(query, [username]);
    return rows;
}

async function randomQuestion(difficulty) {
    const query = 'SELECT * FROM kerdesek WHERE nehezseg = ? ORDER BY RAND() LIMIT 1;';
    const [rows] = await pool.execute(query, [difficulty]);
    return rows;
}

async function answersByKerdesId(kid) {
    const query = 'SELECT * FROM valaszok WHERE kid = ?;';
    const [rows] = await pool.execute(query, [kid]);
    return rows;
}

//!Export
module.exports = {
    selectall,
    createUser,
    findUser,
    randomQuestion,
    answersByKerdesId
};
