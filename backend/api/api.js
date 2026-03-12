const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');
const bcrypt = require('bcrypt');

//!Multer
const multer = require('multer'); //?npm install multer
const path = require('path');
const { error } = require('console');

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
//!Login/Register
router.post('/register', async (request, response) => {
    try {
        const username = request.body.username;
        const password = request.body.password;

        const existingUser = await database.findUser(username);
        if (existingUser.length > 0) {
            return response.status(400).json({ error: 'Foglalt felhasználónév!' });
        }

        const hash = await bcrypt.hash(password, 10);

        await database.createUser(username, hash);
        response.status(200).json({
            message: 'Sikeres regisztráció'
        });
    } catch (error) {
        response.status(500).json({
            message: 'Ez a végpont nem működik.'
        });
    }
});

router.post('/login', async (request, response) => {
    try {
        const username = request.body.username;
        const password = request.body.password;

        const users = await database.findUser(username);
        if (users.length === 0) {
            return response.status(400).json({ error: 'Nincs ilyen felhasználó!' });
        }

        const foundUser = users[0];

        const checkPassword = await bcrypt.compare(password, foundUser.password);
        if (!checkPassword) {
            return response.status(400).json({ error: 'Hibás jelszó!' });
        }

        request.session.user = {
            id: foundUser.id,
            username: foundUser.username
        };
        response.status(200).json({
            message: 'Sikeres bejelentkezés!'
        });
    } catch (error) {
        response.status(500).json({
            message: 'Ez a végpont nem működik.'
        });
    }
});

router.get('/me', async (request, response) => {
    try {
        if (!request.session.user) {
            return response.json({ loggedIn: false });
        }
        response.status(200).json({
            loggedIn: true,
            user: request.session.user
        });
    } catch (error) {
        response.status(500).json({
            message: 'Ez a végpont nem működik.'
        });
    }
});

router.post('/logout', async (request, response) => {
    try {
        request.session.destroy();
        response.status(200).json({
            message: 'Kijelentkezve!'
        });
    } catch (error) {
        response.status(500).json({
            message: 'Ez a végpont nem működik.'
        });
    }
});

router.get('/half/:questionId', async (request, response) => {
    try {
        const questionId = request.params.questionId;
        const remainingAnswers = await database.halveAnswers(questionId);
        response.status(200).json({
            status: 'success',
            result: remainingAnswers
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: 'Az /half végpont gatya'
        });
    }
});

router.get('/crowd/:questionId', async (request, response) => {
    try {
        const questionId = request.params.questionId;
        const percentages = await database.crowdVote(questionId);
        response.status(200).json({
            status: 'success',
            result: percentages
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: 'Az /crowd végpont gatya'
        });
    }
});

router.get('/phone/:questionId', async (request, response) => {
    try {
        const questionId = request.params.questionId;
        const phoneAnswer = await database.phoneCall(questionId);
        response.status(200).json({
            status: 'success',
            result: phoneAnswer
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: 'Az /phone végpont gatya'
        });
    }
});

module.exports = router;
