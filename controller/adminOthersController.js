const db = require('../api/DB');

const storyCommentsAdmin = async (req, res, next) => {
    const { id, active } = await req.params
    const show = await req.query.show

    const sqlComment = `SELECT comment_id, message, comments.is_deleted, comments.createdAt, fullname, avatar, s.story_id, s.title, u.user_id, username FROM comments INNER JOIN  users u on comments.user_id = u.user_id join stories s on comments.story_id = s.story_id WHERE comments.story_id = '${id}' ORDER BY comments.createdAt DESC LIMIT 10 OFFSET ${show}`
    db.query(sqlComment, (err, com) => {
        if (err) {
            console.log(err); next()
        }
        else {
            const SqlgetReply = `SELECT comment_id, sc_reply_id,  story_comments_reply.is_deleted, sc_reply_text, story_comments_reply.created_at, fullname, story_id, u.user_id, avatar, username FROM story_comments_reply INNER JOIN users u on story_comments_reply.user_id = u.user_id WHERE story_id = '${id}'  LIMIT 10 OFFSET ${show}`;
            db.query(SqlgetReply, (err, replyCom) => {
                if (err) {
                    console.log(err); next()
                }
                res.send({ comment: com, replyComment: replyCom })
            })
        }
    })
}

const articleCommentsAdmin = async (req, res, next) => {
    const { id, active } = await req.params
    const show = await req.query.show

    const sqlComment = `SELECT posts_comments_id,  message, posts_comments.is_deleted,  posts_comments.createdAt, p.title AS post_title, p.created_at AS post_created_at, p.user_id AS post_creator_id, users.username AS post_creator_username, users.fullname AS post_creator_fullname ,u.fullname as commenter_fullname, u.avatar as commenter_avatar , post_id, u.user_id as commenter_user_id, u.username As commenter_username FROM posts_comments INNER JOIN users u on posts_comments.user_id = u.user_id JOIN posts p on posts_comments.post_id = p.id JOIN users on p.user_id = users.user_id WHERE post_id = '${id}' ORDER BY  posts_comments.createdAt DESC`
    db.query(sqlComment, (err, com) => {
        if (err) {
            console.log(err); next()
        }
        else {
            const SqlgetReply = `SELECT posts_comments_id, pc_reply_id, posts_comments_reply.is_deleted,  pc_reply_text, posts_comments_reply.created_at, fullname, post_id, u.user_id, avatar, username FROM posts_comments_reply INNER JOIN users u on posts_comments_reply.user_id = u.user_id WHERE  post_id = '${id}';`
            db.query(SqlgetReply, (err, replyCom) => {
                if (err) {
                    console.log(err); next()
                }
                res.send({ comment: com, replyComment: replyCom })
            })
        }
    })
}

const banComment = async (req, res, next) => {
    const id = await req.params.id
    
    const sqlComment = `UPDATE fnmotivation.comments t SET t.is_deleted = 1 WHERE comment_id = ${id}`
    db.query(sqlComment, (err, doc) => {
        if (err) {
            console.log(err); next()
        }
        res.send(doc)
    })
}



const unBanComment = async (req, res, next) => {
    const id = await req.params.id

    const sqlComment = `UPDATE fnmotivation.comments t SET t.is_deleted = 0 WHERE comment_id = ${id}`
    db.query(sqlComment, (err, doc) => {
        if (err) {
            console.log(err); next()
        }
        res.send(doc)
    })
}
const banReplyComment = async (req, res, next) => {
    const id = await req.params.id
    
    const sqlComment = `UPDATE fnmotivation.story_comments_reply t SET t.is_deleted = 1 WHERE sc_reply_id = ${id}`
    db.query(sqlComment, (err, doc) => {
        if (err) {
            console.log(err); next()
        }
        res.send(doc)
    })
}

const unBanReplyComment = async (req, res, next) => {
    const id = await req.params.id

    const sqlComment = `UPDATE fnmotivation.story_comments_reply t SET t.is_deleted = 0 WHERE sc_reply_id = ${id}`
    db.query(sqlComment, (err, doc) => {
        if (err) {
            console.log(err); next()
        }
        res.send(doc)
    })
}

//Article Comment && Reply


const banArticleComment = async (req, res, next) => {
    const id = await req.params.id
    
    const sqlComment = `UPDATE fnmotivation.posts_comments t SET t.is_deleted = 1 WHERE posts_comments_id = ${id}`
    db.query(sqlComment, (err, doc) => {
        if (err) {
            console.log(err); next()
        }
        res.send(doc)
    })
}



const unBanArticleComment = async (req, res, next) => {
    const id = await req.params.id

    const sqlComment = `UPDATE fnmotivation.posts_comments t SET t.is_deleted = 0 WHERE posts_comments_id = ${id}`
    db.query(sqlComment, (err, doc) => {
        if (err) {
            console.log(err); next()
        }
        res.send(doc)
    })
}
const banReplyArticleComment = async (req, res, next) => {
    const id = await req.params.id
    
    const sqlComment = `UPDATE fnmotivation.posts_comments_reply t SET t.is_deleted = 1 WHERE pc_reply_id = ${id}`
    db.query(sqlComment, (err, doc) => {
        if (err) {
            console.log(err); next()
        }
        res.send(doc)
    })
}

const unBanReplyArticleComment = async (req, res, next) => {
    const id = await req.params.id

    const sqlComment = `UPDATE fnmotivation.posts_comments_reply t SET t.is_deleted = 0 WHERE pc_reply_id = ${id}`
    db.query(sqlComment, (err, doc) => {
        if (err) {
            console.log(err); next()
        }
        res.send(doc)
    })
}

module.exports = {
    storyCommentsAdmin,
    banComment,
    unBanComment,
    banReplyComment,
    unBanReplyComment,
    articleCommentsAdmin,
    banArticleComment,
    unBanArticleComment,
    banReplyArticleComment,
    unBanReplyArticleComment
}