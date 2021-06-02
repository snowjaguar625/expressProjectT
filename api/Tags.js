const express = require('express')
const cors = require('cors')
const db = require('./DB')


const router = express()
router.use(cors())


// Get All Story Tags

router.get('/AllStoryTags', async (req, res, next) => {
    const id = await req.query.id
    const sqlGetTagID = `SELECT * FROM tags`;
    db.query(sqlGetTagID, (err, documents) => {
        if (err) {
             console.log(err); next()
        }
        res.send(documents)
    })
})

// Get Particular Story Tags

router.get('/particularPostTag', async (req, res, next) => {
    const id = await req.query.id
    const sqlGetTagID = `SELECT * FROM story_tags INNER JOIN tags t on story_tags.tag_id = t.tag_id WHERE story_id = '${id}'`;
    db.query(sqlGetTagID, (err, documents) => {
        if (err) {
             console.log(err); next()
        }
        res.send(documents)
    })
})

module.exports = router