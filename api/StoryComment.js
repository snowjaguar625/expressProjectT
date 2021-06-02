const express = require('express')
const router = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./DB')


router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static('uploads'))

const commentController = require('../controller/storyCommentController')
const {requirePath} = require('../middleware/authMiddleWare')

//POST COMMENT

router.post('/postComment', requirePath, commentController.postComment)

//GET COMMENT

router.get('/getComment', commentController.allCommentsOfAPost)

//GET Reply COMMENT

router.post('/postReplyComment', async (req, res, next) => {
    const commentText = await req.body.commentText
    const storyID = await req.body.storyID
    const userID = await req.body.userID
    console.log('commenttxt', commentText, 'storyID', storyID, 'user', userID)

    // const sqlInsert = `INSERT INTO story_comments_reply (comment_text, story_id, user_id) VALUES ( ? , ? , ? , ? )`
    // db.query(sqlInsert, [commentText, storyID, userID], (err, documents) => {
    //     if (err) {
    //          console.log(err); next()
    //     }
    //     res.send(documents)
    //     
    // })
})

//  All Comment PArticular User

router.get('/allCommentsOfParticularUser', async (req, res, next) => {
    const id = await req.query.id
    console.log(id)
    const sqlSelect = `SELECT stories.story_id,title,community_name,short_story,img_url,body,tag_name,stories.user_id,stories.created_at,comment_id,comment_text,sc.story_id,sc.user_id,sc.created_at, u.user_id, username, avatar FROM stories INNER JOIN story_comments sc on stories.story_id = sc.story_id INNER JOIN users u on sc.user_id = u.user_id WHERE stories.user_id = '${id}'`
    db.query(sqlSelect, (err, documents) => {
        if (err) {
             console.log(err); next()
        }
        res.send(documents)
        
    })
})

//Edit SToryComment

router.post('/editStoryComment', requirePath, commentController.editComment)

module.exports = router

