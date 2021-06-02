const express = require('express');
const cors = require('cors')

const router = express()

const adminUserAll = require('../controller/adminApiUsersController')
const { adminPath } = require('../middleware/adminMiddleware')

router.get('/allUsersInfo/:active/:time',  adminPath, adminUserAll.allUsersInfo)
router.get('/countUser',  adminPath, adminUserAll.countUser)

router.get('/searchUser', adminPath, adminUserAll.searchUser)

router.post('/banUser/:id', adminPath, adminUserAll.banUser)
router.post('/unBanUser/:id', adminPath, adminUserAll.unBanUser)

module.exports = router