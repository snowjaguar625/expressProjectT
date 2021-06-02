const db = require('../api/DB');

//All BookMark o fa User

const allBookMarks = async (req, res, next) => {
    const ids = await req.query.id

    const userID = ids.split(',')[0]
    const storyID = ids.split(',')[1]
    const sqlSelect = `SELECT * from stories_bookmarks where story_id = '${storyID}' AND user_id = '${userID}' AND type = 1`
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err);
            next()
        }
        res.send(documents)
    })
}

const bookMark = async (req, res, next) => {
    const ids = await req.query.id

    const userID = ids.split(',')[0]
    const storyID = ids.split(',')[1]

    const sqlSelect = `CALL stories_bookmarks('${storyID}', '${userID}')`
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err);
            next()
        }
        res.send(documents)
    })
}
const getUserBookMark = async (req, res, next) => {
    const id = await req.query.id
    const userID = id.split(',')[0]
    const show = id.split(',')[1]

    const sqlCountArticle = `SELECT count(*) as post_book_count from posts_bookmarks INNER JOIN posts p on posts_bookmarks.post_id = p.id WHERE posts_bookmarks.user_id = ${userID} AND p.is_deleted = 0 AND type = 1`
    const sqlCount = `SELECT count(s_bookmark_id) as book_count from stories_bookmarks INNER JOIN stories s on stories_bookmarks.story_id = s.story_id WHERE stories_bookmarks.user_id = ${userID} AND s.is_deleted = 0 AND type = 1;`
    const sqlSelect = `SELECT s_bookmark_id,stories_bookmarks.story_id,stories_bookmarks.user_id,stories_bookmarks.Type,stories_bookmarks.created_at,stories_bookmarks.updated_at,s.story_id,s.title,s.community_id,s.short_story,s.body,s.post_thumbnail,s.tags,s.user_id,s.created_at,s.updated_at,s.is_deleted, c.community_title FROM stories_bookmarks INNER JOIN stories s on stories_bookmarks.story_id = s.story_id INNER JOIN communities c on s.community_id = c.id  WHERE s.is_deleted = 0 AND stories_bookmarks.Type = 1 AND stories_bookmarks.user_id = '${userID}' AND type = 1 ORDER BY stories_bookmarks.created_at DESC LIMIT 10 OFFSET ${show}`
    const sqlArticle = `SELECT p_bookmark_id,posts_bookmarks.user_id,Type,posts_bookmarks.updated_at,p.id AS post_id,title, p.created_at, redirect_link,community_id,source_text,img_link,description,c.id AS community_id,community_title,image_url FROM posts_bookmarks JOIN posts p on posts_bookmarks.post_id = p.id JOIN communities c on c.id = p.community_id WHERE p.is_deleted = 0 AND posts_bookmarks.type = 1 AND posts_bookmarks.user_id = ${userID} ORDER BY posts_bookmarks.updated_at DESC LIMIT 10  OFFSET ${show}`

    if (userID && show) {
        db.query(sqlCount, (err, storyCount) => {
            if (err) {
                console.log(err); next()
            }
            db.query(sqlSelect, (err, story) => {
                if (err) {
                    console.log(err); next()
                }
                db.query(sqlArticle, (err, article) => {
                    if (err) {
                        console.log(err); next()
                    }
                    db.query(sqlCountArticle, (err, articleCount) => {
                        if (err) {
                            console.log(err); next()
                        }
                        res.send({ story: story, article: article, storyCount: storyCount, articleCount: articleCount })
                    })
                })
            })

        })
    }
}

module.exports = {
    allBookMarks,
    getUserBookMark,
    bookMark
}