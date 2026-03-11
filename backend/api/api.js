const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');

//!Multer
const multer = require('multer'); //?npm install multer
const path = require('path');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '../uploads'));
    },
    filename: (request, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname); //?egyedi név: dátum - file eredeti neve
    }
});

const upload = multer({ storage });

//!Endpoints:
//?GET /api/test
router.get('/test', (request, response) => {
    response.status(200).json({
        message: 'Ez a végpont működik.'
    });
});

//?GET /api/testsql
router.get('/testsql', async (request, response) => {
    try {
        const selectall = await database.selectall();
        response.status(200).json({
            message: 'Ez a végpont működik.',
            results: selectall
        });
    } catch (error) {
        response.status(500).json({
            message: 'Ez a végpont nem működik.'
        });
    }
});

router.post('/addQuestion', upload.none(), async (request, response) => {
    try {
        const { question, difficulty, answerA, answerB, answerC, answerD, correctAnswer } =
            request.body;
        const questionID = await database.addQuestion(question, difficulty);
        const feedback = await database.addAnswers(
            [answerA, answerB, answerC, answerD],
            correctAnswer,
            questionID
        );
        response.status(200).json({
            status: feedback
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: 'Az /addQuestion végpont gatya'
        });
    }
});

module.exports = router;
