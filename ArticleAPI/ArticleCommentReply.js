const express = require('express')
const router = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const { requirePath } = require('../middleware/authMiddleWare')
const replyArticleCommentController = require('../controller/articleCommentReplyController')

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static('uploads'))



router.post('/replyArticleCommentPost', requirePath, replyArticleCommentController.replyArticleCommentPost)

module.exports = router