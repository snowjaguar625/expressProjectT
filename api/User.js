const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')


const router = express()

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static('uploads'))

// Post Story

router.use(fileUpload({
    limits: {
        // fileSize: 100000 //1mb
    }
}));

const userController = require('../controller/userController')
const { requirePath } = require('../middleware/authMiddleWare')

router.post('/userType/:id/:audience', requirePath, userController.userType)

//Register User

router.post('/registerUser', userController.registerUser)

// Get Login User

router.get('/loginUser', userController.loginUser)

// Get Particular User

router.get('/getParticularUser',  userController.getParticularUser_Data)

// Get User After Register

// router.get('/getUserAfterRegister', userController.getUserAfterRegister_Data)

// Get All User

router.get('/getAllUser', userController.allUser_Data)

//Get All Post of A Suer

router.get('/getAllPostsOfParticularUser', userController.getAllPostsOfParticularUser)

//Subscribe

router.post('/subscribe', requirePath, userController.subscribe)

//GEt Subscribe

router.get('/alreadySubscribe', requirePath, userController.alreadySubscribe)


// // Get All User

// router.get('/getParticularUserForPost', async (req, res, next) => {
//     const id = await req.query.id
//     const sqlSelect = `SELECT * FROM users WHERE user_id = '${id}'`;
//     db.query(sqlSelect, (err, documents) => {
//         if (err) {
//              console.log(err); next()
//         }
//         res.send(documents)
//     })
// })

// // User Edit Image

router.post('/editUserData', requirePath, userController.editUserData)

// // User Update no Image

router.post('/editUserDataWithOutImage', requirePath, userController.editUserDataWithOutImage)


module.exports = router