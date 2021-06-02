const express = require('express')
const router = express()
const cors = require('cors')
const bodyParser = require('body-parser')

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }));

const notificationController = require('../controller/NotificationController')
const { requirePath } = require('../middleware/authMiddleWare')

router.get('/getNotifications', requirePath,  notificationController.getNotifications)
router.get('/getNotiSettings', requirePath,  notificationController.getNotiSettings)
router.post('/notificationSettings', requirePath, notificationController.notificationSettings)
router.post('/seenNoti/:id', requirePath, notificationController.seenNoti)

module.exports = router