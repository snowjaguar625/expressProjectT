const express = require('express')
const cors = require('cors')
const router = express()


router.use(cors())

const { requirePath } = require('../middleware/authMiddleWare')

const articleBookMarkController = require('../controller/articleBookMarkController.js')

router.get('/getArticlebookmarks', requirePath, articleBookMarkController.getArticleBookMark )
router.post('/articleBookMark', requirePath, articleBookMarkController.articleBookMark )

module.exports = router