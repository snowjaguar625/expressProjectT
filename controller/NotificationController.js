const db = require('../api/DB')

const getNotifications = async (req, res, next) => {
    const id = await req.query.id
    const userID = id.split(',')[0]
    const show = id.split(',')[1]

    const sqlCount = `SELECT COUNT(*) as notiCount FROM notifications where notification_for_user_id=${userID}`;
    const sqlSelect = `SELECT * FROM notifications where notification_for_user_id=${userID} order by created_at DESC LIMIT 12 OFFSET ${show};`;
    db.query(sqlCount, (err, count) => {
        if (err) {
            console.log(err);
            next()
        }
        db.query(sqlSelect, (err, documents) => {
            if (err) {
                console.log(err);
                next()
            }
            res.send({doc: documents, count: count})
    
        })

    })
}

const getNotiSettings = async (req, res, next) => {
    const userID = await req.query.id
    const sqlSelect = `SELECT * FROM notification_setting where user_id=${userID}`;
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err);
            next()
        }
        res.send(documents)

    })
}

const notificationSettings = async (req, res, next) => {

    let { userID, story_likes, story_comments, success_posts, article_likes, article_comments, successful_articles, followers, email_story_likes, email_story_comments, email_successful_posts, email_article_likes, email_article_comments, email_article_successfull, email_follower, email_subscription, email_following_alerts } = await req.body
    story_likes === false ? story_likes = 0 : story_likes = 1
    story_comments === false ? story_comments = 0 : story_comments = 1
    success_posts === false ? success_posts = 0 : success_posts = 1
    article_likes === false ? article_likes = 0 : article_likes = 1
    article_comments === false ? article_comments = 0 : article_comments = 1
    successful_articles === false ? successful_articles = 0 : successful_articles = 1
    followers === false ? followers = 0 : followers = 1
    email_story_likes === false ? email_story_likes = 0 : email_story_likes = 1
    email_story_comments === false ? email_story_comments = 0 : email_story_comments = 1
    email_successful_posts === false ? email_successful_posts = 0 : email_successful_posts = 1
    email_article_likes === false ? email_article_likes = 0 : email_article_likes = 1
    email_article_comments === false ? email_article_comments = 0 : email_article_comments = 1
    email_article_successfull === false ? email_article_successfull = 0 : email_article_successfull = 1
    email_follower === false ? email_follower = 0 : email_follower = 1
    email_subscription === false ? email_subscription = 0 : email_subscription = 1
    email_following_alerts === false ? email_following_alerts = 0 : email_following_alerts = 1

 
    const sqlNotification = `UPDATE fnmotivation.notification_setting t SET t.story_likes = ${story_likes}, t.story_comments = ${story_comments}, t.story_post = ${success_posts}, t.artical_likes = ${article_likes}, t.artical_comments = ${article_comments}, t.artical_post=${successful_articles}, t.followers = ${followers} WHERE user_id = ${userID}`

    db.query(sqlNotification, (err, doc) => {
        if (err) {
            console.log(err)
            next()
        }
        const sqlEmailNotification = `UPDATE fnmotivation.email_notification_setting t SET t.story_likes = ${story_likes}, t.story_comments = ${story_comments}, t.story_post = ${success_posts}, t.article_likes = ${article_likes}, t.article_comments = ${article_comments}, t.article_post=${successful_articles}, t.followers = ${followers}, t.subscription=${email_subscription}, t.following = ${email_following_alerts} WHERE user_id = ${userID}`
        db.query(sqlEmailNotification, (err, doc) => {
            if (err) {
                console.log(err)
                next()
            }
            res.send(doc)
        })
    })
}


const seenNoti = async (req, res, next) => {
    const id = await req.params.id
    const sqlSelect = `UPDATE fnmotivation.notifications t set t.is_seen = 1 WHERE notification_id = ${id}`;
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err);
            next()
        }
        res.send(documents)

    })
}


module.exports = {
    getNotifications,
    notificationSettings,
    getNotiSettings, 
    seenNoti
}