const db = require('../api/DB')

// All Comments of post

const allArticleCommentsOfAPost = async (req, res, next) => {
    const id = await req.query.id

    const sqlSelect = `SELECT posts_comments_id, message, posts_comments.createdAt, fullname, avatar, post_id, u.user_id, username FROM posts_comments INNER JOIN users u on posts_comments.user_id = u.user_id WHERE post_id = '${id}' AND posts_comments.is_deleted = 0 ORDER BY  posts_comments.createdAt DESC`;
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        // res.send(documents)
        const SqlgetReply = `SELECT posts_comments_id, pc_reply_id, pc_reply_text, posts_comments_reply.created_at, fullname, post_id, u.user_id, avatar, username FROM posts_comments_reply INNER JOIN users u on posts_comments_reply.user_id = u.user_id WHERE  post_id = '${id}' AND posts_comments_reply.is_deleted = 0`;
        db.query(SqlgetReply, (err, doc) => {
            if (err) {
                console.log(err)
            }
            res.send({comment: documents, replyComment: doc})
        })
    })
}

const postArticleComment = async (req, res, next) => {
    const{ articleCommentText, userID, storyID} = await req.body

    const sqlInsert = `INSERT INTO posts_comments (message, post_id, user_id) VALUES ( ? , ? , ? )`;

    db.query(sqlInsert, [articleCommentText, storyID, userID], (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
        
    })
}

//Edit Comment

const editArticleComment = async (req, res, next) => {
    const commentText = await req.body.commentText
    const cmntID = await req.body.cmntID

    const sqlUpdateStoryCmnt = `UPDATE fnmotivation.posts_comments t SET t.message = '${commentText}' WHERE posts_comments_id = ${cmntID}`;
    db.query(sqlUpdateStoryCmnt, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    })
}

module.exports = {
    allArticleCommentsOfAPost,
    postArticleComment,
    editArticleComment
}