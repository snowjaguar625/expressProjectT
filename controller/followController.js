const db = require('../api/DB');

const pressedFollow = async (req, res, next) => {
    const followerID = await req.body.followerID
    const followeeID = await req.body.followeeID
    const sqlInsert = `CALL autofollowers('${followeeID}', ${followerID});`
    db.query(sqlInsert, [followerID, followeeID], (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)

    })
}

//Get Follower

const getFollower = async (req, res, next) => {
    const ids = await req.query.id
    const userID = ids.split(',')[0]
    const activityID = ids.split(',')[1]
    const sqlSelect = `SELECT * from followers where follower_id = '${activityID}' AND user_id = '${userID}' AND type = 1`
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err);
            next()
        }
        res.send(documents)

    })
}

//Get Follower of A User

const getUserFollower = async (req, res, next) => {
    const id = await req.query.id
    const userID = id.split(',')[0]
    const show = id.split(',')[1]
    const sqlCount = `SELECT COUNT(*) as follower_count from followers JOIN users u on followers.follower_id = u.user_id WHERE followers.user_id = ${userID} AND type = 1 AND u.is_deleted = 0;`
    const sqlSelect = `SELECT * FROM followers WHERE user_id = '${userID}' AND type = 1 ORDER BY created_at DESC LIMIT 10 OFFSET ${show}`
    if (userID && show) {
        db.query(sqlCount, (err, count) => {
            if (err) {
                console.log(err)
            }
            db.query(sqlSelect, (err, documents) => {
                
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
                    res.send({ data: documents.filter(follow => followee.includes((follow.user_id))), count: count })
                })
                
            })
        })
    }
}

// User Following

const getUserFollowing = async (req, res, next) => {
    const id = await req.query.id
    const userID = id.split(',')[0]
    const show = id.split(',')[1]
    const sqlCount = `SELECT COUNT(*) as  following_count from followers JOIN users u on followers.follower_id = u.user_id WHERE u.user_id = ${userID} AND type = 1 AND u.is_deleted = 0;`
    const sqlSelect = `SELECT * FROM followers WHERE follower_id = '${userID}' AND type = 1  ORDER BY created_at DESC LIMIT 10 OFFSET ${show}`
    if (userID && show) {
        db.query(sqlCount, (err, count) => {
            if (err) {
                console.log(err)
            }
            db.query(sqlSelect, (err, documents) => {

                if (err) {
                    console.log(err); next()
                }
                const followingID = documents.map(id => id.user_id)
                const follower = JSON.stringify(followingID)

                const sqlSelect = `SELECT user_id, fullname, username, avatar FROM users`
                db.query(sqlSelect, (err, documents) => {
                    if (err) {
                        console.log(err); next()
                    }
                    res.send({data: documents.filter(follow => follower.includes((follow.user_id))), count: count})
                })
            })
        })
    }
}

module.exports = {
    pressedFollow,
    getFollower,
    getUserFollower,
    getUserFollowing
}