
const express = require('express');
const cors = require('cors')

const router = express()
router.use(cors())

const adminUserInfo = require('../controller/adminUserInfoController')
const { adminPath } = require('../middleware/adminMiddleware')

router.get('/userInfo/:id', adminPath, adminUserInfo.userInfo)
router.get('/userStories/:id', adminPath, adminUserInfo.userStories)

router.get('/userStoriesQuery/:id', adminPath, adminUserInfo.userStoriesQuery)

router.get('/getUserArticle/:id', adminPath, adminUserInfo.getUserArticle)
router.get('/getUserArticleQuery/:id', adminPath, adminUserInfo.getUserArticleQuery)

router.get('/getUserBookMark/:id', adminPath, adminUserInfo.getUserBookMark)

router.get('/getFollowers/:id', adminPath, adminUserInfo.getFollowers)
router.get('/getFollowing/:id', adminPath, adminUserInfo.getFollowing)


module.exports = router