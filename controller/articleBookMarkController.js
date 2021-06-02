const db = require('../api/DB');

const getArticleBookMark = async (req, res, next) => {
    
    const id = await req.query.id
    const userID = id.split(',')[0]
    const articleID = id.split(',')[1]

    const sqlBookMark = `SELECT * from posts_bookmarks WHERE post_id = '${articleID}' AND user_id = '${userID}' AND type = 1`
    db.query(sqlBookMark, (err, doc) => {
        if (err) {
            console.log(err)
            next()
        }
        res.send(doc)
    })
}

const articleBookMark = async (req, res, next) => {
    const id = await req.query.id
    const userID = id.split(',')[0]
    const articleID = id.split(',')[1]

    const sqlPressBookMark = `CALL postsbookmarks( '${articleID}','${userID}');`;
    db.query(sqlPressBookMark, (err, doc) => {
        if (err) {
            console.log(err)
            next()
        }
        
        res.send(doc)
    })
}

module.exports = {
    getArticleBookMark,
    articleBookMark
}