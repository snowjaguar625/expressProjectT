const express = require('express')
const router = express()
const cors = require('cors')
const bodyParser = require('body-parser')


router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static('uploads'))

const { requirePath } = require('../middleware/authMiddleWare')
const articleCommentController = require('../controller/ArticleCommentController')

router.get('/allArticleCommentsOfAPost', articleCommentController.allArticleCommentsOfAPost)
router.post('/postArticleComment', requirePath, articleCommentController.postArticleComment)
router.post('/editArticleComment', requirePath, articleCommentController.editArticleComment)

module.exports = router