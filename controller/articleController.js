const db = require('../api/DB');
const ogs = require('open-graph-scraper');
var _ = require('lodash');
const fs = require('fs');
const transporter = require('../api/Email')
const metascraper = require('metascraper')([
    require('metascraper-description')(),
    require('metascraper-image')(),
    require('metascraper-title')(),
    require('metascraper-url')()
])
const got = require('got')
const moment = require("moment-timezone")

const getArticlePreview = async (req, res, next) => {
    const { body: html, url } = await got(req.query.url)
    const metadata = await metascraper({ html, url })

    if (!metadata.description && !metadata.title) {
        console.log('error: Get Url');  // This is returns true or false. True if there was a error. The error it self is inside the results object.
        res.status(404).json({ msg: 'Url Not Detected' })
    }
    else {
        ogTitle = metadata.title 
        ogUrl = url 
        ogImage = metadata.image 
        ogDescription = metadata.description
        res.send({ogTitle, ogUrl, ogImage, ogDescription })
    }
}

//Post Article 

const postArticle = async (req, res, next) => {
    const articleTitle = await req.body.articleTitle
    const articleCommunity = await req.body.articleCommunity
    const sourceText = await req.body.sourceText
    const link = await req.body.link
    const articleDescription = await req.body.articleDescription
    const articleImageLink = await req.body.articleImageLink
    const userID = await req.body.userID
    const mail = await req.body.mail


    const sqlEmail = `SELECT fullname, email from users where user_id = ${userID}`;
    const sqlSelect = `INSERT INTO posts (title, redirect_link, community_id, source_text, img_link, description, user_id) VALUES ( ? , ? , ? , ? , ? , ? , ?)`
    db.query(sqlSelect, [articleTitle, link, articleCommunity, sourceText, articleImageLink, articleDescription, userID], (err, documents) => {
        if (err) {
            console.log(err);
        }
        res.send(documents)
        
        db.query(sqlEmail, (err, doc) => {
            if (err) {
                console.log(err)
            }
            else if(mail === 'true'){
                let emailTemplate = fs.readFileSync('./emailTemplates/article-published.html', { encoding: 'utf-8' });
                emailTemplate = emailTemplate.replace('[personName]', doc[0].fullname)
                emailTemplate = emailTemplate.replace('[post]', articleTitle)

                const mailOptions = {
                    from: 'info@fnmotivation.com',
                    to: `${doc[0].email}`,
                    subject: "FNMotivation Article Post Successfully",
                    html: emailTemplate

                }
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log(err)
                    }
                    console.log(info)
                    next()
                })
            }
        })

    })
}

//Get All Article

const allArticle = async (req, res, next) => {
    const show = await req.query.show
    const sqlSelect = `SELECT posts.id,title,posts.redirect_link,posts.community_id,source_text,img_link,description,posts.user_id,posts.created_at,posts.updated_at,posts.is_deleted,c.community_title,c.image_url,c.is_deleted,u.user_id,fullname,username,email,gender,avatar,subscribe_newsletter,dob,u.created_at,u.updated_at,u.is_deleted  FROM posts INNER JOIN communities c on posts.community_id = c.id INNER JOIN users u on posts.user_id = u.user_id WHERE posts.is_deleted = 0 AND c.is_deleted = 0 AND u.is_deleted = 0 ORDER BY posts.created_at DESC LIMIT 4 OFFSET ${show}`
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err);
            next()
        }
        res.send(documents)
    })

}

//Get Community Article

const coummunityArticle = async (req, res, next) => {
    const show = await req.query.show
    const community = await req.params.community

    const sqlSelect = `SELECT posts.id,title,posts.redirect_link,posts.community_id,source_text,img_link,description,posts.user_id,posts.created_at,posts.updated_at,posts.is_deleted,c.community_title,c.image_url,c.is_deleted,u.user_id,fullname,username,email,gender,avatar,subscribe_newsletter,dob,u.created_at,u.updated_at,u.is_deleted  FROM posts INNER JOIN communities c on posts.community_id = c.id INNER JOIN users u on posts.user_id = u.user_id WHERE posts.is_deleted = 0 AND c.is_deleted = 0 AND u.is_deleted = 0 AND c.id = ${community} ORDER BY posts.created_at DESC LIMIT 12 OFFSET ${show}`
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err);
            next()
        }
        res.send(documents)
    })

}

//Get All for All Article

