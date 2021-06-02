const db = require('../api/DB');

const userInfo = async (req, res, next) => {
    const id = await req.params.id
    const sqlUser = `SELECT fullname, username, avatar, user_id, email, about FROM users WHERE user_id = '${id}'`
        db.query(sqlUser, (err, doc) => {
            if (err) {
                console.log(err); next()
            }
            res.send(doc)
        })
    

}

const userStories = async (req, res, next) => {
    const id = await req.params.id
    const show = await req.query.show
    const sqlUser = `SELECT * FROM stories WHERE user_id = '${id}' LIMIT 10 OFFSET ${show}`
        db.query(sqlUser, (err, doc) => {
            if (err) {
                console.log(err); next()
                res.status(500).send({ error: 'Something failed!' }); next()
            }
            res.send(doc)
        })

}

const userStoriesQuery = async (req, res, next) => {
    const id = await req.params.id
    const search = await req.query.search
    const sqlUser = `SELECT story_id, short_story, post_thumbnail, title, tags, created_at, is_deleted FROM stories WHERE user_id = '${id}' AND (stories.story_id LIKE ('%${search}%') OR title LIKE ('%${search}%') OR tags LIKE ('%${search}%') OR created_at LIKE ('%${search}%'))`;

    if (id) {
        db.query(sqlUser, (err, doc) => {
            if (err) {
                console.log(err); next()
                res.status(500).send({ error: 'Something failed!' }); next()
            }
            res.send(doc)
        })
    }

}

const getUserArticle = async (req, res, next) => {
    const id = await req.params.id
    const show = await req.query.show

    const sqlUser = `SELECT * FROM posts WHERE user_id = '${id}' LIMIT 10 OFFSET ${show}`
    if (show && id) {
        db.query(sqlUser, (err, doc) => {
            if (err) {
                console.log(err); next()
                res.status(500).send({ error: 'Something failed!' }); next()
            }
            res.send(doc)
        })
    }

}

const getUserArticleQuery = async (req, res, next) => {
    const id = await req.params.id
    const search = await req.query.search

    const sqlSelect = `SELECT id, title, img_link, redirect_link, created_at, is_deleted FROM posts WHERE user_id = '${id}' AND (posts.id LIKE ('%${search}%') OR redirect_link LIKE ('%${search}%') OR created_at LIKE ('%${search}%'))`;

    if (search && id) {
        db.query(sqlSelect, (err, documents) => {
            if (err) {
                console.log(err); next()
            }
            res.send(documents)
        });
    }
}

const getUserBookMark = async (req, res, next) => {
    const id = await req.params.id
    const show = await req.query.show

    const sqlUser = `SELECT s_bookmark_id,stories_bookmarks.story_id,stories_bookmarks.user_id,stories_bookmarks.Type,stories_bookmarks.created_at,stories_bookmarks.updated_at,s.story_id,s.title,s.community_id,s.short_story,s.body,s.post_thumbnail,s.tags,s.user_id,s.created_at,s.updated_at,s.is_deleted, c.community_title FROM stories_bookmarks INNER JOIN stories s on stories_bookmarks.story_id = s.story_id INNER JOIN communities c on s.community_id = c.id  WHERE s.is_deleted = 0 AND stories_bookmarks.Type = 1 AND stories_bookmarks.user_id = '${id}' AND type = 1 ORDER BY stories_bookmarks.created_at DESC LIMIT 10 OFFSET ${show}`
    if (show && id) {
        db.query(sqlUser, (err, doc) => {
            if (err) {
                console.log(err); next()
                res.status(500).send({ error: 'Something failed!' }); next()
            }
            res.send(doc)
        })
    }

}

const getFollowers = async (req, res, next) => {
    const id = await req.params.id
    const show = await req.query.show

    const sqlUser = `SELECT * FROM followers WHERE follower_id = '${id}' AND type = 1   LIMIT 10 OFFSET ${show}`
    if (show && id) {
        db.query(sqlUser, (err, documents) => {

            if (err) {
                console.log(err); next()
            }
            const followerID = documents.map(id => id.follower_id)
            const followee = JSON.stringify(followerID)

            const sqlSelect = `SELECT user_id, fullname, username, avatar FROM users`
            db.query(sqlSelect, (err, documents) => {
                if (err) {
                    console.log(err); next()
                }
                res.send(documents.filter(follow => followee.includes((follow.user_id))))

            })

        })
    }

}

const getFollowing = async (req, res, next) => {
    const id = await req.params.id
    const show = await req.query.show

    const sqlUser = `SELECT * FROM followers WHERE user_id = '${id}' AND type = 1  LIMIT 10 OFFSET ${show}`
    if (show && id) {
        db.query(sqlUser, (err, documents) => {

            if (err) {
                console.log(err); next()
            }
            const followerID = documents.map(id => id.follower_id)
            const followee = JSON.stringify(followerID)

            const sqlSelect = `SELECT user_id, fullname, username, avatar FROM users`
            db.query(sqlSelect, (err, documents) => {
                if (err) {
                    console.log(err); next()
                }
                res.send(documents.filter(follow => followee.includes((follow.user_id))))

            })

        })
    }

}

module.exports = {
    userInfo,
    userStories,
    userStoriesQuery,
    getUserArticle,
    getUserArticleQuery,
    getUserBookMark,
    getFollowers,
    getFollowing
}