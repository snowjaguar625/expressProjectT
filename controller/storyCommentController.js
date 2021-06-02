const db = require('../api/DB')

// All Comments of post

const allCommentsOfAPost = async (req, res, next) => {
    const ids = await req.query.id
    const storyID = ids.split(',')[0]

    const sqlSelect = `SELECT comment_id, message, comments.createdAt, fullname, avatar, story_id, u.user_id, username FROM comments INNER JOIN users u on comments.user_id = u.user_id WHERE story_id = '${storyID}' AND comments.is_deleted = 0 ORDER BY comments.createdAt DESC`;
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        // res.send(documents)
        const SqlgetReply = `SELECT comment_id, sc_reply_id, sc_reply_text, story_comments_reply.created_at, fullname, story_id, u.user_id, avatar, username FROM story_comments_reply INNER JOIN users u on story_comments_reply.user_id = u.user_id WHERE story_id = '${storyID}' AND story_comments_reply.is_deleted = 0`;
        db.query(SqlgetReply, (err, doc) => {
            if (err) {
                console.log(err)
            }
            res.send({comment: documents, replyComment: doc})
        })
    })
}

// Post Comment

const postComment = async (req, res, next) => {
    const commentText = await req.body.commentText
    const storyID = await req.body.storyID
    const userID = await req.body.userID

    const sqlInsert = `INSERT INTO comments (message, story_id, user_id) VALUES ( ? , ? , ? )`
    db.query(sqlInsert, [commentText, storyID, userID], (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
        
    })
}

//Edit Comment 

const editComment = async (req, res, next) => {
    const commentText = await req.body.commentText
    const cmntID = await req.body.cmntID

    const sqlUpdateStoryCmnt = `UPDATE fnmotivation.comments t SET t.message = '${commentText}' WHERE comment_id = ${cmntID}`;
    db.query(sqlUpdateStoryCmnt, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    })

}
module.exports = {
    allCommentsOfAPost,
    postComment,
    editComment
}