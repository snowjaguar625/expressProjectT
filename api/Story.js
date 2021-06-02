const express = require('express')
const router = express()
const cors = require('cors')
const bodyParser = require('body-parser')

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }));

const storyController = require('../controller/storyController')
const { requirePath } = require('../middleware/authMiddleWare')

// Get Story with User

router.get('/getAllstoryWithUser', storyController.getAllstoryWithUser)

// Get All Story of a particular User

router.get('/getParticularStoryWithsUser', storyController.getParticularStoryWithsUser)

// Get All Story of a particular User Seaech Result

router.get('/getUserSearchAllStory', storyController.getUserSearchAllStory)


// Get getStoryByCommunity

router.get('/getStoryByCommunity/:communityID', storyController.getStoryByCommunity)

// Get getStoryPopularByCommunity

router.get('/getStoryPopularByCommunity/:communityID', storyController.getStoryPopularByCommunity)

// Get SEarched Story

router.get('/getSearchedStory', storyController.searchStory)


router.get('/getParticularStory', async (req, res, next) => {
    const id = await req.query.id
    // const sqlSelect = `SELECT story_id, title, tag_name, community_name, short_story, img_url, body, stories.created_at, username, email, avatar, u.user_id  FROM stories INNER JOIN users u on stories.user_id = u.user_id WHERE story_id = '${id}'`;
    // db.query(sqlSelect, (err, documents) => {
    //     if (err) {
    //          console.log(err); next()
    //     }
    //     res.send(documents)
    // })
})

// Delete Particular Story

router.post('/deleteParticularStory', requirePath, storyController.deletePArticualrStory)

//Edit Story

router.post('/editStory', requirePath, storyController.editStory)

//Selected Story

router.get('/getSelectedStory', storyController.getSelectedStory)

//Following Story

router.get('/getFollowingStroy', requirePath, storyController.getFollowingStroy)

//Community Story

router.get('/getCommunityStory', requirePath, storyController.getCommunityStory)

//Popular Story

router.get('/getPopularStory', storyController.getPopularStory)

// Tag Post

router.get('/getTagPosts', storyController.getTagPosts)


module.exports = router



