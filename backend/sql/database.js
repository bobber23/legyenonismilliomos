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
        remainingAnswers.push(rows[0]);
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
        return rows[0];
    } catch (error) {
        throw new Error(error);
    }
}

async function crowdVote(questionId, difficulty) {
    try {
        let chance;
        switch (difficulty) {
            case 1:
                chance = 3;
                break;
            case 2:
                chance = 4;
                break;
            case 3:
                chance = 5;
                break;
            case 4:
                chance = 6;
                break;
            case 5:
                chance = 7;
                break;
            case 6:
                chance = 8;
                break;
            case 7:
                chance = 9;
                break;
            case 8:
                chance = 10;
                break;
            case 9:
                chance = 11;
                break;
            case 10:
                chance = 12;
                break;
            case 11:
                chance = 13;
                break;
            case 12:
                chance = 14;
                break;
            case 13:
                chance = 15;
                break;
            case 14:
                chance = 16;
                break;
            case 15:
                chance = 17;
                break;
            default:
                chance = 6;
                break;
        }

        let remainingPercent = 100;
        const sql = `
        SELECT *
        FROM valaszok
        WHERE kid = ?
        ORDER BY helyes ASC;`;
        const [rows] = await pool.execute(sql, [questionId]);
        for (let i = 0; i < rows.length - 1; i++) {
            let rand = Math.floor(Math.random() * 15 + chance);
            rows[i]['szazelek'] = rand;
            remainingPercent -= rand;
        }
        rows[rows.length - 1]['szazelek'] = remainingPercent;
        let result = rows;
        for (let i = 0; i < result.length - 1; i++) {
            for (let j = i + 1; j < result.length; j++) {
                if (rows[i].id > rows[j].id) {
                    let temp = rows[i];
                    rows[i] = rows[j];
                    rows[j] = temp;
                }
            }
        }

        return result;
    } catch (error) {
        throw new Error(error);
    }
}

async function phoneCall(questionId, difficulty) {
    let sql;
    let chance;
    switch (difficulty) {
        case 1:
            chance = 10;
            break;
        case 2:
            chance = 15;
            break;
        case 3:
            chance = 20;
            break;
        case 4:
            chance = 25;
            break;
        case 5:
            chance = 30;
            break;
        case 6:
            chance = 35;
            break;
        case 7:
            chance = 40;
            break;
        case 8:
            chance = 45;
            break;
        case 9:
            chance = 50;
            break;
        case 10:
            chance = 55;
            break;
        case 11:
            chance = 60;
            break;
        case 12:
            chance = 65;
            break;
        case 13:
            chance = 70;
            break;
        case 14:
            chance = 75;
            break;
        case 15:
            chance = 80;
            break;
        default:
            chance = 50;
            break;
    }
    if (Math.floor(Math.random() * 100) > chance) {
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
    return rows;
}

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
