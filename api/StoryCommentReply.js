const express = require('express')
const router = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const { requirePath } = require('../middleware/authMiddleWare')


router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static('uploads'))

const replyCommentController = require('../controller/storyReplyCommentController')

router.post('/replyCommentPost', requirePath, replyCommentController.replyComment)
router.get('/getReplyComments', requirePath, replyCommentController.getReplyComments)



module.exports = router