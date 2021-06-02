const db = require('../api/DB');
const jwt = require('jsonwebtoken')
var md5 = require('md5');
const ExcelJS = require('exceljs');
const moment = require('moment')
const fs = require('fs');

const createToken = (id) => {
    return jwt.sign({ id }, 'UshaTale', {
    })
}

const allAdminStories = async (req, res, next) => {
    const show = await req.query.show
    const { time, active, cid } = await req.params

    const sqlSelect = `SELECT story_id,title,community_id,short_story,body,post_thumbnail,tags,stories.user_id,stories.created_at AS stories_created_at,stories.updated_at AS stories_updated_at,stories.is_deleted AS stories_is_deleted,c.id,community_title,image_url,c.is_deleted AS communtiy_is_deleted,u.user_id AS user_id_from_user_table,fullname,username,email,u.created_at AS USER_CREATED_AT,u.updated_at AS USER_updated_at,status,u.is_deleted AS USER_IS_DELETED from stories INNER JOIN communities c on stories.community_id = c.id INNER JOIN users u on stories.user_id = u.user_id WHERE stories.is_deleted = ${active}  ORDER BY stories.story_id ${time} LIMIT 10 OFFSET ${show};`;
    const sqlCom = `SELECT story_id,title,short_story,body,post_thumbnail,tags,stories.created_at AS stories_created_at,stories.updated_at AS stories_updated_at,stories.is_deleted AS stories_is_deleted,c.id AS community_id,community_title,image_url,u.user_id , fullname,username from  stories INNER JOIN communities c on stories.community_id = c.id JOIN users u on stories.user_id = u.user_id WHERE community_id = ${cid} AND stories.is_deleted = ${active} ORDER BY story_id ${time}  LIMIT 10 OFFSET ${show};`;

    if (cid !== 'null') {
        db.query(sqlCom, (err, documents) => {
            if (err) {
                console.log(err); next()
            }

            res.send(documents)
        });
    } else if (cid === 'null') {
        db.query(sqlSelect, (err, documents) => {
            if (err) {
                console.log(err); next()
            }

            res.send(documents)
        });
    }

}

const countStories = async (req, res, next) => {

    const sqlSelect = `SELECT COUNT(story_id) as active_count from stories  WHERE is_deleted = 0`;
    const sqlSelectInActive = `SELECT COUNT(story_id) as inactive_count from stories WHERE is_deleted = 1`;

    db.query(sqlSelect, (err, active) => {
        if (err) {
            console.log(err); next()
        }
        db.query(sqlSelectInActive, (err, Inactive) => {
            if (err) {
                console.log(err); next()
            }
            res.send({ activeStories: active, inActiveStories: Inactive })
        });
    })
}

const searchPost = async (req, res, next) => {

    const search = await req.query.search
    const sqlSelect = `SELECT story_id,title,short_story,body,post_thumbnail,tags,stories.created_at AS stories_created_at,stories.updated_at AS stories_updated_at,stories.is_deleted AS stories_is_deleted,c.id AS community_id,community_title,image_url,u.user_id,fullname,username FROM stories INNER JOIN communities c on stories.community_id = c.id join users u on stories.user_id = u.user_id WHERE (stories.story_id LIKE ('%${search}%') OR title LIKE ('%${search}%') OR tags LIKE ('%${search}%') OR stories.created_at LIKE ('%${search}%'));`;

    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    });
}

const countArticles = async (req, res, next) => {

    const sqlSelect = `SELECT COUNT(id) as active_count from posts  WHERE is_deleted = 0`;
    const sqlSelectInActive = `SELECT COUNT(id) as inactive_count from posts WHERE is_deleted = 1`;

    db.query(sqlSelect, (err, active) => {
        if (err) {
            console.log(err); next()
        }
        db.query(sqlSelectInActive, (err, Inactive) => {
            if (err) {
                console.log(err); next()
            }
            res.send({ activeArticles: active, inActiveArticles: Inactive })
        });
    })
}

const allAdminArticle = async (req, res, next) => {
    const show = await req.query.show
    const { time, active, cid } = await req.params

    const sqlSelect = `SELECT posts.id AS post_id,title,redirect_link,community_id,source_text,img_link,description,posts.created_at AS post_created_at,posts.updated_at as post_updated_at,posts.is_deleted as post_is_deleted,c.id AS community_id ,community_title,image_url,c.is_deleted AS communtiy_is_deleted, u.user_id, u.username FROM posts INNER JOIN communities c on posts.community_id = c.id JOIN users u on posts.user_id = u.user_id WHERE posts.is_deleted = ${active} ORDER BY posts.id ${time} LIMIT 10 OFFSET ${show};`;
    const sqlCom = `SELECT posts.id AS post_id,title,redirect_link,source_text,img_link,description,posts.created_at AS post_created_at,posts.updated_at as post_updated_at,posts.is_deleted AS post_is_deletd,c.id AS community_id ,community_title,image_url,c.is_deleted, u.user_id , fullname,username FROM posts INNER JOIN communities c on posts.community_id = c.id JOIN users u on posts.user_id = u.user_id WHERE community_id = ${cid} AND posts.is_deleted = ${active} ORDER BY posts.id  LIMIT 10 OFFSET ${show};`
    if (cid !== 'null') {
        db.query(sqlCom, (err, documents) => {
            if (err) {
                console.log(err); next()
            }

            res.send(documents)
        });
    } else if (cid === 'null') {
        db.query(sqlSelect, (err, documents) => {
            if (err) {
                console.log(err); next()
            }

            res.send(documents)
        });
    }

}

