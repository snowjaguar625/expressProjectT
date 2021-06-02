const db = require('../api/DB')

const replyArticleCommentPost = async (req, res, next) => {
    const {replyTXT, articleCmntID, postID,userID} = await req.body
    const SqlArticleReplyComment = `INSERT INTO posts_comments_reply (posts_comments_id, user_id, pc_reply_text, post_id) VALUES ( ? , ? , ? , ?)`
    db.query(SqlArticleReplyComment, [articleCmntID, userID, replyTXT, postID], (err, doc) =>{
        if(err){
            console.log(err)
            next()
        }
        res.send(doc)
        
    })


}


module.exports = {
    replyArticleCommentPost
}