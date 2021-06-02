
const express = require('express');
const cors = require('cors')
const db = require('./DB')

const router = express()
router.use(cors())


const storyLikes = require('../controller/storyLikesController')
const { requirePath } = require('../middleware/authMiddleWare')

// story like

// router.post('/prssedStoryLike', requirePath, storyLikes.pressLike)

// Delete like

// router.post('/deleteStoryLike', requirePath, storyLikes.deleteLike)

// All like count

router.get('/allStoryLikes', storyLikes.allStoryLikes)

// Post Like

router.post('/storyLike', requirePath,  storyLikes.storyLike)

// / All particular Uer Like

router.get('/getParticularStoryLike', async (req, res, next) => {
    const ids = await req.query.id
    const userID = ids.split(',')[0]
    const storyID = ids.split(',')[1]
    const sqlSelect = `SELECT * from story_likes where story_id = '${storyID}' AND user_id = '${userID}'`
    db.query(sqlSelect, (err, documents) => {
        if (err) {
             console.log(err); next()
        }
        res.send(documents)
    })

})

//  All particular Uer Like

router.get('/allStoryLikesOfParticularUser', async (req, res, next) => {
    const id = await req.query.id
    const sqlSelect = `SELECT stories.story_id,title,community_name,short_story,img_url,body,stories.user_id,stories.created_at,sl.story_id,sl.user_id,sl.created_at,u.user_id,first_name,username,email,gender,DOB,avatar,u.created_at FROM stories INNER JOIN story_likes sl on stories.story_id = sl.story_id INNER JOIN users u on sl.user_id = u.user_id WHERE stories.user_id = '${id}'`
    db.query(sqlSelect, (err, documents) => {
        if (err) {
             console.log(err); next()
        }
        res.send(documents)
    })
})

module.exports = router
