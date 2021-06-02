const express = require('express')
const cors = require('cors')

const { requirePath } = require('../middleware/authMiddleWare')
const router = express()

router.use(cors())

const storyBookMarkController = require('../controller/storyBookMarkController')

// particular USer Bookmark

router.get('/getStorybookmarks', requirePath, storyBookMarkController.allBookMarks)

// story like

// router.post('/prssedStoryBookMark', requirePath, storyBookMarkController.pressedBookMark)

// Delete like

// router.post('/deleteBookMark', requirePath, storyBookMarkController.deleteBookMark)


// particular USer Bookmark

router.get('/getUserbookmarks',  storyBookMarkController.getUserBookMark)

// Bookmark

router.post('/bookMark', requirePath, storyBookMarkController.bookMark)

// User like count

// const userID = ids.split(',')[0]
// const storyID = ids.split(',')[1]

module.exports = router