const getAllArticleForAll = async (req, res, next) => {
    const show = await req.query.show
    const sqlSelect = `SELECT posts.id as post_id,title,posts.redirect_link,posts.community_id,source_text,img_link,description,posts.user_id,posts.created_at,posts.updated_at,posts.is_deleted,c.community_title,c.image_url,c.is_deleted,u.user_id,fullname,username,email,gender,avatar,subscribe_newsletter,dob,u.created_at,u.updated_at,u.is_deleted  FROM posts INNER JOIN communities c on posts.community_id = c.id INNER JOIN users u on posts.user_id = u.user_id WHERE posts.is_deleted = 0 AND c.is_deleted = 0 AND u.is_deleted = 0 ORDER BY posts.created_at DESC LIMIT 12 OFFSET ${show}`
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err);
            next()
        }

        res.send(documents)
    })

}

// Get PArticular Article

const getPArticularArticle = async (req, res, next) => {
    const id = await req.query.id
    const sqlSelect = `SELECT posts.id,title,posts.redirect_link,posts.community_id,source_text,img_link,description,posts.user_id,posts.created_at,posts.updated_at,posts.is_deleted,c.community_title,c.image_url,c.is_deleted,u.user_id,fullname,username,gender,avatar,subscribe_newsletter,dob,u.created_at,u.updated_at,u.is_deleted  FROM posts INNER JOIN communities c on posts.community_id = c.id INNER JOIN users u on posts.user_id = u.user_id WHERE posts.is_deleted = 0 AND c.is_deleted = 0 AND u.is_deleted = 0 AND posts.id =  ${id}`;
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    })
}

// All Article of a user

const getAllArticleOfParticularUser = async (req, res, next) => {
    const id = await req.query.id
    const userID = id.split(',')[0]
    const show = id.split(',')[1]
    const sqlCount = `SELECT COUNT(id) as article_count from posts WHERE user_id = ${userID} and is_deleted = 0`
    const sqlSelect = `SELECT posts.id,title,redirect_link,community_id,source_text,img_link,description,user_id,created_at,updated_at,posts.is_deleted,community_title,image_url,c.is_deleted FROM posts INNER JOIN communities c on posts.community_id = c.id WHERE posts.is_deleted = 0 AND c.is_deleted = 0 AND posts.user_id =  '${userID}' ORDER BY posts.created_at DESC LIMIT ${show}, 10 ;`;
    if (userID && show) {
        db.query(sqlCount, (err, count) => {
            if (err) {
                console.log(err); next()
            }
            db.query(sqlSelect, (err, documents) => {
                if (err) {
                    console.log(err); next()
                }
                res.send({data: documents, count: count})
    
            })

        })
    }
}
// Search Article of a user

const getUserSearchAllArticle = async (req, res, next) => {
    const data = await req.query.search
    const userID = data.split(',')[0]
    const search = data.split(',')[1]
    const sqlSelect = `SELECT posts.id,title,redirect_link,community_id,source_text,img_link,description,user_id,created_at,updated_at,posts.is_deleted,community_title,image_url,c.is_deleted FROM posts INNER JOIN communities c on posts.community_id = c.id WHERE (posts.title LIKE  ('%${search}%') OR posts.source_text LIKE ('%${search}%')  OR community_title LIKE ('%${search}%')) AND posts.is_deleted = 0 AND user_id = '${userID}' ORDER BY posts.created_at DESC;`;
    if (data) {
        db.query(sqlSelect, (err, documents) => {
            if (err) {
                console.log(err); next()
            }
            res.send(documents)


        })
    }
}
// Selected Artcile

const getSelectedArticle = async (req, res, next) => {
    const catID = await req.query.catID
    console.log('sel', catID)
    const sqlSelect = `SELECT * FROM posts WHERE community_id = '${catID}' AND is_deleted = 0 LIMIT 12;`;
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)

    })
}

// Community Article

const getAllCommunityArticle = async (req, res, next) => {
    const id = await req.query.id
    const userID = id.split(',')[0]
    const show = id.split(',')[1]

    const sqlSelect = `SELECT p.id as post_id,title,redirect_link,community_id,source_text,img_link,description,p.user_id,p.created_at,p.updated_at,p.is_deleted,c.community_title, c.id,c.image_url,u.user_id,fullname,username,email,about,GoogleId,AppleId,GoogleAuthKey,AppleAuthKey,gender,password,role,avatar,subscribe_newsletter,dob,u.created_at,u.updated_at,u.is_deleted FROM users_community_subscription INNER JOIN posts p on users_community_subscription.CommunityId = p.community_id INNER JOIN users u on p.user_id = u.user_id INNER JOIN communities c on p.community_id = c.id WHERE UserId = '${userID}' AND p.is_deleted = 0 AND Type = 1 AND u.is_deleted = 0 ORDER BY p.created_at DESC  LIMIT 12 OFFSET ${show} ;`;
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)

    })
}

