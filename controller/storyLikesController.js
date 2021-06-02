const db = require('../api/DB')


const allStoryLikes = async (req, res, next) => {
    const storyID = await req.query.id
  
    const sqlSelect = `SELECT * FROM stories_likes WHERE StoryId = '${storyID}' AND type = 1`
    db.query(sqlSelect, (err, documents) => {
        if (err) {
             console.log(err); next()
        }
        res.send(documents)
    })
}

const storyLike = async (req, res, next) =>{
    const storyID = await req.body.storyID
    const userID = await req.body.userID


    const sqlSelect = `CALL storieslikes('${storyID}', '${userID}')`
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
        
    })
}



module.exports = {
    allStoryLikes,
    storyLike
}