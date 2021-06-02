const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
require('dotenv').config();


// API

const login = require('./api/Login')

const follow = require('./api/Follow')
const user = require('./api/User')

const notification = require('./api/Notifications')
const storyEmailNotification = require('./api/StoryEmailNotification')
const articleEmailNotification = require('./api/ArticleEmailNotifications')

const story = require('./api/Story')
const postStory = require('./PostStory')
const TestPostStory = require('./TestPostStory')
const storyLike = require('./api/StoryLike')
const storyBookMark = require('./api/StoryBookMark')
const storyComment = require('./api/StoryComment')
const storyCommentReply = require('./api/StoryCommentReply')

const getArticle = require('./ArticleAPI/GetArticle')
const articleLike = require('./ArticleAPI/ArticleLike')
const articleBookMark = require('./ArticleAPI/AricleBookMark')
const articleComment = require('./ArticleAPI/ArticleComment')
const community = require('./api/Community')
const articleCommentReply = require('./ArticleAPI/ArticleCommentReply')

// Admin
const adminUserInfo = require('./AdminApi/AdminUserInfo')
const allUsers = require('./AdminApi/adminApi')
const adminUserAll = require('./AdminApi/adminApiUsersAll')
const adminOthers = require('./AdminApi/adminOthers')
const adminReports = require('./AdminApi/AdminReports')
const ReportApi = require('./AdminApi/ReportApi')


const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/postImage'));



// API USE
app.use(allUsers)
app.use(adminUserInfo)
app.use(adminUserAll)
app.use(adminOthers)
app.use(adminReports)
app.use(ReportApi)

app.use(login)
app.use(story)
app.use(user)
app.use(notification)

app.use(follow)

app.use(getArticle)
app.use(articleLike)
app.use(articleBookMark)
app.use(articleComment)
app.use(articleCommentReply)

app.use(storyLike)
app.use(storyBookMark)
app.use(storyComment)
app.use(storyCommentReply)

// app.use(postStory)
app.use(TestPostStory)

app.use(community)

app.use(storyEmailNotification)
app.use(articleEmailNotification)

app.use(express.static(path.join(__dirname, 'build')));


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// app.get('/', async (req, res) => {
//     res.send('Server is Up')

// })

app.get('/rcmtest', async(req, res) => {
    res.sendFile('test.html');
})


const PORT = process.env.PORT || 5000;

app.listen(PORT)