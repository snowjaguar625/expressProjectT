const express = require('express');
const cors = require('cors')

const router = express()
router.use(cors())


const adminOthersController = require('../controller/adminOthersController');
const { adminPath } = require('../middleware/adminMiddleware');

router.get('/storyCommentsAdmin/:id/:active', adminPath, adminOthersController.storyCommentsAdmin)

router.get('/articleCommentsAdmin/:id/:active', adminPath, adminOthersController.articleCommentsAdmin)

router.post('/banComment/:id', adminPath, adminOthersController.banComment)
router.post('/unBanComment/:id', adminPath, adminOthersController.unBanComment)

router.post('/banReplyComment/:id', adminPath, adminOthersController.banReplyComment)
router.post('/unBanReplyComment/:id', adminPath, adminOthersController.unBanReplyComment)

router.post('/banArticleComment/:id', adminPath, adminOthersController.banArticleComment)
router.post('/unBanArticleComment/:id', adminPath, adminOthersController.unBanArticleComment)

router.post('/banReplyArticleComment/:id', adminPath, adminOthersController.banReplyArticleComment)
router.post('/unBanReplyArticleComment/:id', adminPath, adminOthersController.unBanReplyArticleComment)


module.exports = router