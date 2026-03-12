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

async function kerdesekLatestId() {
    const sql = `
    SELECT id
    FROM kerdesek
    ORDER BY id DESC
    LIMIT 1;`;
    const [rows] = await pool.execute(sql);
    return rows[0];
}

async function valaszokLatestId() {
    const sql = `
    SELECT id
    FROM valaszok
    ORDER BY id DESC
    LIMIT 1;`;
    const [rows] = await pool.execute(sql);
    return rows[0];
}

async function addQuestion(question, difficulty) {
    try {
        let lstId = await kerdesekLatestId();
        let newId;
        if (lstId == undefined) {
            newId = 1;
        } else {
            newId = lstId.id + 1;
        }
        const kerdesSQL = `
        INSERT INTO kerdesek(id, kerdes, nehezseg)
        VALUES(?,?,?);`;
        await pool.execute(kerdesSQL, [newId, question, difficulty]);
        return newId;
    } catch (error) {
        throw new Error(error);
    }
}

async function addAnswers(answers, correctAnswer, questionID) {
    try {
        for (let i = 0; i < answers.length; i++) {
            const sql = `
            INSERT INTO valaszok(id,valasz,kid,helyes)
            VALUES(?,?,?,?);
            `;

            let lstId = await valaszokLatestId();
            let newId;
            if (lstId == undefined) {
                newId = 1;
            } else {
                newId = lstId.id + 1;
            }

            console.log(newId);

            let isCorrect = correctAnswer == i ? true : false;

            await pool.execute(sql, [newId, answers[i], questionID, isCorrect]);
        }
        return 'success';
    } catch (error) {
        throw new Error(error);
    }
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

async function halveAnswers(questionId) {
    try {
        const sql = `
        SELECT *
        FROM valaszok
        WHERE helyes != 1 AND kid = ?
        ORDER BY rand()
        LIMIT 1;
        `;
        let remainingAnswers = [];
        const [rows] = await pool.execute(sql, [questionId]);
        remainingAnswers.push(rows);
        remainingAnswers.push(await correctAnswer(questionId));
        return remainingAnswers;
    } catch (error) {
        throw new Error(error);
    }
}

async function correctAnswer(questionId) {
    try {
        const sql = `
        SELECT *
        FROM valaszok
        WHERE helyes = 1 AND kid = ?;
        `;
        const [rows] = await pool.execute(sql, [questionId]);
        return rows;
    } catch (error) {
        throw new Error(error);
    }
}

async function crowdVote(questionId) {
    try {
        let remainingPercent = 100;
        const sql = `
        SELECT *
        FROM valaszok
        WHERE kid = ?
        ORDER BY helyes ASC;`;
        const [rows] = await pool.execute(sql, [questionId]);
        for (let i = 0; i < rows.length - 1; i++) {
            let rand = Math.floor(Math.random() * 15 + 3);
            rows[i]['szazelek'] = rand;
            remainingPercent -= rand;
        }
        rows[rows.length - 1]['szazelek'] = remainingPercent;
        return rows;
    } catch (error) {
        throw new Error(error);
    }
}

async function phoneCall(questionId) {
    let sql;
    if (Math.floor(Math.random() * 100) > 20) {
        sql = `
        SELECT *
        FROM valaszok
        WHERE helyes = 1 AND kid = ?
        `;
    } else {
        sql = ` 
        SELECT *
        FROM valaszok
        WHERE helyes != 1 AND kid = ?
        ORDER BY rand()
        LIMIT 1;
        `;
    }
    const [rows] = await pool.execute(sql, [questionId]);
    return rows; }
async function randomQuestion(difficulty) {
    const query = 'SELECT * FROM kerdesek WHERE nehezseg = ? ORDER BY RAND() LIMIT 1;';
    const [rows] = await pool.execute(query, [difficulty]);
    return rows[0];
}

async function answersByKerdesId(kid) {
    const query = 'SELECT * FROM valaszok WHERE kid = ?;';
    const [rows] = await pool.execute(query, [kid]);
    return rows;
}

async function checkAnswer(id) {
    const query = 'SELECT * FROM valaszok WHERE id = ?;';
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
}

//!Export
module.exports = {
    selectall,
    addQuestion,
    addAnswers,
    createUser,
    findUser,
    halveAnswers,
    correctAnswer,
    crowdVote,
    phoneCall,
    randomQuestion,
    answersByKerdesId,
    checkAnswer
};
