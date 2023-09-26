const express = require('express');
const router = express.Router();
const { reportsCollection, client} = require('../configure/db')
const Report = require('../models/reports');
const upload = require('../middleware/upload');
const mongodb = require('mongodb')
const { database } = require('../configure/db')
const {connection} = require("mongoose");
const {ObjectId} = require("mongodb");

const bucket = new mongodb.GridFSBucket(database, {
    bucketName: 'posts'
});


// eine GET-Anfrage
router.get('/', async (req, res) => {
    res.send({message: "Hello FIW!"});
});

// post one Report
router.post('/reports', async (req, res) => {
    try {
        const newReport = new Report({
            userID: req.body.userID,
            type: req.body.type,
            date: req.body.date,
            desc: req.body.desc,
            location: req.body.location,
            lat: req.body.lat,
            lon: req.body.lon,
            file: req.body.file
        })
        await reportsCollection.insertOne(newReport);
        res.status(201);
        res.send(newReport);
    } catch {
        res.status(404);
        res.send({
            error: "Post not created"
        });
    }
});

// get all reports to user
router.get('/reports/user/:id', async(req, res) => {
    try {
        const allReportsToUser = await reportsCollection.find({userID: req.params.id}).toArray();
        res.send(allReportsToUser);
    } catch {
        res.status(404);
        res.send({
            error: "User does not exist!"
        });
    }
});

// update one Report
router.patch('/reports/:id', async(req, res) => {
    try {
        const report = await reportsCollection.findOne({ _id: req.params.id })

        if (req.body.type) {
            report.type = req.body.type
        }

        if (req.body.date) {
            report.date = req.body.date
        }

        if (req.body.desc) {
            report.desc = req.body.desc
        }

        if (req.body.location) {
            report.location = req.body.location
        }

        if (req.body.file) {
            report.file = req.body.file
        }

        await report.updateOne({ _id: req.params.id }, report);
        res.send(report)
    } catch {
        res.status(404)
        res.send({ error: "Report does not exist!" })
    }
});

// delete one Report via id
router.delete('/reports/:id', async(req, res) => {
    try {
        await reportsCollection.deleteOne({ _id: req.params.id })
        res.status(204).send()
    } catch {
        res.status(404)
        res.send({ error: "Report does not exist!" })
    }
});

//upload picture
router.post('/reports/upload', upload.single('file'), (req, res) => {
    if (req.file === undefined) {
        return res.send({
            "message": "no file selected"
        });
    } else {
        return res.status(201).send(res.req.file.id);
    }
})

//download picture
router.get('/download/:fileId', async(req, res) => {
    try {
        const fileId = req.params.fileId;
        console.log('1');
        let downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
        console.log('2');

        downloadStream.on("data", (data) => {console.log(data);res.status(200).write(data.toString())});
        console.log('3');

        downloadStream.on("error", (err) => res.status(404).send({ message: fileId + " does not exist" }));
        console.log('4');

        downloadStream.on("end", () => res.end());
    } catch (error) {
        console.log('error', error);
        res.send("not found");
    }
});


//Get one Report via id
router.get('/reports/:id', async(req, res) => {
    getOneReport(req.params.id)
        .then( (post) => {
            console.log('post', post);
            res.send(post);
        })
        .catch( () => {
            res.status(404);
            res.send({
                error: "Post does not exist!"
            });
        })
});


function getOneReport(id) {
    return new Promise( async(resolve, reject) => {
        try {
            let oid = new ObjectId(id);
            const report = await reportsCollection.findOne({ _id: oid });
            /*if(report.file && report.file != '') {
                let fileId = report.file;
                const database = client.db('WarnDog');
                const files = database.collection('posts.files');
                const chunks = database.collection('posts.chunks');

                let fileOId = new ObjectId(fileId);
                const file = files.findOne({_id: fileOId});
                const cursorChunks = chunks.find({files_id: fileId});
                const sortedChunks = cursorChunks.sort({n: 1});
                let fileData = [];
                for await (const chunk of sortedChunks) {
                    fileData.push(chunk.data.toString('base64'));
                }
                let base64file = 'data:' + file.contentType + ';base64,' + fileData.join('');
                let getPost = new Report({
                    "_id": report._id,
                    "userID": report.userID,
                    "type": report.type,
                    "date": report.date,
                    "location": report.location,
                    "desc": report.desc,
                    "lat": report.lat,
                    "lon": report.lon,
                    "file": base64file
                });*/
               /* console.log('getPost', getPost);
                resolve(getPost);
            } else {*/
                resolve(report);
        } catch(err) {
            reject(new Error("Post does not exist!"));
            console.log(err);
        }
    })
}


//Get all reports
router.get('/reports', async(req, res) => {

    getAllReports()
        .then( (reports) => {
            res.send(reports);
        })
        .catch( () => {
            res.status(404);
            res.send({
                error: "Reports do not exist!"
            });
        })
});


function getAllReports() {
    return new Promise( async(resolve, reject) => {
        const sendAllReports = [];
        const allReports = await reportsCollection.find().toArray();
        try {
            for(const report of allReports) {
                console.log('report: ' + report._id);
                const oneReport = await getOneReport(report._id);
                sendAllReports.push(oneReport);
            }
            resolve(sendAllReports)
        } catch {
            reject(new Error("Reports do not exist!"));
        }
    });
}


module.exports = router;