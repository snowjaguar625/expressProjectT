const express = require('express');
const cors = require('cors')

const router = express()

const reportController = require('../controller/ReportController/ReportController');
const { adminPath } = require('../middleware/adminMiddleware');

router.get('/countStoryReports', adminPath, reportController.countStoryReports)
router.get('/StoryReportsDetails', adminPath, reportController.StoryReportsDetails)

router.get('/countArticleReports', adminPath, reportController.countArticleReports)
router.get('/articleReportsDetails', adminPath, reportController.articleReportsDetails)

router.get('/countStoryCmntReports', adminPath, reportController.countStoryCmntReports)
router.get('/storyReportCmntDetails', adminPath, reportController.storyReportCmntDetails)

router.get('/countStoryCmntReplyeports', adminPath, reportController.countStoryCmntReplyeports)
router.get('/storyReportCmntReplyDetails', adminPath, reportController.storyReportCmntReplyDetails)

router.get('/countArticleReports', adminPath, reportController.countArticleReports)
router.get('/articleReportsDetails', adminPath, reportController.articleReportsDetails)

router.get('/countArticleCmntReports', adminPath, reportController.countArticleCmntReports)
router.get('/articleReportCmntDetails', adminPath, reportController.articleReportCmntDetails)

router.get('/countArticleCmntReplyeports', adminPath, reportController.countArticleCmntReplyeports)
router.get('/articleReportCmntReplyDetails', adminPath, reportController.articleReportCmntReplyDetails)

router.post('/deleteReport/:id', adminPath, reportController.deleteReport)



module.exports = router