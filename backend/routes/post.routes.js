const express = require('express');
const router = express.Router();
const { collection } = require('../../configure/db.js')


// GET all posts
router.get('/reports', async(req, res) => {
    const allPosts = await collection.find().toArray();
    res.status(200);
    res.send(allPosts);
});

module.exports = router;
