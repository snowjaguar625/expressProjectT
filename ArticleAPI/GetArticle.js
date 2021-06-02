const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { requirePath } = require('../middleware/authMiddleWare');


const router = express()

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }));


const articleController = require('../controller/articleController')

//Get Article

router.get('/getArticlePreview', requirePath, articleController.getArticlePreview)

//Post Articles

router.post('/postArticle',  requirePath, articleController.postArticle)

//Get Articles of a user

router.get('/getAllArticleOfParticularUser', articleController.getAllArticleOfParticularUser)

//Get All Story 

router.get('/getAllArticle', articleController.allArticle)

router.get('/getAllArticleForAll', articleController.getAllArticleForAll)

// community Article
router.get('/getCommunityArticle/:community', articleController.coummunityArticle)

//Get Particulat Story

router.get('/getParticularArticle', articleController.getPArticularArticle)

//Search Article

router.get('/getUserSearchAllArticle', articleController.getUserSearchAllArticle)

//Selected Article

router.get('/getSelectedArticle', articleController.getSelectedArticle)

//Following Article

router.get('/getAllFollowingArticle', requirePath, articleController.getAllFollowingArticle)

//Community Article

router.get('/getAllCommunityArticle', requirePath, articleController.getAllCommunityArticle)

//Popular Article

router.get('/getAllPopularArticle', articleController.getAllPopularArticle)

//Delete Article

router.post('/deleteParticularArticle', requirePath,  articleController.deleteParticularArticle)

module.exports = router;