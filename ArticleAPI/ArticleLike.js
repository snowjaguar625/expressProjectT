
const express = require('express');
const cors = require('cors')

const router = express()
router.use(cors())

const articleLikeController = require('../controller/articleLikeController')
const { requirePath } = require('../middleware/authMiddleWare')

router.post('/articleLike', requirePath, articleLikeController.articleLike)
router.get('/allArticleLikes', articleLikeController.allArticleLikes)

module.exports = router