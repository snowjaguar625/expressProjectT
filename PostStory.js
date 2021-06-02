
const express = require('express')
const router = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const momentTime = require('moment-timezone');
const db = require('./api/DB')
const { requirePath } = require('./middleware/authMiddleWare')
const path = require('path')
const fs = require('fs')

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static('uploads'))

// Post Story


router.post('/imageUpload', async (req, res, next) => {
    const file = await req.files.upload
    const images = []
    let date = momentTime.tz(new Date(), "Asia/Dhaka").format()
    const filterDate = date.split('T')[0]

    if (file.size > 100000) {
        return res.status(500).json({ msg: 'Image is too large. Please Upload less than 500KB' })
    }

    //Generating Unique Name for Image

    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-abcdefghijklmnopqrstuvwxyz-0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    // Storing Image

    file.name = `${makeid(50)}${filterDate}${file.name}`

    file.mv(`${__dirname}/uploads/postImage/${file.name}`, err => {
        if (err) {
            console.log(err); next()
            return res.status(500).json({ msg: 'can not upload image' })
        }
        // return res.send({ name: file.name, path: `/${file.name}` })
        const sqlInsert = "INSERT INTO stories (title, community_id, short_story, post_thumbnail, body, tags, user_id) values(?, ?)";
        db.query(sqlInsert, [storyTitle, category, storySummary, file.name, storyBody, storyTags, userID], (err, documents) => {
            if (err) {
                console.log(err); next()
            }
            res.send(documents)

        })
    })
    if (!file) {
        var error = new Error('Please Upload a file')
        return (error)
    }



})
const imageFile = '';

router.post('/postStory', requirePath, async (req, res, next) => {

    var file = await req.files.file;
    const storyTitle = await req.body.storyTitle;
    const category = await req.body.category;
    const storySummary = await req.body.storySummary ? await req.body.storySummary : 'null';
    const storyBody = await req.body.storyBody;
    const storyTags = await req.body.storyTags;
    const userID = await req.body.userID;


    let date = momentTime.tz(new Date(), "Asia/Dhaka").format()
    const filterDate = date.split('T')[0]

    if (file) {

        if (file.size > 5000000) {
            return res.status(500).json({ msg: 'Image is too large. Please Upload less than 5mb' })
        }

        //Generating Unique Name for Image

        function makeid(length) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        // Storing Image

        file.name = `${makeid(50)}${filterDate}${file.name}`

        file.mv(`${__dirname}/uploads/${file.name}`, err => {
            if (err) {
                console.log(err); next()
                return res.status(500).json({ msg: 'can not upload image' })
            }
        })
    }
    // Sending Post

    const sqlInsert = "INSERT INTO stories (title, community_id, short_story, post_thumbnail, body, tags, user_id) values(?, ?, ?, ?, ?, ?, ?)";
    db.query(sqlInsert, [storyTitle, category, storySummary, file.name, storyBody, storyTags, userID], (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    })

})



//Sending Post END


// })

// Post Story End








module.exports = router

