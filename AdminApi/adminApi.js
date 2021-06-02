
const express = require('express');
const cors = require('cors')

const router = express()

router.use(cors())

const allUserController = require('../controller/adminApiController')
const { adminPath } = require('../middleware/adminMiddleware')


router.get('/allAdminStories/:active/:time/:cid', adminPath, allUserController.allAdminStories)
router.get('/countStories',  adminPath, allUserController.countStories)

router.get('/searchPost', adminPath, allUserController.searchPost)

router.get('/allAdminArticle/:active/:time/:cid', adminPath, allUserController.allAdminArticle)
router.get('/countArticles',  adminPath, allUserController.countArticles)

router.get('/searchArticle', adminPath, allUserController.searchArticle)

router.get('/adminUserDataExport', allUserController.adminUserDataExport)

router.get('/adminLogin', allUserController.adminLogin)

router.post('/banStories/:id', adminPath, allUserController.banStories )
router.post('/unBanStories/:id', adminPath, allUserController.unBanStories )

router.post('/banArticles/:id', adminPath, allUserController.banArticles )
router.post('/unBanArticles/:id', adminPath, allUserController.unBanArticles )

module.exports = router