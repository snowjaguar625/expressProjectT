const db = require('../api/DB')


const replyComment = async (req, res, next) => {
    const cmntID = await req.body.cmntID
    const userID = await req.body.userID
    const storyID = await req.body.storyID
    const replyTXT = await req.body.replyTXT

    const SqlReplyComment = `INSERT INTO story_comments_reply (comment_id, user_id, sc_reply_text, story_id) VALUES ( ? , ? , ? , ?)`
    db.query(SqlReplyComment, [cmntID, userID, replyTXT, storyID], (err, doc) =>{
        if(err){
            console.log(err)
            next()
        }
        res.send(doc)
        
    })

}

const getReplyComments = async (req, res, next) =>{
    const comment_id = await req.query.id
    const SqlGetReply = `SELECT users.user_id,users.fullname,users.username,users.email,users.gender,users.avatar,users.subscribe_newsletter,users.dob,users.created_at,users.updated_at,users.is_deleted,c.comment_id,c.message,c.user_id,c.story_id,c.createdAt,c.updated_at,c.is_deleted,sc_reply_id,scr.comment_id,scr.user_id,scr.sc_reply_text,scr.story_id,scr.is_deleted,u.user_id,u.fullname,u.username,u.email,u.gender,u.role,u.avatar,u.subscribe_newsletter,u.dob,u.created_at,u.updated_at,u.is_deleted FROM users RIGHT JOIN comments c on users.user_id = c.user_id LEFT JOIN story_comments_reply scr on c.comment_id = scr.comment_id LEFT JOIN users u on scr.user_id = u.user_id WHERE c.story_id = 40 AND users.is_deleted != 1 AND c.is_deleted != 1 AND COALESCE(scr.is_deleted,0) = 0  AND COALESCE(u.is_deleted,0) = ${comment_id};`
    db.query(SqlGetReply, (err, doc) =>{
        if(err){
            console.log(err)
            next()
        }
        res.send(doc)
        
    })
}
module.exports = {
    replyComment,
    getReplyComments
}