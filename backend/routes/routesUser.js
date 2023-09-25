const express = require('express');
const router = express.Router();
const { userCollection } = require('../configure/db')
const bcrypt = require('bcrypt');

// get all users
router.get('/', async(req, res) => {
    const allUsers = await userCollection.find().toArray();
    console.log(allUsers);
    res.send(allUsers);
});

// get one user via email and password
router.post('/login/:email', async(req, res) => {
    try {
        const user = await userCollection.findOne({ email: req.params.email });
        let sendPw = req.body.password;
        let userPW = user.password;
        bcrypt.compare(sendPw, userPW, (err, result) => {
            if (result) {
                console.log('Passwort korrekt!');
                res.send(user);
            } else {
                console.log('falsches Passwort!');
                res.status(403);
                res.send({
                    error: "Wrong password!"
                });
            }
        });
    } catch {
        res.status(404);
        res.send({
            error: "User does not exist!"
        });
    }
});

module.exports = router;