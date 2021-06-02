
const express = require('express');
const cors = require('cors')

const router = express()
router.use(cors())


const followController = require('../controller/followController')
const {requirePath} = require('../middleware/authMiddleWare')

// Follow

router.post('/prssedFollow', requirePath, followController.pressedFollow)

//Particular Follow 

router.get('/getFollow',  requirePath, followController.getFollower)

//Particular Follow 

router.get('/getUserFollower',  followController.getUserFollower)

//Particular Following

router.get('/getUserFollowing',  followController.getUserFollowing)


module.exports = router
