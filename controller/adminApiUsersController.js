
const db = require('../api/DB');

const countUser = async (req, res, next) => {

    const sqlSelect = `SELECT COUNT(user_id) as active_count from users WHERE is_deleted = 0`;

    const sqlSelectInActive = `SELECT COUNT(user_id) as inactive_count from users WHERE is_deleted = 1`;

    db.query(sqlSelect, (err, active) => {
        if (err) {
            console.log(err); next()
        }
        db.query(sqlSelectInActive, (err, Inactive) => {
            if (err) {
                console.log(err); next()
            }
            res.send({ activeUsers: active, inActiveUsers: Inactive })
        });
    })
}

const allUsersInfo = async (req, res, next) => {
    const show = await req.query.show
    const { time, active } = await req.params

    const sqlSelect = `SELECT email, fullname, username, user_id, role, about, avatar, FacebookID, GoogleId, created_at, is_deleted FROM users WHERE is_deleted = ${active} ORDER BY user_id ${time} LIMIT 10 OFFSET ${show}`;

    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    });
}

const searchUser = async (req, res, next) => {

    const search = await req.query.search
    const sqlSelect = `SELECT email, fullname, username, user_id, about, avatar, role,  FacebookID, GoogleId, created_at, is_deleted FROM users WHERE (users.email LIKE ('%${search}%') OR fullname LIKE ('%${search}%') OR user_id LIKE ('%${search}%') OR created_at LIKE ('%${search}%') OR username LIKE ('%${search}%'))`;

    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    });
}

const banUser = async (req, res, next) => {
    const id = await req.params.id
    const sqlBan = `UPDATE fnmotivation.users t SET t.is_deleted = 1 WHERE user_id = ${id} `

    db.query(sqlBan, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    });
}

const unBanUser = async (req, res, next) => {
    const id = await req.params.id
    const sqlUnBan = `UPDATE fnmotivation.users t SET t.is_deleted = 0 WHERE user_id = ${id} `

    db.query(sqlUnBan, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    });
}


module.exports = {
    countUser,
    allUsersInfo,
    searchUser,
    banUser,
    unBanUser
}