// Follwoing Article

const getAllFollowingArticle = async (req, res, next) => {
    const id = await req.query.id
    const userID = id.split(',')[0]
    const show = id.split(',')[1]

    const sqlSelect = `SELECT p.id as post_id,title,redirect_link,community_id,source_text,img_link,description,p.user_id,p.created_at,p.updated_at,p.is_deleted,p.user_id,fullname,username,email,about,GoogleId,AppleId,GoogleAuthKey,AppleAuthKey,gender,password,role,avatar,subscribe_newsletter,dob,u.created_at,u.updated_at,u.is_deleted,c.id,c.community_title,c.image_url,c.is_deleted FROM followers INNER JOIN posts p on followers.user_id = p.user_id INNER JOIN users u on p.user_id = u.user_id INNER JOIN communities c on p.community_id = c.id WHERE follower_id =  '${userID}' AND Type = 1 AND p.is_deleted = 0 AND u.is_deleted = 0  ORDER BY p.created_at DESC LIMIT 12 OFFSET ${show} ;`;
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }

        res.send(documents)

    })
}

//Popular Article 

var now = moment();
var localOffset = now.utcOffset();
now.tz("America/Danmarkshavn"); // your time zone, not necessarily the server's
let time = moment(now).subtract(24, 'hours').format()

const getAllPopularArticle = async (req, res, next) => {
    const show = await req.query.show

    const sqlSelect = `SELECT posts.id AS post_id, title, redirect_link, community_id, source_text, img_link, description, posts.created_at, posts.updated_at, posts.is_deleted, c.id AS community_id, community_title, image_url, u.user_id, fullname, username, email, about, ptc.total_comments FROM posts INNER JOIN communities c on posts.community_id = c.id INNER JOIN users u on posts.user_id = u.user_id INNER JOIN posts_total_comments ptc on posts.id = ptc.post_id INNER JOIN posts_likes_counter plc on posts.id = plc.post_id WHERE u.is_deleted = 0 AND c.is_deleted = 0 AND posts.is_deleted = 0 AND  (ptc.updated_at BETWEEN '${time}' AND NOW() OR plc.updated_at BETWEEN '${time}' AND NOW()) AND c.id = 2 ORDER BY (total_likes+total_comments) DESC LIMIT 12 OFFSET ${show} ;`;
    const sqlLikePopular = `SELECT posts.id AS post_id,title,redirect_link,community_id,source_text,img_link,description,posts.created_at,posts.updated_at,posts.is_deleted,c.id AS community_id,community_title,image_url,u.user_id,fullname,username,email,about,ptc.total_comments FROM posts INNER JOIN communities c on posts.community_id = c.id INNER JOIN users u on posts.user_id = u.user_id INNER JOIN posts_total_comments ptc on posts.id = ptc.post_id JOIN posts_likes_counter plc on posts.id = plc.post_id WHERE c.is_deleted = 0 AND posts.is_deleted = 0   ORDER BY (total_comments+total_likes) DESC LIMIT 12 OFFSET ${show};`;

    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        if(documents.length !== 0){
            res.send(documents)
        } else{
            db.query(sqlLikePopular, (err, documents) => {
                if (err) {
                    console.log(err); next()
                }
              res.send(documents)
            })
        }

    })
}

//Delete PArticular Article 

const deleteParticularArticle = async (req, res, next) => {
    const id = await req.query.id
    const sqlSelect = `UPDATE fnmotivation.posts t SET t.is_deleted = '1' WHERE t.id= '${id}'`;
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)

    })
}

module.exports = {
    getArticlePreview,
    postArticle,
    allArticle,
    getPArticularArticle,
    getAllArticleOfParticularUser,
    getUserSearchAllArticle,
    getSelectedArticle,
    getAllCommunityArticle,
    getAllFollowingArticle,
    getAllPopularArticle,
    deleteParticularArticle,
    getAllArticleForAll,
    coummunityArticle
}