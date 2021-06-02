const db = require('../api/DB');

const articleLike = async (req, res, next) => {
    const { articleID, userID } = await req.body
    const sqlArticleLike = `call postslikes( '${articleID}','${userID}');`
    db.query(sqlArticleLike, (err, doc)=>{
        if(err){
            console.log(err)
            next()
        }
        res.send(doc)
    })

}

const allArticleLikes = async (req, res, next) => {
    const articleID = await req.query.id
    const sqlAllArticleLikes = `SELECT * FROM posts_likes WHERE PostId = ${articleID} AND  type = 1`;
    db.query(sqlAllArticleLikes, (err, doc) => {
        if (err) {
            console.log(err)
            next()
        }
        res.send(doc)
    })
}
module.exports = {
    articleLike,
    allArticleLikes
}