const express = require('express')
const router = express()
const cors = require('cors')
const bodyParser = require('body-parser')

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }));

const LoginController = require('../controller/loginController')


router.get('/getEmailforPass', LoginController.getEmailforPass)
router.post('/verifyCode', LoginController.verifyCode)
router.post('/changePassword', LoginController.changePassword)
router.get('/verifyIdentity', LoginController.verifyIdentity)
router.post('/sendContactInfo', LoginController.sendContactInfo)
router.post('/facebookSignUp', LoginController.facebookSignUp)
router.post('/googleSignUp', LoginController.googleSignUp)
router.get('/facebookLogin', LoginController.facebookLogin)
router.get('/googleLogin', LoginController.googleLogin)


module.exports = router