const searchArticle = async (req, res, next) => {

    const search = await req.query.search
    const sqlSelect = `SELECT  posts.id AS post_id,title,redirect_link,source_text,img_link,description,posts.created_at AS post_created_at,posts.updated_at as post_updated_at,posts.is_deleted AS post_is_deletd,c.id AS community_id ,community_title,image_url,c.is_deleted, u.user_id , fullname,username, avatar FROM posts JOIN communities c on posts.community_id = c.id JOIN users u on posts.user_id = u.user_id WHERE (posts.id LIKE ('%${search}%') OR redirect_link LIKE ('%${search}%') OR posts.created_at LIKE ('%${search}%'))`;

    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    });
}

const adminLogin = async (req, res, next) => {
    const email = await req.query.email
    const pass = await req.headers.authorization;

    const sqlQuery = `SELECT email, role from users WHERE email = '${email}'`
    db.query(sqlQuery, (err, doc) => {
        if (err) {
            console.log(err); next()
            res.send({ error: 'Invalid Details' })
        }
        if (doc[0].role == 'admin') {
            const sqlQuery = `SELECT * from users WHERE email = '${email}'`
            db.query(sqlQuery, (err, doc) => {
                if (err) {
                    console.log(err); next()
                    res.send({ error: 'Invalid Details' })
                }
                else {
                    isValidPass = (doc.map(pass => pass.password).toString() === md5(pass))
                    if (isValidPass) {
                        const token = createToken(doc.map(id => id.user_id))
                        const { user_id, email, fullname, username, gender, avatar, dob } = doc[0]
                        res.send({ info: { user_id, email, fullname, username, gender, avatar, dob }, token })
                    }
                }
            })
        } else { res.send({ error: 'Invalid Details' }) }

    })

}

const banStories = async (req, res, next) => {
    const id = await req.params.id
    const sqlBan = `UPDATE fnmotivation.stories t SET t.is_deleted = 1 WHERE story_id = ${id} `

    db.query(sqlBan, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    });
}

const unBanStories =  async (req, res, next) => {
    const id = await req.params.id
    const sqlBan = `UPDATE fnmotivation.stories t SET t.is_deleted = 0 WHERE story_id = ${id} `

    db.query(sqlBan, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    });
}

const banArticles = async (req, res, next) => {
    const id = await req.params.id
    const sqlBan = `UPDATE fnmotivation.posts t SET t.is_deleted = 1 WHERE id = ${id} `
    console.log(id)
    db.query(sqlBan, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    });
}

const unBanArticles =  async (req, res, next) => {
    const id = await req.params.id
    const sqlBan = `UPDATE fnmotivation.posts t SET t.is_deleted = 0 WHERE id = ${id} `

    db.query(sqlBan, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    });
}


const adminUserDataExport = (req, res, next) => {
    const sqlUserExport = `select user_id, fullname, username, role, email, FacebookID, GoogleId, gender, dob, created_at, is_deleted from users`;
    db.query(sqlUserExport, async (err, doc) => {
        if (err) {
            console.log(err)
            res.send({ error: 'Invalid Details' })
        } else {
            try {
                const user = [];
                doc.forEach((item) => {
                    user.push({
                        user_id: item.user_id,
                        fullname: item.fullname,
                        username: item.username,
                        role: item.role,
                        email: item.email,
                        method: item.FacebookID && 'Facebook' || item.GoogleId && 'Gmail' || !item.FacebookID && !item.GoogleId && 'Email',
                        gender: item.gender,
                        dob: item.dob,
                        created_at: item.created_at,
                        status: item.is_deleted == '0' ? 'active' : 'Inactive'
                    });
                });

                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('FNMotivation Users Data');
                worksheet.columns = [
                    { header: 'User ID', key: 'user_id', width: 10 },
                    { header: 'Name', key: 'fullname', width: 50 },
                    { header: 'User Name', key: 'username', width: 50 },
                    { header: 'Role', key: 'role', width: 50 },
                    { header: 'Email', key: 'email', width: 50 },
                    { header: 'Method', key: 'method', width: 50 },
                    { header: 'Gender', key: 'gender', width: 10 },
                    { header: 'Birthday', key: 'dob', width: 15 },
                    { header: 'Created', key: 'created_at', width: 15 },
                    { header: 'Status', key: 'status', width: 15 }
                ];
                worksheet.addRows(user)

                worksheet.getRow(1).eachCell((cell) => {
                    cell.font = { bold: true };
                });

                res.setHeader(
                    "Content-Type",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
                res.setHeader(
                    "Content-Disposition",
                    "attachment; filename=" + "FNMotivation Users Data.xlsx"
                );
                return workbook.xlsx.write(res).then(function () {
                    res.status(200).end();
                });

            }
            catch (err) {
                console.log(err)
            }
        }

    })
}




module.exports = {
    allAdminStories,
    searchPost,
    allAdminArticle,
    searchArticle,
    adminLogin,
    countStories,
    countArticles,
    banArticles,
    unBanArticles,
    adminUserDataExport,
    banStories,
    unBanStories

}