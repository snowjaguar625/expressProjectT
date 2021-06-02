const express = require('express');
const cors = require('cors')

const router = express()

const adminReportontroller = require('../controller/AdminReportController/AdminReportController');
const { requirePath } = require('../middleware/authMiddleWare');
const { adminPath } = require('../middleware/adminMiddleware');

router.get('/storyCountReports', adminPath, adminReportontroller.storyCountReports)
router.get('/articleCountReports', adminPath, adminReportontroller.articleCountReports)

router.post('/storyReport', requirePath, adminReportontroller.storyReport)
router.post('/storyCommentReport', requirePath, adminReportontroller.storyCommentReport)
router.post('/storyReplyCommentReport', requirePath, adminReportontroller.storyReplyCommentReport)

router.post('/articleReport', requirePath, adminReportontroller.articleReport)
router.post('/articleCommentReport', requirePath, adminReportontroller.articleCommentReport)
router.post('/articleReplyCmntReport', requirePath, adminReportontroller.articleReplyCmntReport)

module.exports = router