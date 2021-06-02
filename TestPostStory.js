
const express = require('express')
const router = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const momentTime = require('moment-timezone');
const db = require('./api/DB')
const { requirePath } = require('./middleware/authMiddleWare')
const transporter = require('./api/Email')
const fs = require('fs')


router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static('uploads'))
router.use(express.static('postImage'))


// Post Story


router.post('/imageUpload', async (req, res, next) => {
    const file = await req.files.upload
    let date = momentTime.tz(new Date(), "Asia/Dhaka").format()
    const filterDate = date.split('T')[0]

    if (file.size > 5000000) {
        return res.status(500).json({ msg: 'Image is too large. Please Upload less than 5mb' })
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

    file.mv(`${__dirname}/postImage/${file.name}`, err => {
        if (err) {
            console.log(err); next()
            return res.status(500).json({ msg: 'can not upload image' })
        }
        return res.status(200).json({
            uploaded: true,
            url: `https://api.fnmotivation.com/${file.name}`
        })
    })
    if (!file) {
        var error = new Error('Please Upload a file')
        return (error)
    }

})




router.post('/postStory', requirePath, async (req, res, next) => {

    var file = await req.files && req.files.file;
    const storyTitle = await req.body.storyTitle;
    const category = await req.body.category;
    const storySummary = await req.body.storySummary ? await req.body.storySummary : 'null';
    const storyBody = await req.body.storyBody;
    const storyTags = await req.body.storyTags;
    const userID = await req.body.userID;
    const mail = await req.body.mail;

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

        file.name = `${makeid(50)}${filterDate}.jpg`

        file.mv(`${__dirname}/uploads/${file.name}`, err => {
            if (err) {
                console.log(err);
                return res.status(500).json({ msg: 'can not upload image' })
            }
        })


        let emailTemplate = fs.readFileSync('./emailTemplates/story-published.html', { encoding: 'utf-8' });

        const sqlEmail = `SELECT fullname, email from users where user_id = ${userID}`;

        const sqlInsert = "INSERT INTO stories (title, community_id, short_story, post_thumbnail, body, tags, user_id) values(?, ?, ?, ?, ?, ?, ?)";

        db.query(sqlInsert, [storyTitle, category, storySummary, file.name, storyBody, storyTags, userID], (err, documents) => {
            if (err) {
                console.log(err);
                next()
            }

            //Render Html

            if (mail === 'true') {
                db.query(sqlEmail, (err, doc) => {
                    if (err) {
                        console.log(err); next()
                    }
                    else {
                        emailTemplate = emailTemplate.replace('[personName]', doc[0].fullname)
                        emailTemplate = emailTemplate.replace('[post]', storyTitle)
                        const mailOptions = {
                            from: 'info@fnmotivation.com',
                            to: `${doc[0].email}`,
                            subject: "FNMotivation Story Post Successfully",
                            html: emailTemplate

                        }
                        transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                console.log(err); next()
                            }
                        })
                    }
                })
            }

            res.send(documents)



        })

        // Sending Post

    }

    if (!file) {

        let emailTemplate = fs.readFileSync('./emailTemplates/story-published.html', { encoding: 'utf-8' });

        const sqlEmail = `SELECT fullname, email from users where user_id = ${userID}`;

        const sqlInsert = "INSERT INTO stories (title, community_id, short_story,body, tags, user_id) values(?, ?, ?, ?, ?, ?)";

        db.query(sqlInsert, [storyTitle, category, storySummary, storyBody, storyTags, userID], (err, documents) => {
            if (err) {
                console.log(err); next()
            }

            //Render Html

            if (mail === 'true') {
                db.query(sqlEmail, (err, doc) => {
                    if (err) {
                        console.log(err); next()
                    }
                    else {
                        emailTemplate = emailTemplate.replace('[personName]', doc[0].fullname)
                        emailTemplate = emailTemplate.replace('[post]', storyTitle)
                        const mailOptions = {
                            from: 'info@fnmotivation.com',
                            to: `${doc[0].email}`,
                            subject: "FNMotivation Story Post Successfully",
                            html: emailTemplate

                        }
                        transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                console.log(err); next()
                            }
                            else {
                                next()
                            }
                        })
                    }
                })
            }

            res.send(documents)

        })

    }

})

// Post Story End



module.exports = router

